// A library for generating mock data
const casual = require('casual');

const categories = [
  'housing',
  'jobs',
  'employment_services',
  'on-boarding',
  'translations',
  'goods',
  'transportation',
];

const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland',
  'Northern Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',
];

exports.seed = function seed(knex) {
  // First, delete all posts from the table
  return knex('posts')
    .del()
    .then(() => (
      // Next delete a mock user
      knex('users')
        .del()
        .where({ email: 'dummy@email.com' })
    ))
    .then(() => {
      // Then create 10 mock users (so we have more than one account for testing
      // posts)
      const mockUsers = [];

      for (let i = 0; i < 10; i += 1) {
        mockUsers.push({
          google_id: casual.integer(from = 10000000, to = 99999999),
          avatar_url: 'https://avatars.githubusercontent.com/u/92953487?v=4',
          first_name: casual.first_name,
          last_name: casual.last_name,
          address: casual.address1,
          city: casual.city,
          province: casual.random_element(provinces),
          phone: casual.phone,
          postal_code: casual.zip({ digits: 5 }),
          email: casual.email,
          volunteer: casual.boolean,
        });
      }
      return knex('users').insert(mockUsers);
    })
    .then(() => (
      // Get all user ids from users table
      knex('users')
        .select('id')
    ))
    .then((userIds) => {
      const mockPosts = [];

      // Generate 25 posts
      for (let i = 0; i < 50; i += 1) {
        // Select a user id randomly from the list of users to create a post for
        const randomIndex = Math.floor(Math.random() * userIds.length);
        const randomId = userIds[randomIndex].id;

        // Use user id from users table for user_id and `casual` library to generate mock title and content fields
        mockPosts.push({
          user_id: randomId,
          title: casual.title,
          description: casual.sentences(10),
          category: casual.random_element(categories),
          offer: casual.boolean,
          active: casual.boolean,
        });
      }

      // Insert mock posts into the table
      return knex('posts').insert(mockPosts);
    });
};

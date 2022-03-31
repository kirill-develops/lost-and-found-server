/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
// A library for generating mock data
const casual = require('casual');

exports.seed = function (knex) {
  // First, delete all posts from the table
  return knex('posts')
    .del()
    .then(() => {
      // Next delete a mock user
      return knex('users')
        .del()
        .where({ email: 'dummy@email.com' });
    })
    .then(() => {
      // Then create a mock user (so we have more than one account for testing posts)
      return knex('users')
        .insert({
          google_id: 92953487,
          avatar_url: 'https://avatars.githubusercontent.com/u/92953487?v=4',
          first_name: 'test',
          last_name: 'account',
          address: casual.address,
          city: casual.city,
          province: casual.state,
          phone: casual.phone,
          email: 'dummy@email.com',
        });
    })
    .then(() => {
      // Get all user ids from users table
      return knex('users')
        .select('id');
    })
    .then((userIds) => {
      const mockPosts = [];

      // Generate 10 posts
      for (let i = 0; i < 25; i++) {
        // Select a user id randomly from the list of users to create a post for
        const randomIndex = Math.floor(Math.random() * userIds.length);
        const randomId = userIds[randomIndex].id;

        // Use user id from users table for user_id and `casual` library to generate mock title and content fields
        mockPosts.push({
          user_id: randomId,
          title: casual.title,
          description: casual.sentences(10),
          category: casual.word,
          offer: casual.boolean,
          active: casual.boolean,
        });
      }

      // Insert mock posts into the table
      return knex('posts').insert(mockPosts);
    });
};

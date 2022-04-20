/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */

const knex = require('knex')(require('../knexfile.js').development);


// controller to getAll Posts
exports.getAll = (req, res) => {
  // Select post and user fields by using a join between posts and users tables and order them chronologically, newest first
  knex
    .select(
      'posts.id as post_id',
      'posts.title',
      'posts.description',
      'posts.category',
      'posts.pic_url',
      'posts.offer',
      'posts.active',
      'posts.updated_at',
      'users.id as users_id',
      'users.avatar_url',
      'users.first_name',
      'users.city',
      'users.province',
    )
    .from('posts')
    .leftJoin('users', 'posts.user_id', 'users.id')
    .orderBy('posts.id', 'desc')
    .then((posts) => {
      let updatedPosts = posts;

      // Check if user is logged in and update all logged in user's posts with "isCurrentUser" field
      req.user && (
        updatedPosts = updatedPosts.map((post) => {
          return {
            ...post,
            isCurrentUser: post.users_id === req.user.id,
          };
        })
      );

      res.status(200).json(updatedPosts);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching posts' });
    });
};

// controller to getOne Post by ID
exports.getOne = (req, res) => {
  // Select post and user fields by using a join between posts and users tables
  // and order them chronologically, newest first
  knex
    .select(
      'posts.id as post_id',
      'posts.title',
      'posts.description',
      'posts.category',
      'posts.pic_url',
      'posts.offer',
      'posts.active',
      'posts.updated_at',
      'users.id as users_id',
      'users.avatar_url',
      'users.first_name',
      'users.city',
      'users.province',
    )
    .from('posts')
    .where({ 'posts.id': req.params.postId })
    .leftJoin('users', 'posts.user_id', 'users.id')
    .then((post) => {
      let updatedPost = post;

      // Check if user is logged in and update all logged in user's posts with "isCurrentUser" field
      req.user && (
        updatedPost = updatedPost.map((post) => {
          return {
            ...post,
            isCurrentUser: post.users_id === req.user.id,
          };
        })
      );

      res.status(200).json(...updatedPost);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching posts' });
    });
};


// controller to create a new Post
exports.addOne = (req, res) => {
  // Deconstructing req.body for easier code digestion
  const { title, description, category, offer, pic_url: picUrl } = req.body;
  // If user is not logged in, we don't allow them to create a new post
  return (req.user === undefined) ? (
    res.status(401).json({ message: 'Unauthorized' })
    // Validate request body for required fields
  ) : (!title || !description || !category) ? (
    res.status(400).json({ message: 'Missing post title or content fields' })
  ) : (
    // Insert new post into DB: user_id comes from session, title and content from a request body
    knex('posts')
      .insert({
        user_id: req.user.id,
        title: title,
        description: description,
        category: category,
        offer: offer,
        pic_url: picUrl,
        active: true,
      })
      .then((postId) => {
        // Send newly created postId as a response
        res.status(201).json({ newPostId: postId[0] });
      })
      .catch(() => {
        res.status(500).json({ message: 'Error creating a new post' });
      })
  );
};

// todo Test route
exports.editOne = (req, res) => {
  return (req.user === undefined) ? (
    res.status(401).json({ message: 'Unauthorized' })
    // Validate request body for required fields
  ) : (
    knex('posts')
      .update(req.body)
      .where({ user_id: req.user.id, id: req.body.id })
      .then(() => {
        res.send(`post with id: ${req.body.id} belonging to ${req.user.id} has been updated`);
      })
      .catch((err) => {
        res.send(`Error updating post with id: ${req.body.id} belonging to ${req.user.id} ${err}`).status(400);
      })
  );
};

// todo Test route
exports.deleteOne = (req, res) => {
  return (req.user === undefined) ? (
    res.status(401).json({ message: 'Unauthorized' })
    // Validate request body for required fields
  ) : (
    knex('posts')
      .delete()
      .where({ user_id: req.user.id, id: req.body.id })
      .then(() => {
        res.status(204).send(`post with id: ${req.body.id} belonging to ${req.user.id} has been deleted`);
      })
      .catch((err) => {
        res.status(400).send(`Error deleting post with id: ${req.body.id} belonging to ${req.user.id} ${err}`);
      })
  );
};

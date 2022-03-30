/* eslint-disable indent */
const express = require('express');
const router = express.Router();

const PostController = require('../controller/post');


// Get all posts route
router.route('/')
  .get(PostController.getAll)
  .post(PostController.addPost);

// export this module
module.exports = router;

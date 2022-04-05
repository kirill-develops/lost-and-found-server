/* eslint-disable new-cap */
/* eslint-disable indent */
const express = require('express');
const router = express.Router();

// Import Post Controllers
const PostController = require('../controller/post');


// Get all posts & add a new post routes
router.route('/')
  .get(PostController.getAll)
  .post(PostController.addOne);

// 'Get One', 'edit one' and 'delete one' post routes
router.route('/:postId')
  .get(PostController.getOne)
  .put(PostController.editOne)
  .delete(PostController.deleteOne);

// export this module
module.exports = router;

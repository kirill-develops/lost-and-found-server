/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable indent */
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

const AuthController = require('../controller/auth');


// Create a login endpoint which kickstarts the auth process and takes user to a consent page
router.get('/google', passport.authenticate('google'));


// Google auth Callback: http://localhost:5050/auth/google/callback
// This is the endpoint that Google will redirect to after user responds on consent page
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
  }),
  (_req, res) => {
    console.log(res);
    // Successful authentication, redirect to client-side application
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  },
);


// User profile endpoint that requires authentication
router.route('/profile')
  .get(AuthController.getProfile)
  .put(AuthController.editProfile);


// Create a logout endpoint
router.get('/logout', AuthController.logoutProfile);

// Export this module
module.exports = router;

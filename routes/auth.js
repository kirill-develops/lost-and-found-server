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
    successRedirect: process.env.CLIENT_URL
  })
);


// User profile endpoint that requires authentication
router.get('/profile', AuthController.getProfile);


// Create a logout endpoint
router.get('/logout', AuthController.logoutProfile);

// Export this module
module.exports = router;
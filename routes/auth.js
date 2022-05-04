const express = require('express');

const router = express.Router();
const passport = require('passport');
require('dotenv').config();

const AuthController = require('../controller/auth');

// Create a login endpoint which kickstarts the auth process and takes user to a consent page
router.get('/google', (req, _res, next) => {
  req.session.analysis_id = req._parsedUrl.query;
  next();
}, passport.authenticate('google'));

// This is the endpoint that Google will redirect to after user responds on consent page
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
  }),
  (req, res) => {
    const param = req.session.analysis_id;
    // Successful authentication, redirect to client-side application
    if (!param || param === '/') {
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}${param}`);
    }
  },
);

// User profile endpoint that requires authentication
router.route('/profile')
  .get(AuthController.getProfile)
  .put(AuthController.editProfile)
  .delete(AuthController.deleteProfile);

router.route('/profile/:id')
  .get(AuthController.getProfileById);

// Create a logout endpoint
router.get('/logout', AuthController.logoutProfile);

// Export this module
module.exports = router;

const express = require('express');
const cors = require('cors');
const expressSession = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();


// Knex instance
const knex = require('knex')(require('./knexfile.js').development);

// allow for app PORT to be optionally specified by an environment variable
const PORT = process.env.PORT || 5050;

// Require .env files for environment variables (keys and secrets)
require('dotenv').config();

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

// Enable CORS (with additional config options required for cookies)
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Include express-session middleware (with additional config options required for Passport session)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// =========== Passport Config ============

// Initialize Passport middleware
app.use(passport.initialize());

// Passport.session middleware alters the `req` object with the `user` value
// by converting session id from the client cookie into a deserialized user object.
// This middleware also requires `serializeUser` and `deserializeUser` functions written below
// Additional information: https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
app.use(passport.session());

// Initialize Google strategy middleware
// https://www.passportjs.org/packages/passport-google-oauth20/
// We can add multiple strategies with `passport.use` syntax
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile']
    },
    (_accessToken, _refreshToken, profile, done) => {
      // For our implementation we don't need access or refresh tokens.
      // Profile parameter will be the profile object we get back from Google
      console.log('Google profile:', profile);
      let id = String(profile.id).slice(-18);
      let profileId = Number(id);

      // First let's check if we already have this user in our DB
      knex('users')
        .select('id')
        .where({ google_id: profileId })
        .then(user => {
          if (user.length) {
            // If user is found, pass the user object to serialize function
            done(null, user[0]);
          } else {

            // If user isn't found, we create a record
            knex('users')
              .insert({
                google_id: profileId,
                avatar_url: profile._json.picture,
                username: profile.displayName
              })
              .then(userId => {
                // Pass the user object to serialize function
                done(null, { id: userId[0] });
              })
              .catch(err => {
                console.log('Error creating a user', err);
              });
          }
        })
        .catch(err => {
          console.log('Error fetching a user', err);
        });
    }
  )
);

// `serializeUser` determines which data of the auth user object should be stored in the session
// The data comes from `done` function of the strategy
// The result of the method is attached to the session as `req.session.passport.user = 12345`
passport.serializeUser((user, done) => {
  console.log('serializeUser (user object):', user);

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
  console.log('deserializeUser (user id):', userId);

  // Query user information from the database for currently authenticated user
  knex('users')
    .where({ id: userId })
    .then(user => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log('req.user:', user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch(err => {
      console.log('Error finding user', err);
    });
});

// Additional information on serializeUser and deserializeUser:
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize


// Import all route types for server functionality
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/post');

app.use('/auth', authRoutes);
app.use('/post', postsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
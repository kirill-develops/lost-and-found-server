const knex = require('knex')(require('../knexfile').development);

exports.getProfile = (req, res) => (req.user === undefined ? (
  // If `req.user` isn't found send back a 401 Unauthorized response
  res.status(401).json({ message: 'Unauthorized' })
) : (
  // If user is currently authenticated, send back user info
  res.status(200).json(req.user)
));

exports.editProfile = (req, res) => (req.user === undefined ? (
  // If `req.user` isn't found send back a 401 Unauthorized response
  // eslint-disable-next-line object-curly-spacing
  res.status(401).json({ message: 'Unauthorized' })
) : (
  knex('users')
    .update(req.body)
    .where({ id: req.user.id })
    .then(() => {
      res.send(`user with id: ${req.user.id} has been updated`);
    })
    .catch((err) => {
      res.send(`Error updating user ${req.user.id} ${err}`).status(400);
    })
));

// todo get individual profile
exports.getProfileById = (req, res) => { };

exports.logoutProfile = (req, res) => {
  // Passport adds the logout method to request, it will end user session
  req.logout();

  // Redirect the user back to client-side application
  res.redirect(process.env.CLIENT_URL);
};

// todo create delete endpoint
exports.deleteProfile = (req, res) => { };

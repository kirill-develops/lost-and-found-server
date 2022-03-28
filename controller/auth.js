
exports.getProfile = (req, res) => {

  // If `req.user` isn't found send back a 401 Unauthorized response
  if (req.user === undefined) return res.status(401).json({ message: 'Unauthorized' });

  // If user is currently authenticated, send back user info
  res.status(200).json(req.user);
}

exports.logoutProfile = (req, res) => {
  // Passport adds the logout method to request, it will end user session
  req.logout();

  // Redirect the user back to client-side application
  res.redirect(process.env.CLIENT_URL);
}
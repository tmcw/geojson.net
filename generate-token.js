const jwt = require('jsonwebtoken');

// Generate an Access Token for the given User ID
module.exports = function generateJwt(user) {
  const token = jwt.sign(user, process.env.SESSION_SECRET, {
    expiresIn: 86400 * 30,
    audience: 'geojsonnet',
    issuer: 'geojsonnet'
  });

  return token;
}
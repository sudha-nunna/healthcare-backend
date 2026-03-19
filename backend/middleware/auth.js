const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

function adminKey(req, res, next) {
  // If ADMIN_KEY not set, don't block requests (optional bonus feature).
  const expected = process.env.ADMIN_KEY;
  if (!expected) return next();

  const provided = req.header('x-admin-key');
  if (!provided || provided !== expected) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

module.exports = adminKey;

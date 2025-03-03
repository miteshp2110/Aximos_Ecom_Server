const jwt = require('jsonwebtoken');

exports.googleAuthCallback = (req, res) => {
  
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  
  const payload = {
    id: req.user.id,
    role: req.user.role,
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

exports.loginFailure = (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
};

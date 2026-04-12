const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token from header:", token);
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.userId;
    next();
  });
};
module.exports = { authenticateToken };
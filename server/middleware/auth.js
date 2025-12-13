const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Logic: jwt.verify takes the raw token and the private JWT_SECRET key from your environment. 
    // If the signature matches and the token hasn't expired, it returns the original payload 
    // (which you defined as {userId: user._id} in the login route). If verification fails, 
    // It throws an error and execution jumps to the catch block.

    req.userId = decoded.userId; 
    // Logic: The middleware extracts the user's unique ID from the decoded payload and attaches 
    // it to the req object. This makes the userId easily accessible to all subsequent route 
    // handlers (like router.get('/', ...)), allowing them to filter data specifically for this user.

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
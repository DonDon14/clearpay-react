const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    // 1. Get the token from the header
    const jwtToken = req.header('token');

    if (!jwtToken) {
      return res.status(403).json({ message: 'Not Authorized (No Token)' });
    }

    // 2. Verify the token using our secret key
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // 3. Add the user info to the request (req.user) so the next function can use it
    req.user = payload.user; 
    
    next(); // Continue to the actual route

  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ message: 'Not Authorized (Invalid Token)' });
  }
};
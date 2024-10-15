// @ts-nocheck
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, login required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(402).json({ message: 'Session expired. Please log in again.' });
      } else {
        return res.status(401).json({ message: 'Invalid token, authentication failed' });
      }
    }

    // Token is valid, attach the decoded user data to the request
    req.user = decoded;
    
    next();
  });
};

export default authMiddleware;

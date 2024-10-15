import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_clientID,
    clientSecret: process.env.GOOGLE_clientSecret,
    callbackURL: process.env.GOOGLE_callbackURL
  },
  
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
  
      if (!user) {
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value, // Assuming you want to save the email
        });
        await user.save();
      }
  
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return done(null, { token });
    } catch (error) {
      console.error('Error during authentication:', error);
      done(error, null);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user.token);
});

passport.deserializeUser((token, done) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    done(null, decoded);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
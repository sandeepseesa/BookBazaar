import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    trim: true,
  },
  password: {
    type: String,
    // Password is required only if googleId is not present (manual registration)
    required: function () {
      return !this.googleId;
    },
  },
  salt: {
    type: String,
    // Salt is required only if googleId is not present
    required: function () {
      return !this.googleId;
    },
  },
  googleId:{
    type: String,
     // googleId is only required for Google OAuth users
     required: function () {
      return !!this.googleId;
    },
    sparse: true,
  },
  email: {
    type: String,
     // Email is required only if googleId is not present (manual registration)
    reqired: function () {
      return !!this.googleId;
    },
    unique: true,
    saprse: true,
    trim: true,
    lowercase: true,
  },
  
}, { timestamps: true });

// Ensure the password and salt fields are not returned by default in queries
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.salt;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;

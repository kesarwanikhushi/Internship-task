const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    select: false // Don't return OTP in queries by default
  },
  otpExpiresAt: {
    type: Date,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

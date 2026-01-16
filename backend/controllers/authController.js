const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { getJwtSecret } = require('../config/jwtSecret');
const { sendOTPEmail } = require('../services/emailService');

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash OTP for secure storage
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// STEP 1: Register user and send OTP
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // User registered but not verified - allow re-registration
        await User.deleteOne({ email });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (unverified)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: hashedOTP,
      otpExpiresAt
    });

    await user.save();

    // Send OTP email (non-blocking). We don't want a slow/failed SMTP to hang registration.
    sendOTPEmail(email, otp, name)
      .then(() => console.log('✅ OTP email sent successfully to:', email))
      .catch(async (emailError) => {
        console.error('❌ Email send failed (non-blocking)');
        console.error('Error message:', emailError.message);
        console.error('Error code:', emailError.code);
        console.error('Error name:', emailError.name);
        if (emailError.response) {
          console.error('SMTP Response:', emailError.response);
        }
        // Note: We still return success to user since account was created
      });

    return res.status(201).json({
      message: 'Registration successful! Please check your email for the OTP.',
      email: email,
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: error.message || 'Registration failed. Please try again.' 
    });
  }
};

// STEP 2: Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user with OTP fields
    const user = await User.findOne({ email }).select('+otp +otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP found. Please register again.' });
    }

    // Check if OTP expired
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Verify OTP
    const hashedOTP = hashOTP(otp);
    if (user.otp !== hashedOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: '7d'
    });

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      message: 'Email verified successfully!',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ 
      message: error.message || 'Verification failed. Please try again.' 
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = hashedOTP;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    return res.json({ message: 'OTP resent successfully!' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ 
      message: error.message || 'Failed to resend OTP. Please try again.' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: '15m'
    });

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: '7d'
    });

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: error.message || 'Login failed. Please try again.' 
    });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, getJwtSecret());
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Find user and verify stored refresh token
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: '15m'
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ 
      message: error.message || 'Token refresh failed. Please try again.' 
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      message: error.message || 'Logout failed. Please try again.' 
    });
  }
};

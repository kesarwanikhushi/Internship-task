const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For production, use a real email service (Gmail, SendGrid, etc.)
  // This example uses Gmail - you need to enable "App Passwords" in your Google account
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    // Use explicit SMTP settings for Gmail with sensible timeouts to avoid hanging
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: (process.env.EMAIL_SECURE === 'true') || true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
      },
      // Timeouts to prevent indefinite waiting
      connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT) || 10000,
      greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT) || 10000,
      socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT) || 10000
    });
  }
  
  // For development/testing, use Ethereal (fake SMTP)
  // Emails won't be sent but you can view them at ethereal.email
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT) || 10000,
    greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT) || 10000,
    socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT) || 10000
  });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Task Manager" <noreply@taskmanager.com>',
      to: email,
      subject: 'Verify Your Email - Task Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .otp-box { background: white; border: 2px solid #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with Task Manager. To complete your registration, please verify your email address.</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your verification code is:</p>
                <div class="otp">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <div class="footer">
                <p>© 2026 Task Manager. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${name}!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account with us, please ignore this email.`
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // For development with Ethereal
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVICE) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email (for future use)
exports.sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Task Manager" <noreply@taskmanager.com>',
      to: email,
      subject: 'Password Reset Request - Task Manager',
      html: `
        <h2>Hello ${name}!</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetURL}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      text: `Hello ${name}!\n\nYou requested to reset your password. Use this link: ${resetURL}\n\nThis link will expire in 1 hour.`
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send password reset email');
  }
};

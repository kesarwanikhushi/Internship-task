const nodemailer = require('nodemailer');

// Email service clients
let sgMail;
let resendClient;
let brevoClient;

// Initialize email services at module level
const initializeEmailServices = () => {
  // Priority 1: Try Brevo (300 emails/day, no domain verification needed)
  if (process.env.BREVO_API_KEY && !brevoClient) {
    try {
      const brevo = require('@getbrevo/brevo');
      brevoClient = new brevo.TransactionalEmailsApi();
      brevoClient.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
      console.log('✅ Brevo initialized successfully');
      console.log('BREVO_API_KEY starts with:', process.env.BREVO_API_KEY.substring(0, 10));
    } catch (e) {
      console.error('❌ Brevo initialization failed:', e.message);
      brevoClient = null;
    }
  }
  
  // Priority 2: Try Resend
  if (!brevoClient && process.env.RESEND_API_KEY && !resendClient) {
    try {
      const { Resend } = require('resend');
      resendClient = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend initialized successfully');
      console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY.substring(0, 5));
    } catch (e) {
      console.error('❌ Resend initialization failed:', e.message);
      resendClient = null;
    }
  }
  
  // Priority 3: Try SendGrid
  if (!brevoClient && !resendClient && process.env.SENDGRID_API_KEY && !sgMail) {
    try {
      sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid initialized successfully');
    } catch (e) {
      console.error('❌ SendGrid initialization failed:', e.message);
      sgMail = null;
    }
  }
};

// Initialize on module load
initializeEmailServices();

const createTransporter = () => {
  // For production, use Gmail SMTP with App Password
  if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    console.log('===== EMAIL SERVICE CONFIGURATION =====');
    console.log('Using Gmail SMTP for email service');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length, 'chars');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('========================================');
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Must be App Password (16 chars), not regular password
      },
      // Timeouts to prevent indefinite waiting
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      // Enable debug for troubleshooting
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });
  }
  
  // Fallback for development/testing
  console.warn('===== EMAIL SERVICE NOT CONFIGURED =====');
  console.warn('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');
  console.warn('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.warn('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
  console.warn('Falling back to Ethereal (test email only)');
  console.warn('=========================================');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'ethereal.pass'
    }
  });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, name) => {
  console.log('===== SENDING OTP EMAIL =====');
  console.log('To:', email);
  console.log('Brevo available:', !!brevoClient);
  console.log('Resend available:', !!resendClient);
  console.log('SendGrid available:', !!sgMail);
  console.log('BREVO_API_KEY set:', !!process.env.BREVO_API_KEY);
  console.log('RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
  console.log('SENDGRID_API_KEY set:', !!process.env.SENDGRID_API_KEY);
  console.log('=============================');
  
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
    
    // Priority 1: Use Brevo if available (best for free tier - 300 emails/day, any recipient)
    if (brevoClient) {
      console.log('✅ Using Brevo to send email...');
      try {
        const brevo = require('@getbrevo/brevo');
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = mailOptions.subject;
        sendSmtpEmail.htmlContent = mailOptions.html;
        sendSmtpEmail.sender = { 
          name: 'Task Manager', 
          email: process.env.EMAIL_FROM || 'noreply@taskmanager.com' 
        };
        sendSmtpEmail.to = [{ email: email, name: name }];
        
        const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent via Brevo to', email);
        console.log('Brevo message ID:', result.response?.body?.messageId);
        return { success: true, provider: 'brevo', result: result.response?.body };
      } catch (brevoError) {
        console.error('❌ Brevo send failed:', brevoError.message);
        console.error('Brevo error details:', JSON.stringify(brevoError.response?.body || brevoError, null, 2));
        throw brevoError;
      }
    }
    
    // Priority 2: Use Resend if available
    if (resendClient) {
      console.log('\u2705 Using Resend to send email...');
      try {
        const result = await resendClient.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: email,
          subject: mailOptions.subject,
          html: mailOptions.html
        });
        console.log('\u2705 Email sent via Resend to', email);
        console.log('Resend response:', JSON.stringify(result, null, 2));
        return { success: true, provider: 'resend', result };
      } catch (resendError) {
        console.error('\u274c Resend send failed:', resendError.message);
        console.error('Resend error details:', JSON.stringify(resendError, null, 2));
        throw resendError;
      }
    }
    
    // Priority 2: Use SendGrid if available
    if (sgMail) {
      console.log('\u2705 Using SendGrid to send email...');
      try {
        const msg = {
          to: email,
          from: process.env.EMAIL_FROM || 'noreply@taskmanager.com',
          subject: mailOptions.subject,
          text: mailOptions.text,
          html: mailOptions.html
        };
        const res = await sgMail.send(msg);
        console.log('\u2705 Email sent via SendGrid to', email);
        return { success: true, provider: 'sendgrid', result: res };
      } catch (sgError) {
        console.error('\u274c SendGrid send failed:', sgError.message);
        throw sgError;
      }
    }

    // Priority 3: Fall back to SMTP
    console.log('\u26a0\ufe0f No API-based email service available, using SMTP...');
    const info = await transporter.sendMail(mailOptions);

    // For development with Ethereal
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVICE) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    console.log('Email sent via SMTP to', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('====== EMAIL SENDING FAILED ======');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Error Response:', error.response);
    console.error('Error ResponseCode:', error.responseCode);
    console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('===================================');
    
    // Re-throw with the actual error message for better debugging
    throw error;
  }
};

// Send password reset email (for future use)
exports.sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
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
    
    // Priority 1: Use Resend
    if (resendClient) {
      const result = await resendClient.emails.send({
        from: mailOptions.from,
        to: email,
        subject: mailOptions.subject,
        html: mailOptions.html
      });
      return { success: true, provider: 'resend', result };
    }
    
    // Priority 2: Use SendGrid
    if (sgMail) {
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@taskmanager.com',
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html
      };
      await sgMail.send(msg);
      return { success: true, provider: 'sendgrid' };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send password reset email');
  }
};

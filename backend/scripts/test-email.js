// Test email sending functionality
require('dotenv').config();
const { sendOTPEmail } = require('../services/emailService');

const testEmail = async () => {
  console.log('\n====== TESTING EMAIL SERVICE ======');
  console.log('Environment Variables:');
  console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? `SET (${process.env.BREVO_API_KEY.substring(0, 10)}...)` : 'NOT SET');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? `SET (${process.env.RESEND_API_KEY.substring(0, 8)}...)` : 'NOT SET');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
  console.log('===================================\n');

  const testOTP = '123456';
  const testRecipient = process.argv[2] || 'test@example.com';
  const testName = 'Test User';

  console.log(`Sending test OTP email to: ${testRecipient}\n`);

  try {
    const result = await sendOTPEmail(testRecipient, testOTP, testName);
    console.log('\n✅ SUCCESS!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

testEmail();

# Email Configuration Guide

This guide explains how to set up email functionality for OTP verification.

## 🎯 Quick Setup Options

### Option 1: Gmail (Recommended for Production)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Scroll to "App passwords"
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Task Manager <noreply@taskmanager.com>"
```

### Option 2: Ethereal Email (For Development/Testing)

**Perfect for testing without sending real emails!**

1. **Create Free Account:**
   - Visit: https://ethereal.email/create
   - Save the credentials shown

2. **Update .env:**
```env
# Leave EMAIL_SERVICE empty or remove it
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-username
SMTP_PASS=your-ethereal-password
```

3. **View Sent Emails:**
   - Check console logs for "Preview URL"
   - Open the URL to view the email

### Option 3: SendGrid (Professional Option)

1. **Create Account:** https://sendgrid.com/
2. **Get API Key:** Settings → API Keys
3. **Update .env:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM="Task Manager <verified-sender@yourdomain.com>"
```

## 🔍 Testing

### Test with Ethereal:
```bash
# Register a new user
# Check backend console for "Preview URL: https://ethereal.email/message/..."
# Click the URL to view the OTP email
```

### Test with Gmail:
```bash
# Register with a real email
# Check your inbox (and spam folder)
# Use the 6-digit OTP to verify
```

## 🐛 Troubleshooting

### Gmail "Less secure app" error:
- Use App Passwords instead of regular password
- Enable 2FA first

### SendGrid emails not received:
- Verify sender email address in SendGrid dashboard
- Check spam folder
- Review SendGrid activity logs

### Ethereal not working:
- Check if credentials are correct
- Verify SMTP settings
- Look for preview URL in console logs

## 🔐 Security Best Practices

1. **Never commit .env file** - Add it to .gitignore
2. **Use environment variables** for all sensitive data
3. **Rotate credentials regularly** in production
4. **Use different email accounts** for dev/staging/production
5. **Monitor email sending limits** to prevent abuse

## 📊 Email Service Comparison

| Service | Cost | Sending Limit | Best For |
|---------|------|---------------|----------|
| Ethereal | Free | Unlimited (fake) | Development/Testing |
| Gmail | Free | 500/day | Small projects |
| SendGrid | Free tier: 100/day | Paid: Unlimited | Production apps |
| Mailgun | Pay-as-you-go | Based on plan | High-volume apps |

## 🚀 Production Recommendations

For production deployments:
1. Use **SendGrid** or **Mailgun** (better deliverability)
2. Set up **SPF, DKIM, and DMARC** records
3. Use a **custom domain** for sender email
4. Implement **rate limiting** to prevent abuse
5. Monitor **bounce rates** and **spam complaints**

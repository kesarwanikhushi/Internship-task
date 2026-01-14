// Usage: node generate_encrypted_jwt.js
// This script will output a random JWT secret, an encryption key, and the encrypted secret
// Copy the encrypted value into `JWT_SECRET_ENC` and the key into `JWT_SECRET_KEY`.

const crypto = require('crypto');

function generate() {
  const jwtSecret = crypto.randomBytes(32).toString('hex'); // 64 hex chars
  const key = crypto.randomBytes(32).toString('hex'); // 256-bit key (hex)
  const iv = crypto.randomBytes(12); // GCM standard 12 bytes

  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  const ciphertext = Buffer.concat([cipher.update(jwtSecret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // store as base64 of hex(iv):hex(cipher):hex(tag)
  const payload = `${iv.toString('hex')}:${ciphertext.toString('hex')}:${tag.toString('hex')}`;
  const encrypted = Buffer.from(payload, 'utf8').toString('base64');

  console.log('JWT_SECRET (plaintext) :', jwtSecret);
  console.log('JWT_SECRET_KEY (hex)   :', key);
  console.log('JWT_SECRET_ENC (base64):', encrypted);
  console.log('\nInstructions:');
  console.log('- Put `JWT_SECRET_ENC` value into your backend .env (or Vercel env var)');
  console.log('- Put `JWT_SECRET_KEY` into your Vercel environment variables (keep secret)');
  console.log('- Remove plaintext `JWT_SECRET` from .env and do NOT commit the key');
}

generate();

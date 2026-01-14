const crypto = require('crypto');

function decryptSecret(encrypted, key) {
  // encrypted format: base64(iv:ciphertext:tag)
  const parts = Buffer.from(encrypted, 'base64').toString('utf8').split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted secret format');

  const iv = Buffer.from(parts[0], 'hex');
  const ciphertext = Buffer.from(parts[1], 'hex');
  const tag = Buffer.from(parts[2], 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  const enc = process.env.JWT_SECRET_ENC;
  const key = process.env.JWT_SECRET_KEY;

  if (enc && key) {
    try {
      return decryptSecret(enc, key);
    } catch (err) {
      console.error('Failed to decrypt JWT secret:', err.message);
      throw err;
    }
  }

  throw new Error('No JWT secret configured. Set JWT_SECRET or JWT_SECRET_ENC + JWT_SECRET_KEY');
}

module.exports = { getJwtSecret };

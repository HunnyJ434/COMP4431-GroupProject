import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dbConnect } from './dbConnect';

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Function to verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Function to generate a reset token
export async function generateResetToken(email: string): Promise<string | null> {
  const token = crypto.randomBytes(32).toString('hex'); // Create a random token
  const hashedToken = await hashPassword(token); // Hash the token for storage

  const db = await dbConnect();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return null; // If user doesn't exist, return null
  }

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1); // Set expiration time to 1 hour

  // Update user's document with the reset token and expiry
  await db.collection('users').updateOne(
    { email },
    { $set: { resetToken: hashedToken, resetTokenExpiry: expiration } }
  );

  return token; // Return plain token to send to the user
}

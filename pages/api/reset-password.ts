import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/dbConnect';
import { hashPassword } from '../../lib/auth'; // Use your existing password hashing function
import bcrypt from 'bcryptjs'; // Import bcryptjs to compare the token hash
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Connect to database
      const db = await dbConnect();
      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the reset token is valid and not expired
      const isTokenValid = user.resetToken && user.resetTokenExpiry && new Date(user.resetTokenExpiry) > new Date();

      if (!isTokenValid) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Verify token matches the stored hashed token
      const isTokenMatch = await bcrypt.compare(token, user.resetToken);
      if (!isTokenMatch) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the user's password in the database
      await db.collection('users').updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            resetToken: null, // Clear the reset token after successful reset
            resetTokenExpiry: null, // Clear the reset token expiry
          },
        }
      );

      return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
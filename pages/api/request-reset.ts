// pages/api/request-reset.ts
import { generateResetToken } from '../../lib/auth';
import { dbConnect } from '../../lib/dbConnect';
import { sendResetEmail } from '../../lib/email'; // Ensure sendResetEmail is implemented as shown earlier
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const db = await dbConnect();

    // Check if the user exists
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate the reset token
    const token:any = await generateResetToken(email);

    // Send the reset email
    await sendResetEmail(email, token);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error handling password reset request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
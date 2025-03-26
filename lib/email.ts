// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey("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");

export async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/newpassword?token=${token}&email=${email}`;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!, // your verified sender email
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset for LakeheadU banking System. Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>If you did not request this, please ignore this email.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
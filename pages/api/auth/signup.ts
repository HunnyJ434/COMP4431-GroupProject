import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import { dbConnect } from '../../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            email,
            password,
            firstName, 
            lastName,
            address,
            city,
            state,
            postalCode,
            dateOfBirth,
            ssn,
            recaptchaToken,
        } = req.body;

        if (!recaptchaToken) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }

        // Verify reCAPTCHA with Google
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
            { method: 'POST' }
        );
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return res.status(400).json({ message: 'reCAPTCHA validation failed' });
        }

        if (!email || !password || !firstName || !lastName || !address || !city || !state || !postalCode || !dateOfBirth || !ssn) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const hashedPassword = await hashPassword(password);
            const db = await dbConnect();
            const collection = db.collection('users');

            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            const result = await collection.insertOne({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                address,
                city,
                state,
                postalCode,
                dateOfBirth,
                ssn,
            });

            return res.status(201).json({ message: 'User created!', userId: result.insertedId });
        } catch (error) {
            console.error('Signup error:', error);
            return res.status(500).json({ message: 'Could not register user' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}

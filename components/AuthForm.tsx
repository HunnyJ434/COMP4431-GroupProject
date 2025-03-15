'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateAddress } from '../pages/api/geocode';
import { signIn } from 'next-auth/react';
import ReCAPTCHA from 'react-google-recaptcha';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        dateOfBirth: '',
        ssn: '',
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        if (type === 'sign-in') {
            if (!recaptchaToken) {
                setErrorMessage('Please complete the reCAPTCHA verification.');
                setIsLoading(false);
                return;
            }

            const response = await signIn('credentials', {
                redirect: false,
                email: userData.email,
                password: userData.password,
                recaptchaToken, // Send reCAPTCHA token to backend
            });

            if (response?.error) {
                setErrorMessage(response.error);
                setIsLoading(false);
                return;
            }
            router.push('/');
        } else {
            try {
                const { address, city, state, postalCode, country } = userData;

                // Validate address before submitting
                const validationResult = await validateAddress(address, city, state, postalCode, country);

                if (!validationResult.valid) {
                    setErrorMessage(validationResult.message || 'Invalid address. Please check and try again.');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                if (response.ok) {
                    router.push('/sign-in');
                } else {
                    setErrorMessage(result.message || 'An error occurred');
                }
            } catch (error) {
                setErrorMessage('An error occurred while signing up');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image src="/icons/logo.png" width={100} height={100} alt="LU Banking Management logo" />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">LU Banking Management</h1>
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </h1>
                    <p className="text-16 font-normal text-gray-600">
                        {type === 'sign-in' ? 'Please enter your credentials' : 'Please enter your details'}
                    </p>
                </div>
            </header>
            <form className="space-y-8" onSubmit={handleSubmit}>
                {type === 'sign-up' && (
                    <>
                        <div className="flex w-[100%]">
                            <div className="w-[55%] mr-[1rem]">
                                <label htmlFor="firstName">First Name:</label>
                                <input
                                    placeholder="Enter your first name"
                                    className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    minLength={3}
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="w-[55%]">
                                <label htmlFor="lastName">Last Name:</label>
                                <input
                                    placeholder="Enter your last name"
                                    className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    minLength={3}
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="w-[100%]">
                    <label htmlFor="email">Email:</label>
                    <input
                        placeholder="Enter your email"
                        className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="w-[100%]">
                    <label htmlFor="password">Password:</label>
                    <input
                        placeholder="Enter your password"
                        className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        minLength={7}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {type === 'sign-in' && (
                    <ReCAPTCHA
                        sitekey="6Lc18fQqAAAAAMVSQGhT4vPS7QTQdmqOsg3BGHYm" // Replace with your actual site key
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                    />
                )}

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isLoading} className="form-btn">
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                            </>
                        ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </Button>
                </div>
            </form>

            <footer className="flex justify-center gap-1">
                <p className="text-14 font-normal text-gray-600">
                    {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                    {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                </Link>
            </footer>
        </section>
    );
};

export default AuthForm;

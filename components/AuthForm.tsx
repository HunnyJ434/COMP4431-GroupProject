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

const SITE_KEY = "6Ld_1PUqAAAAAJizTvd5umdWQODsbSHeBIN9ezhd"; // Replace with your actual reCAPTCHA site key

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
    const [recaptchaToken, setRecaptchaToken] = useState('');

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

        if (type === 'sign-in' && !recaptchaToken) {
            setErrorMessage('Please complete the reCAPTCHA verification.');
            setIsLoading(false);
            return;
        }

        if (type === 'sign-in') {
            // Handle sign-in
            const response = await signIn('credentials', {
                redirect: false,
                email: userData.email,
                password: userData.password,
                recaptchaToken, // Send reCAPTCHA token
            });

            if (response?.error) {
                setErrorMessage(response.error);
                setIsLoading(false);
                return;
            }
            router.push('/');
        } else {
            // Handle sign-up
            try {
                const { address, city, state, postalCode, country } = userData;

                // Validate address
                const validationResult = await validateAddress(address, city, state, postalCode, country);
                if (!validationResult.valid) {
                    setErrorMessage(validationResult.message || 'Invalid address. Please check the details and try again.');
                    setIsLoading(false);
                    return;
                }

                // Submit sign-up request
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">{type === 'sign-in' ? 'Sign In' : 'Sign Up'}</h1>
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
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-3 w-full rounded-md"
                                />
                            </div>
                            <div className="w-[55%]">
                                <label htmlFor="lastName">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-3 w-full rounded-md"
                                />
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="w-[100%]">
                            <label htmlFor="address">Address:</label>
                            <input type="text" name="address" placeholder="Enter your address" value={userData.address} onChange={handleInputChange} required className="border p-3 w-full rounded-md" />
                        </div>
                        <div className="w-[100%]">
                            <label htmlFor="city">City:</label>
                            <input type="text" name="city" placeholder="Enter your city" value={userData.city} onChange={handleInputChange} required className="border p-3 w-full rounded-md" />
                        </div>

                        {/* More Fields */}
                        <div className="flex w-[100%]">
                            <div className="w-[55%] mr-[1rem]">
                                <label htmlFor="state">State/Province</label>
                                <input type="text" name="state" placeholder="Example: ON" value={userData.state} onChange={handleInputChange} required className="border p-3 w-full rounded-md" />
                            </div>
                            <div className="w-[55%]">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input type="text" name="postalCode" placeholder="Example: P7B 1W3" value={userData.postalCode} onChange={handleInputChange} required className="border p-3 w-full rounded-md" />
                            </div>
                        </div>
                    </>
                )}

                {/* Email & Password Fields */}
                <div className="w-[100%]">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" placeholder="Enter your email" value={userData.email} onChange={handleInputChange} required className="border p-3 w-full rounded-md" />
                </div>
                <div className="w-[100%]">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Enter your password" value={userData.password} onChange={handleInputChange} minLength={7} required className="border p-3 w-full rounded-md" />
                </div>

                {/* reCAPTCHA for Sign In Only */}
                {type === 'sign-in' && <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setRecaptchaToken(token || '')} />}

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>

            <footer className="flex justify-center gap-1">
                <p>{type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}</p>
                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}><span className="form-link">{type === 'sign-in' ? 'Sign up' : 'Sign in'}</span></Link>
            </footer>
        </section>
    );
};

export default AuthForm;

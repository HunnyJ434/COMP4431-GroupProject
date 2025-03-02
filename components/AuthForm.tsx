'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateAddress } from '../pages/api/geocode';
import { signIn } from 'next-auth/react';
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
    if(type === 'sign-in'){
      // Handle sign-in
      const response = await signIn('credentials', {
        redirect: false,
        email: userData.email,
        password: userData.password,
      });

      if (response?.error) {
        setErrorMessage(response.error);
        setIsLoading(false);
        return;
      }
      router.push('/');
    }
    else{
      try {
      const { address, city, state, postalCode, country } = userData;

      // Call the validateAddress function
      const validationResult = await validateAddress(address, city, state, postalCode, country);
  
      // Check if the address is valid
      if (!validationResult.valid) {
        // If address is invalid, show the error message
        setErrorMessage(validationResult.message || 'Invalid address. Please check the details and try again.');
        setIsLoading(false);  // Stop loading
        return;  // Return early to prevent form submission
      }
      // If address is valid, proceed with submitting the user data
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Redirect to login page or dashboard upon successful signup
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
            <div className="w-[100%]">
              <label htmlFor="address">Address:</label>
              <input
                placeholder="Enter your address"
                className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-[100%]">
              <label htmlFor="city">City:</label>
              <input
                placeholder="Enter your city"
                className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                type="text"
                id="city"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex w-[100%]">
              <div className="w-[55%] mr-[1rem]">
                <label htmlFor="state">State/Province</label>
                <input
                  placeholder="Example: ON"
                  className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                  type="text"
                  id="state"
                  name="state"
                  value={userData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-[55%]">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  placeholder="Example: P7B 1W3"
                  className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={userData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="w-[100%]">
              <label htmlFor="city">Country:</label>
              <input
                placeholder="Enter your Country"
                className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                type="text"
                id="country"
                name="country"
                value={userData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex w-[100%]">
              <div className="w-[55%] mr-[1rem]">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  placeholder="YYYY-MM-DD"
                  className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth" 
                  value={userData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-[55%]">
                <label htmlFor="ssn">SSN</label>
                <input
                  placeholder="Example: 1234"
                  className="border-[1px] w-[99%] p-3 h-[2.5rem] rounded-md border-black"
                  type="text"
                  id="ssn"
                  name="ssn"
                  value={userData.ssn}
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

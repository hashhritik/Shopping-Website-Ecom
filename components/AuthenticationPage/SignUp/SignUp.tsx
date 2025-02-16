'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, db } from '@/firebase.config';
import { gicon, facebook, signup } from '@/public/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './signUp.module.scss';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { email, phone, password, confirmPassword } = formData;

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits.');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' });

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date(),
      });

      toast.success('Account created successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });

      router.push(`/profile?edit=true`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to create an account.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' });
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        createdAt: new Date(),
      });

      toast.success(`Welcome, ${user.displayName || 'User'}!`);
      router.push(`/profile?edit=true`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken();
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' });
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        createdAt: new Date(),
      });

      toast.success(`Welcome, ${user.displayName || 'User'}!`);
      router.push(`/profile?edit=true`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Facebook.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image src={signup} alt="Sign Up" />
        </div>
        <div className={styles.content}>
          <h1>FASCO</h1>
          <h2 className={styles.header}>Create Account</h2>
          <div className={styles.socialButtons}>
            <button
              className={styles.googleButton}
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <Image src={gicon} height={30} alt="Google" />
              SignUp with Google
            </button>
            <button
              className={styles.facebookButton}
              onClick={handleFacebookSignUp}
              disabled={loading}
            >
              <Image src={facebook} height={30} alt="Facebook" />
              SignUp with Facebook
            </button>
          </div>
          <p className={styles.divider}>- OR -</p>
          <div className={styles.form}>
              <div className={`${styles.grid} grid md:grid-cols-2`}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            <button
              onClick={handleSignUp}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div>
              Already have an account?{' '}
              <Link href="/log-in" className={styles.loginLink}>
                Login
              </Link>
            </div>
          </div>
          <p className={styles.termWrapper}>
            <Link href="" className={styles.terms}>
              FASCO Terms & Condition
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
    </div>
  );
}  
"use client";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth, db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { login, gicon, facebook } from "@/public/auth";
import styles from "./logIn.module.scss";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from 'cookies-next';

export default function LogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const router = useRouter();

  const handleEmailPasswordSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Email and Password are required!");
      return;
    }
    setLoading(true);
    try {
      const userCredential=await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(); 
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' }); 
      toast.success('Successfully signed in!');
      router.replace('/');
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
     try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(); 
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' }); 
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.info("No account found. Redirecting to sign-up...");
        router.push("/sign-up");
      } else {
        toast.success("Signed in with Google!");
        router.replace("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken(); 
      setCookie('authToken', idToken, { maxAge: 60 * 60 * 24 * 7, path: '/' }); 
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.info("No account found. Redirecting to sign-up...");
        router.push("/sign-up");
      } else {
        toast.success("Signed in with Facebook!");
        router.replace("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image src={login} alt="Login Image" />
        </div>
        <div className={styles.content}>
          <h1>FASCO</h1>
          <div className={styles.header}>
            <h2>Sign In to FACO</h2>
          </div>

          <div className={styles.socialButtons}>
            <button
              onClick={handleGoogleSignIn}
              className={styles.googleButton}
              disabled={loading}
            >
              <Image src={gicon} height={30} alt="Google Icon" />
              Login with Google
            </button>
            <button
              onClick={handleFacebookSignIn}
              className={styles.facebookButton}
              disabled={loading}
            >
              <Image src={facebook} alt="Facebook Icon" height={30} />
              Login with Facebook
            </button>
          </div>
          <p className={styles.divider}>-OR-</p>
          <div className={styles.form}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email"
              disabled={loading}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password"
              disabled={loading}
            />
            <button
              onClick={handleEmailPasswordSignIn}
              className={styles.emailPasswordButton}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className={styles.div}>
              <Link className={styles.registerBtnLink} href="/sign-up">
                <button className={styles.registerButton}>Register Now</button>
              </Link>
              <Link
                href="/log-in/forgot-password"
                className={styles.forgotPasswordLink}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className={styles.termWrapper}>
            <Link href="" className={styles.terms}>
              FASCO Terms & Condition
            </Link>
          </div>
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

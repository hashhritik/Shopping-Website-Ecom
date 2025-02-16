"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase.config";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/public/auth";
import styles from "./forgotPassword.module.scss";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      setEmail("");
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
          <Image src={login} alt="Forgot Password"  />
        </div>
        <div className={styles.content}>
          <h1>FASCO</h1>
          <div className={styles.header}>
            <h2>Forgot Password</h2>
          </div>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleForgotPassword}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Email and Reset Password"}
            </button>
            <div>
              Already have an account?{" "}
              <Link href="/log-in" className={styles.loginLink}>
                Login
              </Link>
            </div>
          </div>
          <div className={styles.termWrapper}>
            <Link href="#" className={styles.terms}>
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
        closeOnClick
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

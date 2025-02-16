"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { login } from "@/public/auth";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase.config";
import styles from "./newPassword.module.scss";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function NewPassword() {
  const searchParams = useSearchParams();
  const oobCode = searchParams?.get("oobCode") || "";
  const router = useRouter();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!oobCode) {
      toast.error("Invalid or missing reset code.");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password has been reset successfully!");
      setNewPassword("");
      setConfirmPassword("");
      router.push("/log-in");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image src={login} alt="New Password" />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>FASCO</h1>
            <h2>Enter Your New Password</h2>
          </div>
          <div className={styles.form}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleResetPassword}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
          <p className={styles.termWrapper}>
            <Link href="#" className={styles.terms}>
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

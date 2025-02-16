"use client";
import styles from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";
import { cart, image1, image2, image3, image4 } from "@/public/header";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setIsLoggedIn(!!user));
    return () => unsubscribe();
  }, []);

  const handleNavigation = () => {
    if (isLoggedIn !== null) {
      router.push(isLoggedIn ? "/shop/cart" : "/log-in");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.main}>
          <div className={styles.leftImage}>
            <div className={styles.imagePlaceholder}>
              <Image src={image1} alt="Left Image" priority />
            </div>
          </div>
          <div className={styles.centerContent}>
            <div className={styles.topRowImages}>
              <div className={styles.imagePlaceholder}>
                <Image src={image3} alt="Top Image" priority />
              </div>
            </div>
            <p className={styles.heading1}>ULTIMATE</p>
            <p className={styles.heading2}>SALE</p>
            <p className={styles.subHeading}>New Collection</p>
            <Link href="/shop">
              <button className={styles.shopNowBtn}>Shop Now</button>
            </Link>
            <div className={styles.bottomRowImages}>
              <div className={styles.imagePlaceholder}>
                <Image src={image4} alt="Bottom Image" priority />
              </div>
            </div>
          </div>
          <div className={`${styles.rightImage} hidden md:flex`}>
            <div className={styles.imagePlaceholder}>
              <Image src={image2} alt="Right Image" priority />
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn !== null && (
        <Image
          className={styles.image}
          src={cart}
          alt="Cart"
          title="Cart"
          onClick={handleNavigation}
        />
      )}
    </div>
  );
}

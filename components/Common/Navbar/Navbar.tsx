"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./navbar.module.scss";
import { hamburger } from "@/public/navImages";
import UserIcon from "./UserIcon/UserIcon";
import NavbarLinks from "./NavbarLinks/NavbarLinks";

interface NavbarProps {
  scrollToSection: (sectionId: string) => void;
}

interface NavLink {
  id: string;
  href: string;
  links: string;
}
interface NavImage {
  id: string;
  name: string;
  route: string;
  image: string;
}

export default function Navbar({ scrollToSection }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [navImages, setNavImages] = useState<NavImage[]>([]);
  const pathname = usePathname();

  const menuRef = useRef<HTMLUListElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfilePicture(docSnap.data().profilePicture || null);
          }
        });
        return () => unsubscribeProfile();
      } else {
        setProfilePicture(null);
      }
    });

    const fetchNavData = async () => {
      const collectionMap: Record<string, string> = {
        "/": "homeNavLinks",
        "/shop": "navLinks",
        "/shop/product": "navLinks",
        "/shop/cart": "navLinks",
        "/profile": "profileNavLinks",
      };
      const collectionName = collectionMap[pathname] || "homeNavLinks";
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        setNavLinks(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            href: doc.data().route || doc.data().href,
            links: doc.data().title || doc.data().links,
          }))
        );
      } catch (error) {
        console.error("Error fetching navigation links:", error);
      }

      if (pathname.startsWith("/shop")) {
        try {
          const imageSnapshot = await getDocs(collection(db, "navImages"));
          setNavImages(
            imageSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name || '',
              route: doc.data().route,
              image: doc.data().image,
            }))
          );
        } catch (error) {
          console.error("Error fetching navigation images:", error);
        }
      }
    };

    fetchNavData();
    return () => unsubscribeAuth();
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn) {
      const cartCollectionRef = collection(db, `users/${auth.currentUser?.uid}/productlist`);
      const unsubscribeCart = onSnapshot(cartCollectionRef, (snapshot) => {
        setCartCount(snapshot.size);
      });
      return () => unsubscribeCart();
    }
  }, [isLoggedIn]);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.wrapper}>
          <div className={styles.navbar}>
            <Link href="/">
              <p className={styles.logo}>FASCO</p>
            </Link>
            <NavbarLinks
              pathname={pathname}
              navLinks={navLinks}
              navImages={navImages}
              cartCount={cartCount}
              isMobileMenuOpen={isMobileMenuOpen}
              scrollToSection={scrollToSection}
              isloggedin={isLoggedIn}
              menuRef={menuRef} 
            />

            <div className={styles.userIcon}>
              {isLoggedIn ? (
                <UserIcon profilePicture={profilePicture} />
              ) : (
                <div className={styles.authBtn}>
                  <Link className={styles.link} href="/log-in">Sign in</Link>
                  {pathname === "/" && (
                    <button className={styles.btn}>
                      <Link href="/sign-up">Sign Up</Link>
                    </button>
                  )}
                </div>
              )}
              {pathname !== '/profile' && (
                <button
                  className={styles.hamburger}
                  ref={hamburgerRef}
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  <Image src={hamburger} alt="Hamburger Menu" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

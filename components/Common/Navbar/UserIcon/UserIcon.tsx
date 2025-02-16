import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { deleteCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import styles from "./userIcon.module.scss";
import { userIcon } from "@/public/navImages";

interface UserIconProps {
    profilePicture: string | null;
}

export default function UserIcon({ profilePicture }: UserIconProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);  

    const handleLogout = async () => {
        try {
            await signOut(auth);
            deleteCookie("authToken", { path: "/" });
            setIsDropdownOpen(false);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.userMenu}>
            <Image
                src={profilePicture || userIcon}
                alt="User Icon"
                className={styles.userIcon}
                onClick={(e) => {
                    e.stopPropagation();  
                    setIsDropdownOpen((prev) => !prev);
                }}
                width={70}
                height={70}
            />
            {isDropdownOpen && (
                <div className={styles.dropdown}>
                    <p>
                        <Link href={pathname !== "/profile" ? "/profile" : "/"}>{pathname !== "/profile" ? "View Profile" : "Home"}</Link>
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

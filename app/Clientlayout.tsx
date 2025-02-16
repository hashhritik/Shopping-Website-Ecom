"use client";

import { Geist, Geist_Mono } from "next/font/google";
import styles from "./page.module.scss";
import "./globals.css";
import {
    Deals,
    Features,
    Footer,
    InstagramSection,
    Navbar,
    NewArrivals,
    Newsletter,
    Slider,
    Testimonials,
} from "@/components";
import { usePathname } from "next/navigation";
import { useRef } from "react";
// import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathName = usePathname(); 

    const dealsRef = useRef<HTMLElement | null>(null);
    const newArrivalsRef = useRef<HTMLElement | null>(null);

    const scrollToSection = (sectionId: string) => {
        const sectionMap: { [key: string]: React.RefObject<HTMLElement | null> } = {
            "/deals": dealsRef,
            "/new-arrivals": newArrivalsRef,
        };

        const targetRef = sectionMap[sectionId];
        if (targetRef?.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const isHomePage = pathName === "/";
    const isShopPage = pathName.startsWith("/shop");
    const isProductPage = pathName.startsWith("/shop/product");
    const isCartPage = pathName.startsWith("/shop/cart");
    const isProfilePage = pathName.startsWith("/profile");
    const isAuthPage = pathName.startsWith("/log-in") || pathName.startsWith("/sign-up");

    if (isAuthPage) {
        return (
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </div>
        );
    }

    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className={styles.container}>
                <Navbar scrollToSection={scrollToSection} />
                {children}

                {isHomePage && (
                    <>
                        <section className={styles.container} ref={dealsRef} id="deals">
                            <Deals />
                        </section>
                        <section className={styles.container} ref={newArrivalsRef} id="new-arrivals">
                            <NewArrivals />
                        </section>
                        <Slider />
                        <Features />
                        <InstagramSection />
                        <Testimonials />
                    </>
                )}

                {isShopPage && !isProductPage && !isCartPage && (
                    <>
                        <Slider />
                        <Features />
                        <InstagramSection />
                    </>
                )}

                {isProductPage && (
                    <>
                        <Slider />
                        <Features />
                    </>
                )}

                {!isProfilePage && <Newsletter />}
                {!isProfilePage && <Footer />}
            </div>
            {/* <Script src="https://unpkg.com/react-scan/dist/auto.global.js" strategy="lazyOnload" /> */}
        </div>
    );
}

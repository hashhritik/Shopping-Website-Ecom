import React, { RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from './navbarLinks.module.scss'

interface NavLink {
    id: string;
    href: string;
    links: string;
}

interface NavImage {
    id: string;
    name: string
    route: string;
    image: string;
}

interface NavbarLinksProps {
    pathname: string;
    navLinks: NavLink[];
    navImages: NavImage[];
    cartCount: number;
    isMobileMenuOpen: boolean;
    scrollToSection: (sectionId: string) => void;
    isloggedin: boolean;
    menuRef: RefObject<HTMLUListElement | null>;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({
    pathname,
    navLinks,
    navImages,
    cartCount,
    isMobileMenuOpen,
    scrollToSection,
    isloggedin,
    menuRef  
}) => {
    return (
        <ul ref={menuRef} className={`${styles.headerLinks} ${isMobileMenuOpen ? styles.show : ""}`}>
            {pathname === "/" ? (
                <div className={styles.homenavlist}>
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <button onClick={() => scrollToSection(link.href)}>{link.links}</button>
                        </li>
                    ))}
                </div>
            ) : (
                <div className={styles.shopnavlist}>
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <Link href={link.href}>{link.links}</Link>
                        </li>
                    ))}
                </div>
            )}

            {isloggedin && pathname.startsWith("/shop") && navImages.length > 0 && (
                <div className={styles.navLinks}>
                    {navImages
                        .filter((image) => ![1, 2, 3].includes(Number(image.id))) 
                        .map((image) => (
                            <Link href={image.route} key={image.id}>
                                <li className={styles.navImgLink}>
                                    <Image src={image.image} alt="Nav Image" width={24} height={24} />
                                    {cartCount > 0 && Number(image.id) === 4 && (
                                        <span className={styles.badge}>{cartCount}</span>
                                    )}
                                    <p className={styles.name}>{image.name}</p>
                                </li>
                            </Link>
                        ))}
                </div>
            )}


            {!isloggedin &&
                <div className={styles.authBtn}>
                    <Link className={styles.link} href="/log-in">Sign in</Link>
                    {pathname === "/" && (
                        <button className={styles.btn}>
                            <Link href="/sign-up">Sign Up</Link>
                        </button>
                    )}
                </div>}
        </ul>
    );
};

export default NavbarLinks;

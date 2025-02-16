'use client';
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/firebase.config';
import styles from './footer.module.scss'

interface FooterLink {
    id: number;
    links: string;
    href: string;
}

export default function Footer() {
    const [links, setLinks] = useState([] as FooterLink[]);
    useEffect(() => {
        try {
            const fetchLinks = async () => {
                const querySnapshot = await getDocs(collection(db, 'footerLinks'));
                const data = querySnapshot.docs.map(doc => {
                    const linkData = doc.data() ;
                    return {
                        id: linkData.id,
                        links: linkData.links,
                        href: linkData.href,
                    };
                }) as FooterLink[];
                setLinks(data);
            };
            fetchLinks();
        }
        catch (error) {
            console.error('Error fetching footer links:', error);
        }
    }, []);
    
    return (
        <div className={styles.container}>
                <hr className={styles.divider} />
            <div className={styles.wrapper}>
                <div className={styles.footerItems}>
                    <Link href='/' className={styles.logo}>FASCO</Link>
                    <ul className={styles.footerLinksList}>
                        {links.map((link,index) => (
                            <li key={index}>
                                <Link href={link.href}>{link.links}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.copyRights}>
                    Copyright © {new Date().getFullYear()} FASCO. All Rights Reserved.
                </div>
            </div>
        </div>
    );
}
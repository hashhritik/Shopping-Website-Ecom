"use client"
import { useEffect, useState } from 'react';
import styles from './features.module.scss';
import { db } from '@/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
interface Feature {
    icon: string;
    heading: string;
    description: string;
}
export default function Features() {
    const [featuresData, setFeaturesData] = useState<Feature[]>([]);  
    
    useEffect(() => {
        const fetchFeaturesData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "featuresData"));
                const data = querySnapshot.docs.map(doc => {
                    const featureData = doc.data();
                    return {
                        icon: featureData.icon,
                        heading: featureData.heading,
                        description: featureData.description
                    } as Feature;
                });
                setFeaturesData(data);  
            } catch (error) {
                console.error("Error fetching features data:", error);
            }
        };

        fetchFeaturesData();  
    }, []);  

    return (
        <div className={styles.wrapper}>
            {featuresData.length > 0 ? (
                featuresData.map((feature, index) => (
                    <div key={index} className={styles.featureItems}>
                        <Image src={feature.icon} alt={feature.heading} width={50} height={50} priority />
                        <div className={styles.features}>
                            <h2 className={styles.heading}>{feature.heading}</h2>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading features...</p>  
            )}
        </div>
    );
}





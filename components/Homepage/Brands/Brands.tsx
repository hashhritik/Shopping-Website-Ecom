"use client";
import styles from "./brands.module.scss";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";
import Image from "next/image";

interface BrandLogo {
  id: number;
  src: string;
  alt: string;
}

export default function Brands() {
  const [brandLogos, setBrandLogos] = useState<BrandLogo[] | null>(null);

  useEffect(() => {
    getDocs(collection(db, "brandlogos"))
      .then((querySnapshot) =>
        setBrandLogos(querySnapshot.docs.map((doc) => doc.data() as BrandLogo))
      )
      .catch((error) => console.error("Error fetching brand logos:", error));
  }, []);

  if (!brandLogos) {
    return <p>Loading brands...</p>;
  }

  return (
    <Swiper
      spaceBetween={20}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      modules={[Autoplay]}
      slidesPerView={4}
      breakpoints={{
        0: { slidesPerView: 1, spaceBetween: 10 },
        480: { slidesPerView: 2, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
      }}
      loop
      className={styles.wrapper}
    >
      {brandLogos.map(({ id, src, alt }) => (
        <SwiperSlide key={id}>
          <div className={styles.slideContent}>
            <div className={styles.imageWrapper}>
              <Image
                src={src}
                alt={alt}
                height={100}
                width={200}
                className={styles.image}
                loading="lazy"
                priority={false}
              />
            </div>
          </div>
        </SwiperSlide>

      ))}
    </Swiper>
  );
}

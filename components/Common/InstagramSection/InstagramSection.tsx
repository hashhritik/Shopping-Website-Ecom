"use client";
import styles from "./instagramSection.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import {  FreeMode, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";
import Image from "next/image";

interface ImageData {
  id: string;
  src: string;
  alt: string;
}

export default function InstagramSection() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "instagramImages"));
        const fetchedImages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ImageData[];

        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Follow Us On Instagram</h2>
        <p className={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Scelerisque duis ultrices sollicitudin aliquam sem.
        </p>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading images...</p>
      ) : (
        <>
          <div className={styles.mobileContainer}>
            <Swiper
              spaceBetween={0}
              pagination={{ clickable: true }}
              modules={[FreeMode, Pagination]}
              freeMode
              slidesPerView={Math.min(images.length, 3)}
              breakpoints={{
                300: { slidesPerView: 1 },
                640: { slidesPerView: Math.min(images.length, 3) },
              }}
              className={styles.swiper}
            >
              {images.map(({ id, src, alt }) => (
                <SwiperSlide key={id} className={styles.swiperSlide}>
                  <div className={styles.imagePlaceholder}>
                    <Image
                      src={src || "/placeholder.jpg"}
                      alt={alt || "Instagram Image"}
                      height={200}
                      width={250}
                      className={styles.image}
                      priority
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className={styles.imagesContainer}>
            {images.map(({ id, src, alt }) => (
              <div key={id} className={styles.imagePlaceholder}>
                <Image
                  src={src || "/placeholder.jpg"}
                  alt={alt || "Instagram Image"}
                  height={400}
                  width={300}
                  className={styles.img}
                  priority
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

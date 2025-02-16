"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./deals.module.scss";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";
import Countdown from "./Countdown/Countdown";

interface Deal {
  id: number;
  src: string;
  alt: string;
  title: string;
  discount: string;
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[] | null>(null);


  useEffect(() => {
    getDocs(collection(db, "deals"))
      .then((querySnapshot) =>
        setDeals(querySnapshot.docs.map((doc) => doc.data() as Deal))
      )
      .catch((error) => console.error("Error fetching deals:", error));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <div className={styles.deals}>
              <h1 className={styles.title}>Deals Of The Month</h1>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem.
              </p>
            </div>
            <button className={styles.button}>
              Buy Now
            </button>
          </div>
          <h2 className={styles.hurry}>Hurry, Before It’s Too Late!</h2>
          <Countdown />
        </div>

        <div className={styles.right}>
          <div className={styles.swiper}>
            <Swiper
              effect="coverflow"
              modules={[Navigation, EffectCoverflow, Pagination]}
              navigation
              pagination={{ clickable: true }}
              slidesPerView={"auto"}
              spaceBetween={0}
              breakpoints={{
                300: { slidesPerView: 2,
                  spaceBetween:10,
                 },
                500: { slidesPerView: 3 },
                768: { slidesPerView: 3, navigation: false },
                770: { slidesPerView: 2 },
                800: { slidesPerView: 2 },
                900: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              coverflowEffect={{ rotate: 0, stretch: 0, depth: 200, modifier: 1, slideShadows: false }}
            >
              {deals === null ? (
                <p>Loading...</p>
              ) : (
                deals.map(({ id, src, alt, title, discount }) => (
                  <SwiperSlide key={id} className={styles.swiperSlide}>
                    <div className={styles.dealCard}>
                      <img src={src} alt={alt} className={styles.image} />
                      <div className={styles.dealDetails}>
                        <p>{title}</p>
                        <h4>{discount}</h4>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./testimonials.module.scss";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";
import Image from "next/image";

interface Testimonial {
  id: number;
  image: string;
  name: string;
  text: string;
  rating: number;
  role: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    getDocs(collection(db, "testimonials"))
      .then((querySnapshot) =>
        setTestimonials(querySnapshot.docs.map((doc) => doc.data() as Testimonial))
      )
      .catch((error) => console.error("Error fetching testimonials:", error));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>This Is What Our Customers Say</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis</p>

        {testimonials === null ? (
          <p>Loading testimonials...</p> 
        ) : (
          <Swiper
            effect="coverflow"
            modules={[Navigation, EffectCoverflow, Pagination]}
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            spaceBetween={0}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              0: { pagination: { clickable: true } },
              640: { pagination: { clickable: true } },
              768: { pagination: false },
              1024: { pagination: false },
            }}
            className={styles.swiper}
          >
            {testimonials.map(({ id, image, name, text, rating, role }) => (
              <SwiperSlide className={styles.testimonialCard} key={id}>
                <div className={styles.imgDiv}>
                  <Image
                  src={image} 
                  alt={name}
                  className={styles.img}
                  height={200}
                  width={200}
                  priority={false} 
                  loading="lazy"
                  />
                </div>
                <div className={styles.rating}>
                  <p className={styles.quote}>&quot;{text}&quot;</p>
                  <div className={styles.divRating}>
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </div>
                  <hr />
                  <h4 className={styles.name}>{name}</h4>
                  <p className={styles.role}>{role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
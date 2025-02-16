"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./newArrivals.module.scss";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebase.config";

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string;
  ratings: number;
  reviews: number;
  MRP: number;
  status: string;
}

const categories = [
  "Men's Fashion",
  "Women's Fashion",
  "Women Accessories",
  "Men Accessories",
  "Discount Deals",
];

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [activeTab, setActiveTab] = useState("Women's Fashion");

  useEffect(() => {
    getDocs(collection(db, "productLists"))
      .then((querySnapshot) =>
        setProducts(
          querySnapshot.docs
            .map((doc) => doc.data() as Product)
            .filter(({ id }) => id >= 28 && id <= 33)
        )
      )
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2 className={styles.title}>New Arrivals</h2>
          <p className={styles.subtitle}>
            Discover the latest fashion trends with our new arrivals.
          </p>
        </header>
        <nav className={styles.tabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.tab} ${activeTab === category ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </nav>
        <section className={styles.productsGrid}>
          {products === null ? (
            <p>Loading products...</p> 
          ) : (
            products.map(({ id, name, brand, image, ratings, reviews, MRP, status }) => (
              <Link
                href={`/shop/product?productId=${id}&Category=NewArrivals&productname=${name}`}
                key={id}
                className={styles.productCard}
              >
                <Image
                  src={image}
                  alt={name}
                  width={350} 
                  height={250} 
                  className={styles.productImage}
                  loading="lazy"
                  priority={false}
                />
                <div className={styles.rating_name}>
                  <h3 className={styles.productName}>{name}</h3>
                  <div className={styles.rating}>
                    {"★".repeat(ratings)}
                    {"☆".repeat(5 - ratings)}
                  </div>
                </div>
                <p className={styles.productBrand}>{brand}</p>
                <p className={styles.productReviews}>{reviews}k customer reviews</p>
                <div className={styles.price_status}>
                  <p className={styles.productPrice}>${MRP}</p>
                  <p className={styles.productStatus}>{status}</p>
                </div>
              </Link>
            ))
          )}
        </section>
        <footer className={styles.viewMore}>
          <Link href="/shop">
            <button className={styles.viewMoreButton}>View More</button>
          </Link>
        </footer>
      </div>
    </div>
  );
}


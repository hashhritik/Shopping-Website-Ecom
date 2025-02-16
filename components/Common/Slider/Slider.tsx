import React from "react";
import Image from "next/image";
import styles from "./slider.module.scss";
import { slider, sliderMobile } from "@/public/slider";
const Slider = () => {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageSection}>
        <Image
          src={slider}
          alt=""
          className={styles.imageActive}
        />
        <Image src={sliderMobile} alt="" className={`${styles.sliderMobile}`} />
        <div className={styles.line}></div>
      </div>

      <div className={styles.textSection}>
        <h4 className={styles.collectionTitle}>Women Collection</h4>
        <h1 className={styles.productTitle}>Peaky Blinders</h1>
        <h5 className={styles.descriptionTitle}>Description</h5>
        <p className={styles.descriptionText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
          duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
          sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className={styles.priceSection}>
          <div className={styles.sizeSelection}>
            <span>Size:</span>
            <span className={styles.size}>M</span>
          </div>
          <span className={styles.price}>$100.00</span>
        </div>
        <button className={styles.buyNowButton}>Buy Now</button>
      </div>
    </div>
  );
};

export default Slider;

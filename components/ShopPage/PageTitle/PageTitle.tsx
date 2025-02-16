import Image from "next/image";
import React from "react";
import RightArrow from "@/public/RightArrow.png";
import styles from "./pageTitle.module.scss";

const PageTitle = () => {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.secondDiv}>
        <h1 className={styles.mainText}>Fashion</h1>
        <div className={styles.innerDiv}>
          <p>Home</p>
          <Image src={RightArrow} alt="" className={styles.imageContainer} />
          <p>Fashion</p>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;

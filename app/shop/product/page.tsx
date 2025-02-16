import React, { Suspense } from "react";
import {
  ProductDetails,
} from "@/components";
import styles from "./page.module.scss";

const Page = () => {
  return (
    <div className={styles.mainDiv}>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetails />
      </Suspense>
     
    </div>
  );
};

export default Page;

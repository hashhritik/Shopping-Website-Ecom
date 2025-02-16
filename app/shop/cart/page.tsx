'use client'
import React from "react";
import styles from "./page.module.scss";
import {  ShoppingCart } from "@/components";

const page = () => {
  return (
    <div className={styles.mainDiv}>
      <ShoppingCart />
    </div>
  );
};

export default page;

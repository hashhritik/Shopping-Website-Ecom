"use client"
import React from "react";
import {
  PageTitle,
  Products,
} from "@/components";
import styles from "./page.module.scss";

export default function page() {
  return (
    <div className={styles.mainDiv}>
      <PageTitle />
      <Products />
    
    </div>
  );
}

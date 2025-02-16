import { LogIn } from "@/components";
import React from "react";
import styles from "./page.module.scss";

export default function page() {
  return (
    <div className={styles.container}>
      <LogIn />
    </div>
  );
}

// 'use client'
import {
  Brands,
  Header,
} from "@/components";
import styles from "./page.module.scss"
export default function Home() {

  return (
    <>
      <div className={styles.container}>
        <Header />
        <Brands />
      </div >
    </>
  );
}

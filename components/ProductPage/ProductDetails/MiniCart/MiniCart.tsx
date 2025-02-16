"use client";
import React, { useState, useEffect } from "react";
import styles from "./miniCart.module.scss";
import { Product } from "../ProductDetails";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/firebase.config";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Slide, toast, ToastContainer } from "react-toastify";

const FREE_SHIPPING_THRESHOLD = 100;
const GIFT_WRAP_COST = 10;

interface MiniCartProps {
  activeProduct?: Product;
  counter: number;
  setCounter: (value: number | ((prev: number) => number)) => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ activeProduct, counter, setCounter }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [isGiftWrap, setIsGiftWrap] = useState(false);

  useEffect(() => {
    if (activeProduct) {
      const pricePerUnit = activeProduct.MRP * (1 - activeProduct.discount / 100);
      setSubtotal(pricePerUnit * counter + (isGiftWrap ? GIFT_WRAP_COST : 0));
    }
  }, [activeProduct, counter, isGiftWrap]);

  if (!activeProduct) return <h1>No Products Selected</h1>;

  const thresholdGap = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const activeColor = activeProduct.color.find((col) => col.isActive)?.name || "No color selected";
  const discountedPrice = (activeProduct.MRP * (1 - activeProduct.discount / 100)).toFixed(2);

  const addToCart = async () => {
    const user = getAuth().currentUser;
    if (!user) return toast.info("You need to be logged in to add items to your cart.");

    try {
      await addDoc(collection(db, `users/${user.uid}/productlist`), {
        name: activeProduct.name,
        MRP: activeProduct.MRP,
        discount: activeProduct.discount,
        color: activeColor,
        quantity: counter,
        image: activeProduct.image,
      });
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.miniCartDiv}>
        <div className={styles.topItems}>
          <h1 className={styles.shoppingCartText}>Shopping Cart</h1>
          <p className={styles.buyText}>
            {subtotal < FREE_SHIPPING_THRESHOLD ? (
              <>
                Buy <span className={styles.highLight}>${thresholdGap.toFixed(2)}</span> more and get{" "}
                <span className={styles.highLight}>free shipping</span>
              </>
            ) : (
              <>
                <span className={styles.highLight}>Congratulations</span>, you got free delivery!
              </>
            )}
          </p>

          <div className={styles.productDiv}>
            <Image src={activeProduct.image} alt={activeProduct.name} width={200} height={200} className={styles.activeImage} />
            <div className={styles.activeProductDetails}>
              <p className={styles.activeName}>{activeProduct.name}</p>
              <p className={styles.activeColor}>Color: {activeColor}</p>
              <p className={styles.activePrice}>${discountedPrice}</p>
              <div className={styles.quantityButtonContainer}>
                <button onClick={() => setCounter((prev) => Math.max(prev - 1, 1))} className={styles.button}>-</button>
                <p>{counter}</p>
                <button onClick={() => setCounter((prev) => prev + 1)} className={styles.button}>+</button>
              </div>
            </div>
          </div>

          <hr className={styles.divider} />
        </div>

        <div className={styles.bottomItems}>
          <div className={styles.checkboxDiv}>
            <input type="checkbox" className={styles.checkbox} checked={isGiftWrap} onChange={() => setIsGiftWrap(!isGiftWrap)} />
            <p className={styles.suggestionText}>
              For <span className={styles.boldText}>${GIFT_WRAP_COST.toFixed(2)}</span>, please wrap the product.
            </p>
          </div>

          <hr className={styles.divider} />
          <div className={styles.total}>
            <p className={styles.subtotal}>Subtotal</p>
            <p className={styles.value}>${subtotal.toFixed(2)}</p>
          </div>

          <button className={styles.checkout} onClick={addToCart}>Add to cart</button>

          <div className={styles.viewCartDiv}>
            <Link href="/shop/cart">
              <p className={styles.viewCart}>View Cart</p>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick={false} pauseOnHover={false} theme="light" transition={Slide} /></>
  );
};

export default MiniCart;

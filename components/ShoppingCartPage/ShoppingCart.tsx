"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import styles from "./shoppingcart.module.scss";
import Image from "next/image";
import RightArrow from "@/public/RightArrow.png";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import close from '@/public/close.png'

interface Product {
  id: string;
  name: string;
  MRP: number;
  discount: number;
  image: string;
  color: { name: string; isActive: boolean }[];
  quantity: number;
}
const GIFT_WRAP_COST = 10;

const ShoppingCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGiftWrap, setIsGiftWrap] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchProducts(user.uid);
      } else {
        console.error("User not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProducts = async (userId: string) => {
    setLoading(true);
    try {
      const productCollection = collection(db, `users/${userId}/productlist`);
      const productSnapshot = await getDocs(productCollection);

      const productData = productSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          MRP: data.MRP,
          discount: data.discount,
          image: data.image,
          color: Array.isArray(data.color)
            ? data.color
            : typeof data.color === "string"
              ? [{ name: data.color, isActive: true }]
              : [],
          quantity: data.quantity || 1,
        };
      }) as Product[];

      console.log("Fetched products:", productData);
      setProducts(productData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching products from Firestore:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (products.length === 0) {
    return <h1>No products in the cart!</h1>;
  }

  const subtotal = products.reduce((acc, product) => {
    const price = product.MRP - (product.MRP * product.discount) / 100;
    return acc + price * product.quantity;
  }, 0);

  const total = isGiftWrap ? subtotal + GIFT_WRAP_COST : subtotal;

  const increaseQuantity = async (productId: string) => {
    setProducts((prevProduct) =>
      prevProduct.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
    await updateQuantity(productId, 1);
  };

  const decreaseQuantity = async (productId: string) => {
    setProducts((prevProduct) =>
      prevProduct.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
    await updateQuantity(productId, -1);
  };

  const updateQuantity = async (productId: string, change: number) => {
    const product = products.find((product) => product.id === productId);
    if (!product) return;

    const newQuantity = product.quantity + change;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const productRef = doc(db, `users/${user.uid}/productlist`, productId);
      await updateDoc(productRef, { quantity: newQuantity });
      console.log("Quantity updated successfully in Firestore");
    } catch (error: unknown) {
      if (error instanceof Error)
        console.log("Error updating quantity:", error);
    }
  };

  const removeProduct = async (productId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      await deleteDoc(doc(db, `users/${user.uid}/productlist`, productId));
      setProducts(products.filter((product) => product.id !== productId));
      console.log("Product Deleted Successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) console.log("Error deleting product:", error);
    }
  };
  return (
    <div className={styles.cartContainer}>
      <div className={styles.pageTitle}>
        <h1 className={styles.mainText}>Shopping Cart</h1>
        <div className={styles.innerDiv}>
          <p>Home</p>
          <Image
            src={RightArrow}
            alt="Right Arrow"
            className={styles.imageContainer}
          />
          <p>Your Shopping Cart</p>
        </div>
      </div>

      <div className={styles.productsInfoDiv}>
        <p className={styles.productp}>All Product</p>
        <p className={styles.pricep}>Price</p>
        <p className={styles.quantityp}>Quantity</p>
        <p className={styles.totalp}>Total</p>
      </div>
      <hr className={styles.divider} />

      {products.map((product) => {
        const price = product.MRP - (product.MRP * product.discount) / 100;
        const activeColor = Array.isArray(product.color)
          ? product.color.find((col) => col?.isActive)?.name ||
          "No color selected"
          : product.color || "No color available";
        const total = price * product.quantity;

        return (
          <div className={styles.productDiv} key={product.id}>
            <div className={styles.cartDiv}>
              <Link className={styles.image} href={`/shop/product?productname=${product.name}`}>
                <Image
                  src={product.image}
                  alt="Cart Product"
                  width={100}
                  height={100}
                /></Link>
              <div className={styles.productInfo}>
                <Link href={`/shop/product?productname=${product.name}`}>
                  <p className={styles.name}>{product.name}</p>
                </Link>
                <p className={styles.color}>Color: {activeColor}</p>
                <button
                  className={`${styles.removeButton} block sm:hidden`}
                  onClick={() => removeProduct(product.id)}
                >
                  <img src={close.src} alt="close" />
                </button>

                <button
                  className={`${styles.removeButton} hidden sm:block`}
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </button>
                <p className={styles.priceMobile}>${price.toFixed(2)}</p>
                <div className={styles.quantityButtonContainerMobile}>
                  <button
                    className={styles.button}
                    onClick={() => decreaseQuantity(product.id)}
                  >
                    -
                  </button>
                  <p>{product.quantity}</p>
                  <button
                    className={styles.button}
                    onClick={() => increaseQuantity(product.id)}
                  >
                    +
                  </button>
                </div>

              </div>
            </div>
            <p className={styles.price}>${price.toFixed(2)}</p>
            <div className={styles.quantityButtonContainer}>
              <button
                className={styles.button}
                onClick={() => decreaseQuantity(product.id)}
              >
                -
              </button>
              <p>{product.quantity}</p>
              <button
                className={styles.button}
                onClick={() => increaseQuantity(product.id)}
              >
                +
              </button>
            </div>
            <p className={styles.total}>${total.toFixed(2)}</p>
          </div>
        );
      })}
      <hr className={styles.divider} />
      <div className={styles.bottomItems}>
        <div className={styles.checkboxDiv}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isGiftWrap}
            onChange={(e) => setIsGiftWrap(e.target.checked)}
          />
          <p className={styles.suggestionText}>
            For <span className={styles.boldText}>${GIFT_WRAP_COST.toFixed(2)}</span>, please wrap the product.
          </p>
        </div>
        <hr className={styles.divider} />
        <div className={styles.total}>
          <p className={styles.subtotal}>Subtotal</p>
          <p className={styles.value}>${total.toFixed(2)}</p>
        </div>
        <button className={styles.checkout}>Checkout</button>
        <div className={styles.viewCartDiv}>
          <Link href={`/shop/cart`}>
            <p className={styles.viewCart}>View Cart</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./productDetails.module.scss";
import Image from "next/image";
import { Countdown, MiniCart } from "@/components";
import { PaymentModes, Star } from "@/public/productPage";
import { Close } from "@/public/productImages";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";

export interface Product {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
  sizes: { id: number; text: string; isActive: boolean }[];
  color: { id: number; name: string; color: string; isActive: boolean }[];
  MRP: number;
  discount: number;
  itemsLeft: number;
  ratings: number;
  reviews: number;
}

export interface Tool {
  id: number;
  image: string;
  text: string;
}

export interface DelAndShip {
  id: number;
  image: string;
  boldText: string;
  text: string;
}

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("productId");
  const productId = productIdParam ? parseInt(productIdParam) : null;
  const productNameParam = searchParams.get("productname");
  const [productLists, setProductLists] = useState<Product[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [delhAndShip, setDelhAndShip] = useState<DelAndShip[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(1);
  const [isActiveSet, setIsActiveSet] = useState<boolean>(false);

  const handleCartButtonClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productLists"));
        const products = querySnapshot.docs.map((doc) => {
          const productData = doc.data();
          return {
            id: productData.id,
            name: productData.name,
            image: productData.image,
            isActive: false,
            sizes: productData.sizes,
            color: productData.color,
            MRP: productData.MRP,
            discount: productData.discount,
            itemsLeft: productData.itemsLeft,
            ratings: productData.ratings,
            reviews: productData.reviews,
          } as Product;
        });
        setProductLists(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchTools = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tools"));
        const toolsData = querySnapshot.docs.map((doc) => {
          const tool = doc.data();
          return {
            id: tool.id,
            image: tool.image,
            text: tool.text,
          } as Tool;
        }) || []; 
        setTools(toolsData);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    const fetchDelhAndShip = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "delhAndShip"));
        const delhAndShipData = querySnapshot.docs.map((doc) => {
          const delAndShip = doc.data();
          return {
            id: delAndShip.id,
            image: delAndShip.image,
            boldText: delAndShip.boldText,
            text: delAndShip.text,
          } as DelAndShip;
        }) || []; 
        setDelhAndShip(delhAndShipData);
      } catch (error) {
        console.error("Error fetching delivery and shipping data:", error);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([fetchProducts(), fetchTools(), fetchDelhAndShip()]);
      setLoading(false); 
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (productLists.length > 0 && !isActiveSet) {
      const foundProduct = productLists.find(
        (product) => product.id === productId || product.name === productNameParam
      );

      if (foundProduct) {
        setProductLists((prevState) =>
          prevState.map((product) => ({
            ...product,
            isActive: product.id === foundProduct.id,
          }))
        );
        setIsActiveSet(true);
      }
    }
  }, [productId, productNameParam, productLists, isActiveSet]);

  const handleButtonClick = (productId: number, sizeId: number) => {
    setProductLists((prevState) =>
      prevState.map((product) =>
        product.id === productId
          ? {
              ...product,
              sizes: product.sizes.map((size) => ({
                ...size,
                isActive: size.id === sizeId,
              })),
            }
          : product
      )
    );
  };

  const handleColorClick = (productId: number, colId: number) => {
    setProductLists((prevState) =>
      prevState.map((product) =>
        product.id === productId
          ? {
              ...product,
              color: product.color.map((col) => ({
                ...col,
                isActive: col.id === colId,
              })),
            }
          : product
      )
    );
  };

  const handlePictureClick = (productId: number) => {
    setProductLists((prevState) =>
      prevState.map((product) => ({
        ...product,
        isActive: product.id === productId,
      }))
    );
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  

  return (
    <div className={styles.mainDiv}>
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}

      <div className={styles.imagesContainer}>
        <div className={styles.allImages}>
          {productLists.map((image) => {
            return (
              <Image
                alt="product Image"
                width={200}
                height={200}
                key={image.id}
                src={image.image}
                onClick={() => handlePictureClick(image.id)}
                className={`${styles.image} ${image.isActive ? styles.imageActive : ""
                  }`}
              />
            );
          })}
        </div>
        <div className={styles.activeImage}>
          {productLists.find((product) => product.isActive)?.image && (
            <Image
              width={400}
              height={900}
              src={
                productLists.find((product) => product.isActive)?.image ||
                "/default-image.jpg"
              }
              alt="Active Product"
              className={styles.activeImg}
            />
          )}
        </div>
      </div>

      <div className={styles.textContainer}>
        <h1 className={styles.logo}>FASCO</h1>
        {productLists
          .filter((product) => product.isActive)
          .map((product) => {
            const discountedPrice =
              product.MRP - (product.MRP * product.discount) / 100;
            const stockPercentage = (product.itemsLeft / 100) * 100;

            return (
              <div className={styles.productDetails} key={product.id}>
                <div className={styles.descriptionDiv}>
                  <h1 className={styles.productName}>{product.name}</h1>
                  <Image
                    src={Star}
                    alt="star image"
                    className={styles.starImg}
                  />
                </div>
                <span className={styles.rating}>
                  {"★".repeat(product.ratings)}
                  {"☆".repeat(5 - product.ratings)} {`(${product.reviews})`}
                </span>
                <div className={styles.priceDiv}>
                  <p className={styles.price}>
                    $ {discountedPrice.toFixed(2)}{" "}
                    <span className={styles.maxPrice}>
                      {" "}
                      ${product.MRP.toFixed(2)}
                    </span>
                  </p>
                  <span className={styles.discount}>
                    Save {product.discount}%
                  </span>
                </div>
                <p className={styles.viewers}>
                  👁️ 69 peoples are viewing this right now
                </p>
                <div className={styles.countdown}>
                  <p className={styles.paragraph}>Hurry up! Sale ends in: </p>
                  <Countdown />
                </div>
                {product.itemsLeft <= 15 ? (
                  <div className={styles.itemsLeft}>
                    <p className={styles.alert}>
                      Only{" "}
                      <span className={styles.stockLeft}>
                        {product.itemsLeft}
                      </span>{" "}
                      item(s) left in stock!
                    </p>

                    <div className={styles.totalStock}>
                      <div
                        className={styles.stockCountBar}
                        style={{
                          width: `${stockPercentage}%`,
                          backgroundColor:
                            stockPercentage < 10 ? "#ff0000" : "#00c853",
                        }}
                      />
                    </div>
                  </div>
                ) : null}
                <div className={styles.sizeContainer}>
                  <p className={styles.size}>
                    Size:{" "}
                    {product.sizes.find((size) => size.isActive)?.text ||
                      "None"}
                  </p>
                  <div className={styles.buttonContainer}>
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        className={`${styles.button} ${size.isActive ? styles.buttonActive : ""
                          }`}
                        onClick={() => handleButtonClick(product.id, size.id)}
                      >
                        {size.text}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.colContainer}>
                  <p className={styles.colName}>
                    Color:{" "}
                    {product.color.find((color) => color.isActive)?.name ||
                      "None"}
                  </p>
                  <div className={styles.buttonContainer}>
                    {product.color.map((color) => (
                      <button
                        key={color.id}
                        className={`${styles.button} ${color.isActive ? styles.buttonActive : ""
                          }`}
                        onClick={() => handleColorClick(product.id, color.id)}
                        style={{ backgroundColor: color.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        <div className={styles.quantityDiv}>
          <p className={styles.quantity}>Quantity</p>
          <div className={styles.buttonContainer}>
            <div className={styles.quantityButtonContainer}>
              <button
                onClick={() => setCounter(counter - 1)}
                className={styles.button}
              >
                -
              </button>
              <p>{counter}</p>
              <button
                onClick={() => setCounter(counter + 1)}
                className={styles.button}
              >
                +
              </button>
            </div>
            <div
              className={`${styles.addCart} ${isMenuOpen ? styles.menuOpen : ""
                }`}
            >
              {!isMenuOpen ? (
                <button
                  className={styles.addButton}
                  onClick={() => handleCartButtonClick()}
                >
                  Add to cart
                </button>
              ) : (
                <div className={styles.cartContainer}>
                  <Image
                    src={Close}
                    alt="close icon"
                    className={styles.closeIcon}
                    onClick={() => handleCartButtonClick()}
                  />
                  <MiniCart
                    activeProduct={productLists.find(
                      (product) => product.isActive
                    )}
                    counter={counter}
                    setCounter={setCounter}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.toolsDiv}>
          {tools.map((tool) => {
            return (
              <div className={styles.commonDiv} key={tool.id}>
                <Image
                  alt="tool images"
                  width={18}
                  height={18}
                  src={tool.image}
                  className={styles.image}
                />
                <p className={styles.text}>{tool.text}</p>
              </div>
            );
          })}
        </div>
        <hr className={styles.divider} />
        <div className={styles.delAndShipDiv}>
          {delhAndShip.map((delAndShip) => {
            return (
              <div className={styles.deliveryDiv} key={delAndShip.id}>
                <Image
                  width={20}
                  height={20}
                  src={delAndShip.image}
                  alt="delivery img"
                />
                <p className={styles.text}>
                  <span className={styles.boldText}>{delAndShip.boldText}</span>
                  {delAndShip.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className={styles.paymentDiv}>
          <Image
            src={PaymentModes}
            alt="payment modes img"
            className={styles.paymentModes}
          />
          <p className={styles.paymentsText}>
            Guarantee safe & secure checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./productList.module.scss";
import { left} from "@/public/vectors";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
  route: string;
  sizes: { id: number; text: string; isActive: boolean }[];
  color: { id: number; name: string; color: string; isActive: boolean }[];
  MRP: number;
  discount: number;
  itemsLeft: number;
  ratings: number;
  reviews: number;
  brand: string;
  tags: string;
  category: string;
};

const ProductList = ({
  toggleFilters,
  selectedCategory,
  products,
}: {
  toggleFilters: () => void;
  selectedCategory: string | null;
  products: Product[];
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);


  const getPaginatedProducts = (): Product[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedProducts = getPaginatedProducts();

  return (
    <div className={styles.allProducts}>
      <div className={styles.mainDiv}>
        <div className={styles.bestSelling}>
          {selectedCategory === null ||
            !products.some((product) => product.category === selectedCategory) ? (
            <h1 className={styles.sellingsText}>All Products</h1>
          ) : (
            <h1 className={styles.sellingsText}>{selectedCategory}</h1>
          )}
          <Image
            src={left}
            alt="Vector Icon"
            width={10}
            className={styles.filter}
            onClick={toggleFilters}
          />
        </div>
      </div>

      <ul className={styles.ulDiv}>
        {paginatedProducts.map((product) => (
          <Link key={product.id} href={`/shop/product?productId=${product.id}?productname=${product.name}`}>
            <li className={styles.list}>
              <div className={styles.productContainer}>

                <Image
                  src={product.image}
                  alt={product.name}
                  className={`${styles.productImg} ${product.isActive ? styles.imageActive : ""
                    }`}
                  width={200}
                  height={200}
                />
                <div className={styles.productDetails}>
                  <h1 className={styles.productName}>{product.name}</h1>
                  <span className={styles.productPrice}>
                    $ {product.MRP.toFixed(2)}
                  </span>
                  <div className={styles.buttonContainer}>
                    {product.color.map((color) => (
                      <button
                        key={color.id}
                        style={{ backgroundColor: color.color }}
                        className={`${styles.button} ${color.isActive ? styles.active : ""
                          }`}
                        aria-label={`Color ${color.color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button
            className={styles.vectorLeft}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >»</button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${styles.paginationButton} ${currentPage === page ? styles.active : ""
              }`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className={styles.vectorRight}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >»</button>
        )}
      </div>
    </div>
  );
};

export default ProductList;


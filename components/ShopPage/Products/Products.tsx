"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Filters, ProductList } from "@/components";
import { Close } from "@/public/productImages";
import styles from "./products.module.scss";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";
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

const Products = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [productLists, setProductLists] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<{ id: number; min: number; max: number }[]>([]);

  useEffect(() => {
    if (isFiltersOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFiltersOpen]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productLists"));
        const data = querySnapshot.docs.map((doc) => {
          const productListsData = doc.data();
          return {
            id: productListsData.id,
            name: productListsData.name,
            image: productListsData.image,
            isActive: false,
            route: productListsData.route,
            sizes: productListsData.sizes,
            color: productListsData.color,
            MRP: productListsData.MRP,
            discount: productListsData.discount,
            itemsLeft: productListsData.itemsLeft,
            ratings: productListsData.ratings,
            reviews: productListsData.reviews,
            brand: productListsData.brand,
            category: productListsData.category,
            tags: productListsData.tags,
          };
        });
        setProductLists(data);
        setFilteredProducts(data);
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchPriceRange = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "priceRange"));
        const data = querySnapshot.docs.map((doc) => {
          const priceData = doc.data();
          return {
            id: priceData.id,
            min: priceData.min,
            max: priceData.max,
          };
        });
        setPriceRange(data);
      } catch (error: unknown) {
        console.error("Error fetching price range:", error);
      }
    };

    fetchPriceRange();
    fetchProducts();
  }, []);

  const toggleFilters = () => {
    setIsFiltersOpen((prev) => !prev);
  };

  const applyFilters = () => {
    console.log("Applying filters...");
    let filtered = [...productLists];

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedBrands) {
      filtered = filtered.filter((product) => product.brand === selectedBrands);
    }

    if (selectedTags) {
      filtered = filtered.filter((product) => product.tags === selectedTags);
    }

    if (selectedPrice !== null) {
      const selectedPriceRange = priceRange.find((price) => price.id === selectedPrice);
      if (selectedPriceRange) {
        filtered = filtered.filter(
          (product) =>
            product.MRP >= selectedPriceRange.min && product.MRP <= selectedPriceRange.max
        );
      }
    }

    console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
  };


  const handleCategoryFiltersChange = (category: string | null) => {
    console.log("Selected Category:", category);
    setSelectedCategory(category);
  };

  const handleBrandsFilterChange = (brand: string | null) => {
    console.log("Selected Brand:", brand);
    setSelectedBrands(brand);
  };

  const handleTagsFilterChange = (tag: string | null) => {
    console.log("Selected Tag:", tag);
    setSelectedTags(tag);
  };

  const handlePriceFilterChange = (priceId: number | null) => {
    console.log("Selected Price Range ID:", priceId);
    setSelectedPrice(priceId);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedBrands, selectedTags, selectedPrice]);

  return (
    <div className={styles.mainDiv}>
      <Filters
        isFiltersOpen={isFiltersOpen}
        selectedCategory={selectedCategory}
        onCategoryFiltersChange={handleCategoryFiltersChange}
        selectedBrands={selectedBrands}
        onBrandsFilterChange={handleBrandsFilterChange}
        selectedTags={selectedTags}
        onTagsFilterChange={handleTagsFilterChange}
        selectedPrice={selectedPrice}
        onPriceFilterChange={handlePriceFilterChange}
      />
      {!isFiltersOpen ? (
        <ProductList
          toggleFilters={toggleFilters}
          selectedCategory={selectedCategory}
          products={filteredProducts}
        />
      ) : (
        <Image
          src={Close}
          alt="close icon"
          className={styles.closeIcon}
          onClick={() => toggleFilters()}
        />
      )}
    </div>
  );
};

export default Products;
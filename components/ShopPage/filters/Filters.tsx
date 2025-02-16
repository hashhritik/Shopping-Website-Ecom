'use client';
import Image from "next/image";
import styles from "./filters.module.scss";
import { upArrow } from "@/public/vectors";
import { Close } from "@/public/productImages";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";

interface SizeButton {
  id: number;
  text: string;
}

interface Color {
  id: number;
  color: string;
}

interface PriceRange {
  id: number;
  min: number;
  max: number;
  isActive: boolean;
}

const Filters = ({
  isFiltersOpen,
  selectedCategory,
  onCategoryFiltersChange,
  selectedBrands,
  onBrandsFilterChange,
  selectedTags,
  onTagsFilterChange,
  selectedPrice,
  onPriceFilterChange,
}: {
  isFiltersOpen: boolean;
  selectedCategory: string | null;
  onCategoryFiltersChange: (category: string | null) => void;
  selectedBrands: string | null;
  onBrandsFilterChange: (brand: string | null) => void;
  selectedTags: string | null;
  onTagsFilterChange: (tag: string | null) => void;
  selectedPrice: number | null;
  onPriceFilterChange: (priceId: number | null) => void;
}) => {

  const [sizeButtons, setSizeButtons] = useState<SizeButton[]>([] as SizeButton[]);
  const [colors, setColors] = useState<Color[]>([] as Color[]);
  const [priceRange, setPriceRange] = useState<PriceRange[]>([]);
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

  const [productLists, setProductLists] = useState<Product[]>([]);

  useEffect(() => {

    const fetchProductLists = async () => {
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
      } catch (error) {
        console.error("Error fetching product lists:", error);
      }
    }
    
    const fetchPriceRange = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "priceRange"));
        const data = querySnapshot.docs.map((doc) => {
          const priceData = doc.data();
          return {
            id: priceData.id,
            min: priceData.min,
            max: priceData.max,
            isActive: priceData.isActive,
          } as PriceRange;
        });
        setPriceRange(data);
      } catch (error) {
        console.error("Error fetching price range:", error);
      }
    };
    
    const fetchColors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "colors"));
        const data = querySnapshot.docs.map((doc) => {
          const colorData = doc.data();
          return {
            id: colorData.id,
            color: colorData.color,
          } as Color;
        });
        setColors(data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    
    const fetchSizeButtons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sizeButtons"));
        const data = querySnapshot.docs.map((doc) => {
          const sizeData = doc.data();
          return {
            id: sizeData.id,
            text: sizeData.text,
          } as SizeButton;
        });
        setSizeButtons(data);
      } catch (error) {
        console.error("Error fetching size buttons:", error);
      }
    };
    
    fetchProductLists();
    fetchSizeButtons();
    fetchColors();
    fetchPriceRange();
    
  }, []);
  
  
  return (
    <>
      <div
        className={`${styles.mainDiv} ${isFiltersOpen ? styles.filtersOpen : ""
          }`}
          >
        <h1 className={`${styles.heading} ${styles.headingSmallScreen}`}>
          Filters
        </h1>
        <div className={styles.sizeButtons}>
          <h1 className={styles.size}>Size</h1>
          <div className={styles.buttons}>
            {sizeButtons.map((button) => {
              return (
                <button
                  className={`${styles.button} ${styles.buttonActive}`}
                  key={button.id}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.colorContainer}>
          <h1 className={styles.colorText}>Color</h1>
          <div className={styles.colorButtons}>
            {colors.map((color) => {
              return (
                <button
                  key={color.id}
                  style={{ backgroundColor: color.color }}
                  className={styles.buttonOne}
                ></button>
              );
            })}
          </div>
        </div>

        <div className={styles.prices}>
          <h1 className={styles.priceText}>Price</h1>
          <ul className={styles.ulList}>
            {priceRange.map((price) => {
              const activePriceRange = price.id === selectedPrice;
              return (
                <li key={price.id} className={styles.liItem}>
                  <input
                    type="checkbox"
                    checked={activePriceRange}
                    onChange={() => onPriceFilterChange(price.id)}
                  />
                  <span
                    className={`${styles.priceRange} ${price.isActive ? styles.active : ""
                      }`}
                  >
                    ${price.min}-${price.max}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.brandsContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.brandText}>Brands</h1>
            <Image src={upArrow} alt="" className={styles.image} />
          </div>
          <ul className={styles.brands}>
            {Array.from(
              new Set(
                productLists
                  .map((product) => product.brand) 
                  .filter((brand) => brand && brand.trim() !== "") 
              )
            ).map((brand, index) => {
              const activeBrand = brand === selectedBrands;
              return (
                <li
                  key={index} 
                  className={`${styles.brand} ${activeBrand ? styles.activeBrand : styles.brand}`}
                  onClick={() => onBrandsFilterChange(brand)}
                >
                  <span
                    className={`${styles.brandName} ${activeBrand ? styles.activeBrand : styles.brandName}`}
                  >
                    {brand}
                  </span>
                  {activeBrand && (
                    <Image
                      src={Close}
                      alt="close button"
                      width={10}
                      height={10}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrandsFilterChange(null);
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.categories}>
          <div className={styles.catTextContainer}>
            <h1 className={styles.categoriesText}>Collections</h1>
            <Image src={upArrow} alt="" className={styles.img} />
          </div>
          <ul className={styles.categoriesUl}>
            {Array.from(
              new Set(
                productLists
                  .map((product) => product.category) 
                  .filter((category) => category && category.trim() !== "") 
              )
            ).map((category, index) => {
              const activeCategory = category === selectedCategory;
              return (
                <li
                  key={index}
                  className={styles.categoriesItem}
                  onClick={() => onCategoryFiltersChange(category)}
                >
                  <input
                    type="checkbox"
                    checked={activeCategory}
                    onChange={() => onCategoryFiltersChange(category)}
                  />
                  <span className={styles.category}>{category}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.tagsContainer}>
          <h1 className={styles.tagText}>Tags</h1>
          <ul className={styles.tags}>
            {Array.from(
              new Set(
                productLists
                  .map((product) => product.tags) 
                  .filter((tag) => tag && tag.trim() !== "") 
              )
            ).map((tag, index) => {
              const activeTags = tag === selectedTags;
              return (
                <li
                  key={index}
                  className={`${styles.tagItem} ${activeTags ? styles.activeTag : styles.tagItem}`}
                  onClick={() => onTagsFilterChange(tag)}
                >
                  <span className={styles.tag}>{tag}</span>
                  {activeTags && (
                    <Image
                      src={Close}
                      alt="close button"
                      width={10}
                      height={10}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagsFilterChange(null);
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Filters;

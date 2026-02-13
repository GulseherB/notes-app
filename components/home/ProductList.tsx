import { Product } from "@/data/model/products";
import { StorageFile } from "@/data/model/storage-file";
import { useBakeryContext } from "context/BakeryContext";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import styles from "@/styles/Home.module.css";
import Loader from "../common/loader/Loader";
import ProductModal from "./ProductModal";
import { FaCartPlus } from "react-icons/fa";

const ClientStarRating = dynamic(() => import("./ClientStartRating"), {
  ssr: false,
});

type ProductListProps = {
  products: Product[];
  loading: boolean;
};

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  const [singleProduct, setSingleProduct] = useState<Product>();
  const [modalShow, setModalShow] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { cart, addToCart, setCartShow } = useBakeryContext();

  const getProductId = (product: Product): string => {
    return ((product as any)._id || product.id || '').toString();
  };

  const showProductModal = (product: Product) => {
    setSingleProduct(product);
    setModalShow(true);
    const productId = getProductId(product);
    const findInCart = cart?.items.find((item) => item.product_id === productId);
    if (findInCart) {
      setProductQuantity(findInCart.quantity);
    } else {
      setProductQuantity(1);
    }
  };

  const setModalClose = (show: boolean) => {
    setModalShow(false);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = async (product: Product) => {
    console.log('ProductList - handleAddToCart product:', product);
    
    const productId = getProductId(product);
    console.log('ProductList - productId:', productId);
    
    if (!productId) {
      alert('Ürün ID bulunamadı');
      return;
    }

    const qty = quantities[productId] ?? 1;
    console.log('ProductList - quantity:', qty);
    
    try {
      await addToCart(productId, qty);
      setCartShow(true);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
    }
  };

  return (
    <>
      <Row className={`py-4 ${styles.productGridSection}`}>
        <Col md="12">
          {loading ? <Loader /> : null}
          {!products.length && !loading && (
            <Row className="py-5 mt-5 mb-5">
              <Col md={{ span: 6, offset: 3 }} className="mt-5 mb-5">
                <h4 className="ft-20 fw-bold text-center">No Products Found!</h4>
              </Col>
            </Row>
          )}
          <Row className={styles.productGrid}>
            {products.length > 0 &&
              products.map((product) => {
                const productId = getProductId(product);
                const imagePath =
                  product.storage_files.length > 0
                    ? product.storage_files[0]
                    : ({} as StorageFile);

                const imageUrl =
                  Object.keys(imagePath).length > 0
                    ? imagePath.image_url
                    : "/images/placeholder.svg";

                return (
                  <Col
                    lg="3"
                    md="4"
                    sm="6"
                    xs="12"
                    key={productId}
                    className={styles.productCardCol}
                  >
                    <Card className={styles.productCard}>
                      <div className={styles.productThumb}>
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={600}
                          height={450}
                          className={styles.productImage}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          unoptimized
                        />
                      </div>
                      <Card.Body className={styles.productBody}>
                        <div className={styles.productHeader}>
                          <span className={styles.productName}>{product.name}</span>
                          <span className={styles.productPrice}>
                            ₺ {Number(product.price).toFixed(2)}
                          </span>
                        </div>
                        <div className={styles.productRating}>
                          <ClientStarRating />
                        </div>
                        <div className={styles.productQuantityControl}>
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange(productId, -1)}
                            className={styles.qtyButton}
                          >
                            −
                          </Button>
                          <span className={styles.qtyValue}>
                            {quantities[productId] ?? 1}
                          </span>
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleQuantityChange(productId, 1)}
                            className={styles.qtyButton}
                          >
                            +
                          </Button>
                        </div>
                        <div className={styles.productActions}>
                          <Button
                            variant="danger"
                            className={styles.quickViewButton}
                            onClick={() => showProductModal(product)}
                          >
                            Quick View
                          </Button>
                          <Button
                            variant="outline-warning"
                            className={styles.addToCartButton}
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaCartPlus size={18} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
      <ProductModal
        singleProduct={singleProduct as Product}
        modalShow={modalShow}
        setModalClose={setModalClose}
        productQuantity={productQuantity}
      />
    </>
  );
};

export default ProductList;

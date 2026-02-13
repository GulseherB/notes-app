import BaseContainer from "@/components/common/container/BaseContainer";
import HomeCarousel from "@/components/header/HomeCarousel";
import Meta from "@/components/meta/Meta";
import { GetServerSideProps } from "next";
import { Button } from "react-bootstrap";
import { NextPageWithLayout } from "./_app";
import { Product } from "@/data/model/products";
import { getProducts } from "@/data/api/products";
import ProductList from "@/components/home/ProductList";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

type HomePageData = {
  response: {
    productsItems: Product[];
  };
};

const Home: NextPageWithLayout<HomePageData> = ({
  response: { productsItems },
}) => {
  const products = productsItems;
  const loading = false;

  return (
    <>
      <Meta
        title="Karadağ Baharat - En taze ve kaliteli baharatlar"
        content="Türkiye'nin en kaliteli baharatları Karadağ Baharat'ta"
      />
      <header>
        <HomeCarousel />
      </header>
      <BaseContainer>
        <section className={styles.productSection}>
          <p className={styles.sectionEyebrow}>Karadağ Baharat</p>
          <h2 className={styles.sectionTitle}>Öne Çıkan Baharat Koleksiyonları</h2>
          <p className={styles.sectionDescription}>
            Türkiye&rsquo;nin dört bir yanından özenle seçilip kavrulan, aroması yüksek
            baharatlarımızı keşfedin. Geleneksel tariflerinizi taze bir dokunuşla
            buluşturun.
          </p>
          <ProductList products={products} loading={loading} />
        </section>
      </BaseContainer>

      <section className={styles.inspirationSection}>
        <div className={styles.inspirationContainer}>
          <div className={styles.inspirationImageWrapper}>
            <Image
              src="/images/slider1.jpg"
              alt="Karadağ Baharat koleksiyon görseli"
              width={960}
              height={540}
              priority
              className={styles.productImage}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className={styles.inspirationCopy}>
            <h2 className={styles.inspirationTitle}>Celebrate with Morning Bakery Food!</h2>
            <p className={styles.inspirationText}>
              Özel günlerinize eşlik edecek taze çekilmiş baharatlar, geleneksel
              tarifler ve artisan dokunuşlar... Her lokmada kalite ve tutku.
            </p>
            <div className={styles.actionRow}>
              <Button href="/products/cake" variant="danger">
                View More
              </Button>
              <Button href="/products/all-items" variant="outline-dark">
                Go to Shop
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const productsUrl = `?category=all&limit=12`;
    const productRes = await getProducts(productsUrl);

    const response = {
      productsItems: productRes.data.data || [],
    };

    return { props: { response } };
  } catch (error) {
    console.error("Homepage data fetch error:", error);

    return {
      props: {
        response: {
          productsItems: [],
        },
      },
    };
  }
};

export default Home;

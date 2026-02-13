import BaseContainer from "@/components/common/container/BaseContainer";
import Meta from "@/components/meta/Meta";
import { StorageFile } from "@/data/model/storage-file";
import { GetServerSideProps } from "next";
import React from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { NextPageWithLayout } from "../_app";

type AboutUsProps = {
  productBanner: StorageFile[];
};

const AboutUs: NextPageWithLayout<AboutUsProps> = ({ productBanner }) => {
  return (
    <section>
      <Meta
        title={`Karadağ Baharat | Hakkımızda`}
        content={`Türkiye&#39;nin en kaliteli baharat tedarikçisi - Karadağ Baharat`}
      />
      <BaseContainer>
        <Row className="py-5">
          <Col md="6">
            <Row>
              <Col md="12">
                <Card className="rounded-0">
                  <Card.Body className="py-0 px-0">
                    {/*eslint-disable-next-line @next/next/no-img-element*/}
                    <img
                      src={
                        productBanner.length > 0
                          ? productBanner[0].image_url
                          : "https://images.unsplash.com/photo-1596040033229-a0b7e0b2e4a7?w=600"
                      }
                      alt="baharatlar"
                      className="img-fluid"
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col md="6">
            <h1 className="ft-24 fw-bold text-uppercase text-center text-danger mb-2">
              Biz Kimiz
            </h1>
            <h1 className="ft-24 fw-bold text-dark text-center mt-3 mb-3">
              Karadağ Baharat Hakkında
            </h1>
            <div>
              <p className="text-justify ft-14 fw-normal text-color-b94 mt-2 mb-3">
                Karadağ Baharat, Türkiye&#39;nin önde gelen baharat tedarikçilerinden biridir. 
                Yılların deneyimi ve müşteri memnuniyeti odaklı yaklaşımımızla, en kaliteli 
                baharatları sofranıza taşıyoruz.
              </p>
              <p className="text-justify ft-14 fw-normal text-color-b94 mt-2 mb-3">
                Her gün taze - İşte bunun için varız. Her zaman premium kaliteye inandık. 
                Ürün kalitesi ve hijyenden asla taviz vermiyoruz. Tüm ürünlerimiz hijyenik 
                koşullarda işlenir ve paketlenir. En iyi hammaddeleri yerel ve uluslararası 
                pazarlardan temin ediyoruz.
              </p>
              <p className="text-justify ft-14 fw-normal text-color-b94 mt-2 mb-3">
                Kırmızı biber, karabiber, kimyon, sumak, pul biber ve daha fazlası... 
                Geniş ürün yelpazemiz ile mutfağınıza lezzet katıyoruz. Tüm Türkiye&#39;ye 
                hızlı ve güvenli teslimat yapıyoruz.
              </p>
              <p className="text-justify ft-14 fw-normal text-color-b94 mt-2 mb-3">
                Çeşitlilik ve kalite, değerlerimizin ve büyüme stratejimizin merkezindedir. 
                Müşteri memnuniyeti odaklı sağlıklı bir çalışma ortamı yaratmaya odaklanıyoruz.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <h1 className="ft-20 text-danger mt-3 mb-3 text-center ">
              MORNING BAKERY
            </h1>
            <h2 className="ft-30 text-dark mt-3 mb-3 text-center ">
              MADE FRESH EVERY DAY
            </h2>
          </Col>
          <Col md="6">
            <Row>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-18 fw-normal text-danger text-center mt-2 mb-3">
                  OUR OUTLETS
                </h1>
                <p className="text-center ft-14 fw-normal text-color-b94 min-height-150">
                  Morning bakery is one of the most prominent bakeries in
                  Bangladesh. At Present, we have 30 outlets in Dhaka city and
                  are ready to take your orders and provide you the best food
                  for your special days.
                </p>
                <Row>
                  <Col md={{ span: 8, offset: 4 }}>
                    <Button variant="danger" className="rounded-0">
                      <span className="ft-16 ft-normal">Read More</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-18 fw-normal text-danger text-center mt-2 mb-3">
                  OUR PRODUCTS
                </h1>
                <p className="text-center ft-14 fw-normal text-color-b94 min-height-150">
                  We offer almost every food and beverage category in
                  Bangladesh.
                </p>
                <Row>
                  <Col md={{ span: 8, offset: 4 }}>
                    <Button
                      variant="danger"
                      className="rounded-0"
                      href="/products/sweets"
                    >
                      <span className="ft-16 ft-normal">Read More</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="py-5 border-bottom">
          <Col md="6">
            <h1 className="ft-17 text-danger mt-3 mb-3 text-center ">
              Our Mission
            </h1>
            <h2 className="ft-22 text-dark mt-2 mb-2 text-center ">
              MADE FRESH EVERY DAY
            </h2>
            <p className="ft-16 fw-normal text-color-b94 mb-3 text-center ">
              Our mission is to provide global quality food in a very hospitable
              environment. Entertaining our customers in a very friendly
              atmosphere with efficient service is the key to our success.
            </p>
          </Col>
          <Col md="6">
            <Row>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-30 fw-bold text-dark text-center mt-2 mb-2">
                  2001
                </h1>
                <p className="text-center ft-18 fw-normal text-color-b94 text-uppercase">
                  Founding Year
                </p>
              </Col>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-30 fw-bold text-dark text-center mt-2 mb-2">
                  30
                </h1>
                <p className="text-center ft-18 fw-normal text-color-b94 text-uppercase">
                  Outlets
                </p>
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-30 fw-bold text-dark text-center mt-2 mb-2">
                  20
                </h1>
                <p className="text-center ft-18 fw-normal text-color-b94 text-uppercase">
                  Categories
                </p>
              </Col>
              <Col md="6" sm="6" xs="6">
                <h1 className="ft-30 fw-bold text-dark text-center mt-2 mb-2">
                  100000
                </h1>
                <p className="text-center ft-18 fw-normal text-color-b94 text-uppercase">
                  HAPPY FOLLOWERS
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </BaseContainer>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    // Placeholder görsel
    const productBanner = [{
      id: 1,
      image_url: 'https://images.unsplash.com/photo-1596040033229-a0b7e0b2e4a7?w=600',
      type: 'about_banner',
    }];

    return { props: { productBanner } };
  } catch (error) {
    console.error('About page error:', error);
    return {
      props: { productBanner: [] },
    };
  }
};

export default AboutUs;

import CartSingleItem from "@/components/cart/CartSingleItem";
import BaseContainer from "@/components/common/container/BaseContainer";
import Meta from "@/components/meta/Meta";
import { useBakeryContext } from "context/BakeryContext";
import { useRouter } from "next/router";
import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { BsCartX } from "react-icons/bs";

const CartItems = () => {
  const router = useRouter();
  const { cart } = useBakeryContext();
  
  const cartItems = cart?.items || [];
  const totalAmount = cart?.total_amount || 0;
  const shippingFee = 20; // Kargo ücreti TL

  return (
    <BaseContainer>
      <Meta
        title={`Karadağ Baharat | Sepetim`}
        content={`Karadağ Baharat - Sepet`}
      />
      {!cartItems.length && (
        <Row className="py-5 mt-5 mb-5 border-bottom">
          <Col md="12" xs="12">
            <div className="mt-3 mb-3">
              <span>
                <BsCartX size={50} className="mx-auto d-block" />
              </span>
            </div>
            <div className="mt-3 mb-3">
              <h2 className="ft-14 fw-normal text-center">
                Sepetinizde ürün bulunmuyor.
              </h2>
            </div>
            <div className="mt-3 mb-3 px-5">
              <Row>
                <Col md={{ span: 4, offset: 4 }}>
                  <Button
                    variant="danger"
                    className="text-center w-100"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    <span className="ft-13 fw-bold text-uppercase">
                      Alışverişe Devam Et
                    </span>
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
      {cartItems.length > 0 && (
        <Row className="py-2 border-bottom">
          <Col md="8">
            <Card className="rounded-0 py-2 border-0">
              <Card.Body>
                <Row className="py-1 border-bottom px-3">
                  <Col
                    md="3"
                    xs="3"
                    className="text-center d-none d-sm-block d-md-block d-lg-block"
                  >
                    <span className="text-uppercase ft-14 fw-bold"></span>
                  </Col>
                  <Col
                    md="3"
                    xs="3"
                    className="text-center d-none d-sm-block d-md-block d-lg-block"
                  >
                    <span className="text-uppercase ft-14 fw-bold">
                      Ürün
                    </span>
                  </Col>
                  <Col
                    md="4"
                    xs="4"
                    className="text-center d-none d-sm-block d-md-block d-lg-block"
                  >
                    <span className="text-uppercase ft-14 fw-bold">Fiyat</span>
                  </Col>
                  <Col
                    md="2"
                    xs="2"
                    className="text-center d-none d-sm-block d-md-block d-lg-block"
                  >
                    <span className="text-uppercase ft-14 fw-bold">
                      Miktar
                    </span>
                  </Col>
                </Row>
                <Row className="py-1">
                  {cartItems.map((item) => (
                    <Col
                      md="12"
                      className="border-bottom"
                      key={item.product_id}
                    >
                      <CartSingleItem item={item} />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4" className="">
            <Card className="rounded-0">
              <Card.Body>
                <h4 className="ft-20 fw-bold mt-2 mb-2 text-justify text-uppercase px-1">
                  SEPET TOPLAMI
                </h4>
                <div className="ft-14">
                  <Row className="px-1 border-bottom py-3">
                    <Col className="text-start fw-bold">Ara Toplam</Col>
                    <Col className="text-end text-uppercase fw-bold text-color-b94">
                      ₺{Number(totalAmount).toFixed(2)}
                    </Col>
                  </Row>
                </div>
                <div className="border-bottom py-2">
                  <Row className="px-1 ft-14 mt-3 mb-3">
                    <Col className="text-start fw-bold">Kargo</Col>
                    <Col className="text-end fw-bold text-color-b94">
                      ₺{shippingFee.toFixed(2)}
                    </Col>
                  </Row>
                </div>
                <div className="py-2">
                  <Row className="px-1 mt-2 mb-2">
                    <Col
                      md="6"
                      className="text-start text-uppercase fw-bold ft-18"
                    >
                      Toplam
                    </Col>
                    <Col md="6" className="text-end ">
                      <span className="text-color-d12 fw-bold ft-20">
                        ₺{Number(totalAmount + shippingFee).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" className="px-4 mt-2 mb-2">
                      <Button
                        variant="danger"
                        className="text-center w-100 rounded-0"
                        onClick={() => router.push("/checkout")}
                      >
                        <span className="ft-13 fw-bold text-uppercase">
                          Ödemeye Geç
                        </span>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </BaseContainer>
  );
};

export default CartItems;

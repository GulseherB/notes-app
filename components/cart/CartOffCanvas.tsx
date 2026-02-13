import { useBakeryContext } from "context/BakeryContext";
import React from "react";
import { Button, Card, Col, Offcanvas, Row } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import { BsCartX } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";

const CartOffCanvas = () => {
  const router = useRouter();
  const { cart, cartShow, setCartShow, updateQuantity, removeFromCart, loading } =
    useBakeryContext();

  const cartItems = cart?.items || [];
  const totalAmount = cart?.total_amount || 0;

  return (
    <Offcanvas
      show={cartShow}
      onHide={() => setCartShow(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton className="border">
        <Offcanvas.Title className="ft-20 fw-bold text-uppercase">
          Sepetim
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {!cartItems.length && (
          <Row className="py-5">
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
                <Button
                  variant="danger"
                  className="text-center w-100"
                  onClick={() => {
                    setCartShow(false);
                    router.push("/");
                  }}
                >
                  <span className="ft-13 fw-bold text-uppercase">
                    Alışverişe Devam Et
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
        )}
        <div style={{ marginBottom: "30px" }}>
          <Row className="py-1 border-bottom">
            {cartItems.map((item) => (
              <Col md="12" className="px-2" key={item.product_id}>
                <Row className="py-2 border-bottom">
                  <Col md="4" xs="4">
                    <Card className="rounded-0">
                      <Card.Body className="py-0 px-0 position-relative">
                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                        <img
                          src={item.image_url || '/images/placeholder.svg'}
                          alt={item.name}
                          className="mx-auto d-block"
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6" xs="6">
                    <h5 className="ft-14 ft-normal mt-1 mb-2">
                      {item.name}
                    </h5>
                    <div className="d-flex align-items-center mb-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="p-1"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        style={{ width: '30px', height: '30px' }}
                      >
                        <AiOutlineMinus size={14} />
                      </Button>
                      <span className="mx-2 ft-14 fw-bold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="p-1"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={loading}
                        style={{ width: '30px', height: '30px' }}
                      >
                        <AiOutlinePlus size={14} />
                      </Button>
                    </div>
                    <div>
                      <span className="text-danger ft-13 fw-bold">
                        ₺{Number(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </Col>
                  <Col md="2" xs="2">
                    <MdClose
                      size={18}
                      className="mx-auto d-block border border-danger cursor-pointer"
                      onClick={() => removeFromCart(item.product_id)}
                      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    />
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </div>
        {cartItems.length > 0 && (
          <>
            <Row className="py-2 mt-3 mb-2 px-3">
              <Col md="6" xs="6">
                <h4 className="ft-20 fw-bold text-start">TOPLAM : </h4>
              </Col>
              <Col md="6" xs="6">
                <h4 className="ft-20 fw-bold text-end text-danger">
                  ₺{Number(totalAmount).toFixed(2)}
                </h4>
              </Col>
            </Row>
            <Row className="py-1">
              <Col md="12" xs="12">
                <div className="px-3">
                  <Button
                    variant="danger"
                    className="text-center w-100 rounded-0"
                    onClick={() => {
                      setCartShow(false);
                      router.push("/cart");
                    }}
                  >
                    <span className="ft-13 fw-bold text-uppercase">
                      Sepeti Görüntüle
                    </span>
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="py-1">
              <Col md="12" xs="12">
                <div className="px-3">
                  <Button
                    variant="danger"
                    className="text-center w-100 rounded-0"
                    onClick={() => {
                      setCartShow(false);
                      router.push("/checkout");
                    }}
                  >
                    <span className="ft-13 fw-bold text-uppercase">
                      Ödeme Yap
                    </span>
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartOffCanvas;

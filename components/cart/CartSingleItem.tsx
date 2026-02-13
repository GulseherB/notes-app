import { CartItem } from "context/BakeryContext";
import { useBakeryContext } from "context/BakeryContext";
import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdClose } from "react-icons/md";

type CartSingleItemProps = {
  item: CartItem;
};

const CartSingleItem: React.FC<CartSingleItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, loading } = useBakeryContext();

  return (
    <Row className="py-2">
      <Col md="3" xs="3">
        <Row>
          <Col md="2" xs="2" className="d-none d-md-block d-lg-block">
            <span className="px-2">
              <MdClose
                size={18}
                className="mx-auto d-block border border-danger cursor-pointer"
                onClick={() => removeFromCart(item.product_id)}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              />
            </span>
          </Col>
          <Col md="10" xs="12">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={item.image_url || '/images/placeholder.svg'}
              alt={item.name}
              width={60}
              height={60}
              style={{ objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Col>
      <Col md="9" xs="9">
        <Row>
          <Col md="5" xs="12" className="text-center mt-1 mb-1">
            <Row>
              <Col md="12" xs="10">
                <h5 className="ft-16 ft-normal mt-1 mb-1">{item.name}</h5>
              </Col>
              <Col md="1" xs="2" className="d-block d-sm-none">
                <span>
                  <MdClose
                    size={16}
                    className="mx-auto d-block border border-danger cursor-pointer"
                    onClick={() => removeFromCart(item.product_id)}
                  />
                </span>
              </Col>
            </Row>
          </Col>
          <Col md="5" xs="12" className="text-center mt-1 mb-1">
            <h5 className="ft-16 ft-normal mt-1 mb-1">
              <span className="ft-13 fw-bold">{item.quantity}</span>
              <span className="ft-13 fw-bold px-1">x</span>
              <span className="text-danger ft-13 fw-bold">
                ₺{Number(item.price).toFixed(2)}
              </span>
              <span className="ft-13 fw-bold px-1">=</span>
              <span className="text-danger ft-13 fw-bold">
                ₺{Number(item.price * item.quantity).toFixed(2)}
              </span>
            </h5>
          </Col>
          <Col md="2" xs="12" className="text-center mt-1 mb-1">
            <div className="d-flex justify-content-center align-items-center">
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
              <span className="mx-3 ft-14 fw-bold">{item.quantity}</span>
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
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CartSingleItem;

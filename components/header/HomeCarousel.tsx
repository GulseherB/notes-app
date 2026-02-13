import { Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

const HomeCarousel: React.FC = () => {
  const sliderImages = [
    "/images/slider1.jpg",
    "/images/slider2.jpg"
  ];

  return (
    <Carousel>
      {sliderImages.map((image, index) => (
        <Carousel.Item
          key={index}
          interval={6000}
          style={{
            minHeight: "450px",
            height: "100%",
          }}
        >
          <Row>
            <Col
              className="py-0"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "450px",
                height: "100%",
              }}
            />
          </Row>

          <Carousel.Caption>
            <h3 className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
              Karadağ Baharat
            </h3>
            <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
              En taze ve kaliteli baharatlar
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;

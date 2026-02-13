import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./bakery-navbar.module.css";
import HamBurgerIcon from "../HamBurgerIcon";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { Badge, NavDropdown } from "react-bootstrap";
import { useBakeryContext } from "context/BakeryContext";
import ProfileNavItem from "../ProfileNavItem";

const categories = [
  {
    id: 1,
    name: "Tüm Baharatlar",
    alias: "all",
  },
  {
    id: 2,
    name: "Kırmızı Biber",
    alias: "red-pepper",
  },
  {
    id: 3,
    name: "Karabiber",
    alias: "black-pepper",
  },
  {
    id: 4,
    name: "Kimyon",
    alias: "cumin",
  },
  {
    id: 5,
    name: "Sumak",
    alias: "sumac",
  },
  {
    id: 6,
    name: "Kekik",
    alias: "thyme",
  },
];

const BakeryNavbar = () => {
  const router = useRouter();
  const [buttonRef, setButtonRef] = useState<number | string>("");
  const { data: session } = useSession();
  const { cart, setCartShow } = useBakeryContext();
  
  const cartItemsCount = cart?.items?.length || 0;

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className={`${styles.navBgColor} py-4`}
    >
      <Container>
        <Navbar.Brand
          href="/"
          role="general-navbar-brand-role"
          className={`${styles.ft18} ${styles.ftBold}`}
        >
          <span className="text-warning">Karadağ Baharat</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          role="navbar-toggle-role"
          className="border-none"
        >
          <HamBurgerIcon />
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/"
              className={`text-white ${styles.ft14} fw-normal`}
            >
              Home
            </Nav.Link>
            <NavDropdown
              title="Products"
              id="products"
              className={`${styles.ft14} fw-normal nav-products`}
            >
              {categories.length > 0 &&
                categories.map((category) => (
                  <NavDropdown.Item
                    key={category.id}
                    href={`/products/${category.alias}`}
                    className={`text-dark ${styles.ft14} fw-normal`}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>

            <Nav.Link
              href="/about-us"
              className={`text-white ${styles.ft14} fw-normal`}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              href="/contact-us"
              className={`text-white ${styles.ft14} fw-normal`}
            >
              Contact Us
            </Nav.Link>
          </Nav>
          <Nav>
            {!session && (
              <>
                <Nav.Link
                  href="/auth/signin"
                  className={`text-white ${styles.ft14}`}
                >
                  Sign In
                </Nav.Link>
                <Nav.Link
                  href="/auth/signup"
                  className={`text-white ${styles.ft14} mr-2`}
                >
                  Sign Up
                </Nav.Link>
              </>
            )}

            <Nav.Link href="#" className={`text-white ${styles.ft14}`}>
              <FaHeart size={18} />
              <span>
                <sup className="text-white">
                  <Badge bg="danger" className={styles.ft10}>
                    0
                  </Badge>
                </sup>
              </span>
            </Nav.Link>

            <Nav.Link
              className={`text-white ${styles.ft14}`}
              onClick={() => setCartShow(true)}
            >
              <FaCartPlus size={18} />
              <span>
                <sup className="text-white">
                  <Badge bg="danger" className={styles.ft10}>
                    {cartItemsCount}
                  </Badge>
                </sup>
              </span>
            </Nav.Link>

            {session && <ProfileNavItem />}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BakeryNavbar;

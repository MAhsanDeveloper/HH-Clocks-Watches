import React, { useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import ShopPage from "./ShopPage";
import ContactPage from "./ContactPage";
const Footer = React.lazy(() => import("../components/Footer"));

const HomePage = ({ scrollTo }) => {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollTo]);

  return (
    <main className="flex flex-col">
      {/* Hero Section Wrapper */}
      <div className="h-screen flex flex-col bg-black overflow-hidden relative">
        {/* Navbar */}
        <header className="z-10 flex flex-wrap items-center justify-between px-6 py-4 bg-black bg-opacity-90 backdrop-blur-sm">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-fill rounded-2xl"
          />

          {/* Nav Links (Always visible) */}
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-3 sm:mt-0 text-white font-medium tracking-wide">
            <a
              href="#shop"
              className="hover:text-amber-500 transition duration-200"
            >
              Shop
            </a>
            <a
              href="#contact"
              className="hover:text-amber-500 transition duration-200"
            >
              Contact Us
            </a>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4 text-white mt-3 sm:mt-0">
            <Link to="/cart" className="hover:text-amber-500 transition">
              <FaShoppingCart />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div
          id="mission"
          className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 relative"
        >
          {/* Left Text */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <div className="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                Free Delivery on All Orders
              </div>
              <div className="inline-block bg-green-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                Rs 300 Advance Payment
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-4">
              Classic Watch <br className="hidden md:block" />
              with Ceramic Bracelet
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              A concept watch that has become reality. <br />
              Featuring a full ceramic case and bracelet.
            </p>

            <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
              <a
                href="#shop"
                className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition-all duration-200 shadow hover:shadow-lg"
              >
                Go to Shop
              </a>
            </div>
          </div>

          {/* Watch Images */}
          <div className="md:w-1/2 h-full mt-8 md:mt-0 flex justify-center items-center">
            <div className="flex items-center relative">
              <img
                src="/hero2.jpg"
                alt="Watch"
                className="h-[320px] sm:h-[400px] md:h-[480px] object-cover rounded-xl z-10 shadow-lg"
              />
              <img
                src="/hero3.jpg"
                alt="Watch"
                className="h-[320px] sm:h-[400px] md:h-[480px] object-cover rounded-xl absolute left-1/2 -translate-x-[30%] opacity-80 blur-[0.5px] shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shop Section */}
      <section id="shop" className="scroll-mt-20">
        <ShopPage />
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <ContactPage />
      </section>

      <Suspense
        fallback={<div className="text-center py-6 text-white">Loading...</div>}
      >
        <Footer />
      </Suspense>
    </main>
  );
};

export default HomePage;

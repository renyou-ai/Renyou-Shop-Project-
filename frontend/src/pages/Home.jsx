import Navbar from "../components/Navbar";
import IAsearchSection from "../components/IAsearchSection";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll chaque 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { clientWidth } = carouselRef.current;
        const newIndex = activeIndex + 1 >= 2 ? 0 : activeIndex + 1;
        setActiveIndex(newIndex);
        carouselRef.current.scrollTo({
          left: newIndex * clientWidth,
          behavior: "smooth",
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Update active index quand user scroll manuellement
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(newIndex);
    }
  };

  // Click dots
  const goToSlide = (index) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      carouselRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  // Drag logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // vitesse drag
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="animate-fadeSlideIn min-h-screen flex flex-col">
      <Navbar />

      {/* Carousel Section */}
      <section className="relative flex justify-center items-start h-[110vh] overflow-hidden">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex w-full h-full snap-x snap-mandatory overflow-x-scroll scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {/* Image 1 */}
          <img
            src="/assets/background/Rectangle1.png"
            alt="Background 1"
            className="w-full h-auto object-contain flex-shrink-0 snap-center translate-y-3"
          />
          {/* Image 2 */}
          <img
            src="/assets/background/Rectangle2.png"
            alt="Background 2"
            className="w-full h-auto object-contain flex-shrink-0 snap-center translate-y-3"
          />
        </div>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                activeIndex === index ? "bg-violet-600" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* IA Search Section intégré avec image réduite à 40% */}
      <div className="flex justify-center mt-10">
        <div className="w-2/5">
          <IAsearchSection />
        </div>
      </div>

      {/* Start diagnosis cliquable → page diagnostics */}
      <div
        onClick={() => navigate("/diagnostics")}
        className="cursor-pointer flex justify-center mt-10"
      >
        <img
          src="/assets/background/Rectangle4.png"
          alt="Start diagnosis"
          className="w-full cursor-pointer"
        />
      </div>

      <div className="h-20"></div>

      {/* Section avec bouton orange → cliquable */}
      <div className="relative w-full">
        <img
          src="/assets/background/Section.png"
          alt="Section"
          className="w-full"
        />
        {/* Zone cliquable sur le bouton orange "View All Products" */}
        <div
          onClick={() => navigate("/all-products")}
          className="absolute top-[1rem] left-[92%] transform -translate-x-1/2 w-[10rem] h-[3rem] cursor-pointer"
        ></div>
      </div>

      <div className="h-20"></div>
      <img src="/assets/background/Background1.png" alt="Background (1)" className="w-full cursor-pointer" />
      <div className="h-20"></div>
      <img src="/assets/background/Section1.png" alt="Section (1)" className="w-full cursor-pointer" />
      <div className="h-20"></div>
      <img src="/assets/background/Container.png" alt="Container" className="w-full cursor-pointer" />
      <div className="h-20"></div>
      <img src="/assets/background/Group3599.png" alt="Group 3599" className="w-full cursor-pointer" />
      <div className="h-20"></div>
      <img src="/assets/background/Overlay.png" alt="Overlay" className="w-full cursor-pointer" />
      <div className="h-20"></div>

      <Footer />
    </div>
  );
}

<GoogleLogin
  onSuccess={(credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    // houni tnajjem tab3ath token lel backend bech ta3ml verification
  }}
  onError={() => {
    console.log("Google login failed");
  }}
  useOneTap={false} // bech yban bouton normal
/>


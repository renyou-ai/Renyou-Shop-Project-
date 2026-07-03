import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return () => {
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY.toString());
    };
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigationType === "POP") {
        const saved = sessionStorage.getItem(`scroll-${location.pathname}`);
        if (saved) {
          window.scrollTo({
            top: Number(saved),
            behavior: "smooth",
          });
          return;
        }
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, navigationType]);

  return null;
}
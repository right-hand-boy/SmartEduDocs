import React, { useEffect, useRef, useState } from "react";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import NavBar from "../components/common/NavBar";
import Features from "../components/home/Features";
import Contact from "../components/home/Contact";
import Footer from "../components/common/Footer";
import HowItWorks from "../components/home/HowItWorks";
import CoursesOverview from "../components/home/CoursesOverview";
import FAQSection from "../components/home/FAQSection";
import CTA from "../components/home/CTA";
import DepartmentCourseDescription from "../components/home/DepartmentCourseDescription";
import FavouriteBooks from "../components/home/FavouiriteBooks";
import BookGallery from "../components/home/BookGallery";
import PageTitle from "../utils/PageTitle";

function HomePage() {
  const heroRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsHeroInView(entry.isIntersecting);
      },
      { threshold: 0.85 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <>
      <PageTitle title={"Department and Course Management System"} />
      <div className="fixed top-0 w-full left-0 z-50">
        <NavBar isHeroInView={isHeroInView} />
      </div>
      <Hero ref={heroRef} />
      <Features />
      <About />
      <FavouriteBooks />
      <DepartmentCourseDescription />
      <BookGallery />
      <HowItWorks />
      <CoursesOverview />
      <FAQSection />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}

export default HomePage;

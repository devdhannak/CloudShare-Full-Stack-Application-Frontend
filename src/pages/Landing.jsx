import React, { useEffect } from "react";
import HeroSection from "../components/Landing/HeroSection";
import FeaturesSection from "../components/Landing/FeaturesSection";
import PricingSection from "../components/Landing/PricingSection";
import TestimonialSection from "../components/Landing/TestimonialSection";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";
import { features, pricingPlans, testimonials } from "../assets/data";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
      {/* Features Section */}
      <FeaturesSection features={features} />
      {/* Pricing Sections */}
      <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />
      {/* Testimonial Sections */}
      <TestimonialSection testimonials={testimonials} />
      {/* CTA Sections */}
      <CTASection openSignUp={openSignUp} />
      {/* Footer Sections */}
      <Footer />
    </div>
  );
};

export default Landing;

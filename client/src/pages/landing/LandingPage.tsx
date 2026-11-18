import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { HeroBackground } from "../../components/landing/HeroBackground";
import { HeroVisual } from "../../components/landing/HeroVisual";
import { FeaturesSection } from "../../components/landing/FeaturesSection";
import { SecuritySection } from "../../components/landing/SecuritySection";
import { HowItWorksSection } from "../../components/landing/HowItWorksSection";
import { AboutSection } from "../../components/landing/AboutSection";
import { CTASection } from "../../components/landing/CTASection";
import { Footer } from "../../components/landing/Footer";

export function LandingPage() {
  return (
    <div
      id="home"
      className="min-h-screen bg-background text-foreground"
    >

      <main>

        <div className="relative isolate overflow-hidden">

          <HeroBackground />

          <Navbar />

          <Hero />

          <HeroVisual />

        </div>

        <FeaturesSection />

        <SecuritySection />

        <HowItWorksSection />

        <AboutSection />

        <CTASection />

      </main>

      <Footer />

    </div>
  );
}
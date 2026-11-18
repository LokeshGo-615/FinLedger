import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { HeroBackground } from "../../components/landing/HeroBackground";
import { HeroVisual } from "../../components/landing/HeroVisual";
import { FeaturesSection } from "../../components/landing/FeaturesSection";
import { SecuritySection } from "../../components/landing/SecuritySection";

export function LandingPage() {
  return (
    <main
      id="home"
      className="min-h-screen bg-background text-foreground"
    >

      {/* Hero section */}

      <div className="relative isolate overflow-hidden">
        <HeroBackground />
        <Navbar />
        <Hero />
        <HeroVisual />
      </div>

      {/* Features section */}

      <FeaturesSection />

      {/* Security section */}

      <SecuritySection />

    </main>
  );
}
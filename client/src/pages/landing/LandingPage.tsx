import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { HeroBackground } from "../../components/landing/HeroBackground";
import { HeroVisual } from "../../components/landing/HeroVisual";

export function LandingPage() {
  return (
    <main
      id="home"
      className="min-h-screen bg-background text-foreground"
    >
      <div className="relative isolate overflow-hidden">

        <HeroBackground />

        <Navbar />

        <Hero />

        <HeroVisual />

      </div>
    </main>
  );
}
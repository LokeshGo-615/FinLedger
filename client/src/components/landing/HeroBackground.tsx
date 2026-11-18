export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Vertical panels */}
      <div className="hero-panels absolute inset-0" />

      {/* Ambient glow */}
      <div className="hero-glow absolute inset-0" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
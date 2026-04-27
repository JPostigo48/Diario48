import Link from "next/link";
import FeatureCards from "./FeatureCards";
import HeroSection from "./HeroSection";
import LandingPreview from "./LandingPreview";

export default function LandingPage() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0b0e] text-[#e8eaf0]">
      <nav className="flex items-center justify-between border-b border-[#1e2130] bg-[#0a0b0e] px-7 py-3">
        <div className="font-mono text-[15px] font-bold tracking-[-0.5px] text-[#e8eaf0]">
          Diario<span className="text-[#4f8ef7]">48</span>
        </div>

        <div className="flex gap-6">
          <Link
            href="/tools/graphs"
            className="font-mono text-[12px] tracking-[0.5px] text-[#6b7280] transition-colors hover:text-[#e8eaf0]"
          >
            herramientas
          </Link>
          <span className="font-mono text-[12px] tracking-[0.5px] text-[#6b7280]">
            proyectos
          </span>
          <span className="font-mono text-[12px] tracking-[0.5px] text-[#6b7280]">
            laboratorio
          </span>
          <span className="font-mono text-[12px] tracking-[0.5px] text-[#6b7280]">
            sobre mí
          </span>
        </div>

        <span className="rounded-full border border-[#4f8ef744] bg-[#4f8ef710] px-2.5 py-1 font-mono text-[10px] tracking-[0.5px] text-[#4f8ef7]">
          v0.1 — alpha
        </span>
      </nav>

      <section className="grid flex-1 grid-cols-[1fr_380px] overflow-hidden">
        <div className="flex flex-col justify-between border-r border-[#1e2130] px-10 py-9">
          <HeroSection />
          <FeatureCards />
        </div>

        <LandingPreview />
      </section>

      <footer className="flex items-center justify-between border-t border-[#1e2130] px-7 py-2.5">
        <span className="font-mono text-[10px] tracking-[0.5px] text-[#2a3040]">
          diario48 · plataforma personal · 2025
        </span>

        <div className="flex items-center gap-2 font-mono text-[10px] text-[#22c55e]">
          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#22c55e]" />
          sistema activo
        </div>
      </footer>
    </main>
  );
}

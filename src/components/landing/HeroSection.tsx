import Link from "next/link";

export default function HeroSection() {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-[#4f8ef7]">
        — plataforma personal
      </div>

      <h1 className="mb-4 text-[52px] leading-none font-bold tracking-[-2px] text-[#f1f3f9]">
        Diario<span className="text-[#4f8ef7]">48</span>
      </h1>

      <p className="mb-7 max-w-[420px] text-[13px] leading-[1.7] font-light text-[#6b7280]">
        Plataforma personal de herramientas, proyectos y experimentos de
        computación. Algoritmos visualizados, estructuras exploradas, ideas
        documentadas.
      </p>

      <div className="flex gap-2.5">
        <Link
          href="/tools/graphs"
          className="rounded-md bg-[#4f8ef7] px-[18px] py-[9px] font-mono text-[11px] font-bold tracking-[0.5px] text-[#0a0b0e] transition-opacity hover:opacity-90"
        >
          explorar herramientas ↗
        </Link>

        <button className="rounded-md border border-[#2a2f3e] bg-transparent px-[18px] py-[9px] font-mono text-[11px] tracking-[0.5px] text-[#9ca3af] transition-all hover:border-[#4f8ef755] hover:text-[#e8eaf0]">
          ver proyectos
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";

const cards = [
  {
    title: "Visualizador de grafos",
    description: "BFS · DFS · A* · Greedy",
    tag: "activo",
    dotClass: "bg-[#4f8ef7] shadow-[0_0_6px_#4f8ef766]",
    href: "/tools/graphs",
  },
  {
    title: "Proyectos universitarios",
    description: "CC · IS · BD · SO",
    tag: "pronto",
    dotClass: "bg-[#22c55e] shadow-[0_0_6px_#22c55e66]",
    href: "#",
  },
  {
    title: "Laboratorio personal",
    description: "experimentos · ideas",
    tag: "pronto",
    dotClass: "bg-[#f59e0b] shadow-[0_0_6px_#f59e0b66]",
    href: "#",
  },
];

export default function FeatureCards() {
  return (
    <div>
      <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[1.5px] text-[#2a3040]">
        {"// módulos disponibles"}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="relative overflow-hidden rounded-[8px] border border-[#1e2130] bg-[#111318] px-3.5 py-3 transition-all hover:border-[#4f8ef744] hover:bg-[#13151e]"
          >
            <div className={`mb-2.5 h-1.5 w-1.5 rounded-full ${card.dotClass}`} />
            <div className="mb-1 text-[12px] font-semibold text-[#dde1ea]">
              {card.title}
            </div>
            <div className="font-mono text-[11px] leading-[1.5] text-[#4b5563]">
              {card.description}
            </div>
            <div className="absolute top-2.5 right-2.5 font-mono text-[9px] tracking-[0.5px] text-[#374151]">
              {card.tag}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

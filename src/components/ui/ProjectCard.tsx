import Link from 'next/link';
import StatusBadge from './StatusBadge';
import type { Project } from '@/lib/data/projects';

const dotColors: Record<string, string> = {
  educational: 'bg-[var(--acc)]',
  enterprise: 'bg-[var(--amber)]',
  university: 'bg-[var(--purple)]',
  personal: 'bg-[var(--green)]',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="bg-[var(--bg2)] border border-[var(--br)] rounded-[10px] p-[18px]
                 flex flex-col gap-2.5 transition-all duration-150 cursor-default
                 hover:border-[var(--acc3)] hover:bg-[var(--bg4)]"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0
                      ${dotColors[project.category]}`}
        />
        <StatusBadge status={project.status} />
      </div>

      <h3 className="text-[15px] font-semibold text-[var(--tx)]">{project.name}</h3>

      <p className="text-[12px] text-[var(--tx3)] leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] px-2 py-0.5 rounded
                       bg-[var(--bg3)] text-[var(--tx4)] border border-[var(--br)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.url && (
        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-[var(--acc)] inline-flex
                     items-center gap-1 hover:opacity-70 transition-opacity"
        >
          {project.url.replace('https://', '')} ↗
        </Link>
      )}
      {project.internalRoute && (
        <Link
          href={project.internalRoute}
          className="font-mono text-[11px] text-[var(--acc)] inline-flex
                     items-center gap-1 hover:opacity-70 transition-opacity"
        >
          abrir herramienta →
        </Link>
      )}
      {!project.url && !project.internalRoute && (
        <span className="font-mono text-[11px] text-[var(--tx4)] opacity-50">
          sin url pública
        </span>
      )}
    </div>
  );
}

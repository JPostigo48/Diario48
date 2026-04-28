import type { ProjectStatus } from '@/lib/data/projects';

const styles: Record<ProjectStatus, string> = {
  live: 'border-[var(--green)] text-[var(--green)] bg-[rgba(34,197,94,0.08)]',
  wip: 'border-[var(--amber)] text-[var(--amber)] bg-[rgba(245,158,11,0.08)]',
  soon: 'border-[var(--br2)] text-[var(--tx4)] bg-[var(--bg3)]',
};

const labels: Record<ProjectStatus, string> = {
  live: 'live',
  wip: 'en desarrollo',
  soon: 'próximamente',
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`font-mono text-[9px] px-2 py-0.5 rounded-[10px] border
                  tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

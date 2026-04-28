export type ProjectStatus = 'live' | 'wip' | 'soon';
export type ProjectCategory = 'educational' | 'enterprise' | 'university' | 'personal';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tags: string[];
  url?: string;
  internalRoute?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'ciencias',
    name: 'ciencias.edu.pe',
    description:
      'Plataforma educativa completa para el colegio Ciencias. Gestión académica, recursos y comunicación institucional.',
    status: 'live',
    category: 'educational',
    tags: ['educación', 'Next.js', 'MongoDB'],
    url: 'https://ciencias.edu.pe',
  },
  {
    id: 'nextlevel',
    name: 'nextlevel.edu.pe',
    description:
      'Plataforma educativa de siguiente nivel. Experiencia de aprendizaje moderna con enfoque en resultados y seguimiento.',
    status: 'live',
    category: 'educational',
    tags: ['educación', 'React', 'Node.js'],
    url: 'https://nextlevel.edu.pe',
  },
  {
    id: 'ferrap',
    name: 'Ferrap',
    description:
      'Aplicación web de gestión para Ferreiros. Sistema de administración, inventario y operaciones empresariales.',
    status: 'wip',
    category: 'enterprise',
    tags: ['empresa', 'React', 'TypeScript'],
  },
];

export const UNIVERSITY_PROJECTS: Project[] = [
  {
    id: 'graf-visualizer',
    name: 'Graf Visualizer',
    description:
      'Herramienta interactiva para visualizar algoritmos de grafos paso a paso: BFS, DFS, A*, Greedy y coloreo.',
    status: 'live',
    category: 'university',
    tags: ['BFS', 'A*', 'DFS', 'algoritmos'],
    internalRoute: '/tools/graphs',
  },
  {
    id: 'game',
    name: 'Juego',
    description:
      'Proyecto de videojuego desarrollado como parte del plan de estudios universitario.',
    status: 'soon',
    category: 'university',
    tags: ['en proceso'],
  },
  {
    id: 'geogebra',
    name: 'GeoGebra',
    description:
      'Proyecto interactivo de geometría y álgebra para visualización matemática universitaria.',
    status: 'soon',
    category: 'university',
    tags: ['matemáticas', 'geometría'],
  },
];

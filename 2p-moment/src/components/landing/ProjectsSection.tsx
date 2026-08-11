import type { ProjectCard } from "../../data/landing";

type Props = {
  projects: ProjectCard[];
};

/**
 * Split-screen rozcestník — každý projekt je celá klikatelná dlaždice
 * ve své značkové barvě (třída project--<id>). Na mobilu pod sebou,
 * na desktopu vedle sebe.
 */
export function ProjectsSection({ projects }: Props) {
  return (
    <nav className="projects" aria-label="Projekty 2P Moment">
      {projects.map((p) => (
        <a
          key={p.id}
          className={`project project--${p.id}`}
          href={p.href}
        >
          <span className="project__monogram" aria-hidden="true">
            {p.name.charAt(0)}
          </span>

          <span className="project__logo">
            {p.logo ? (
              <img src={p.logo} alt={p.name} loading="lazy" />
            ) : (
              <span className="project__logo-text" aria-hidden="true">
                {p.logoText}
              </span>
            )}
          </span>

          <span className="project__body">
            <span className="project__location">{p.location}</span>
            <span className="project__name">{p.name}</span>
            <span className="project__descriptor">{p.descriptor}</span>
          </span>

          <span className="project__cta">
            {p.cta}
            <svg
              className="project__arrow"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      ))}
    </nav>
  );
}

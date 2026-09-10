import type { GrantsContent, Project } from "../types/content";
import { getPrimaryProjectImage } from "../utils/projectImages";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

type GrantsSectionProps = {
  content: GrantsContent;
  onProjectOpen: (project: Project) => void;
};

/**
 * Dotační programy – karty s náhledem dokumentu (publicita, certifikace).
 * Sdílí datový model i detail (ProjectModal) s referencemi, liší se jen
 * layoutem karty: dokument je na výšku a zobrazuje se celý, bez ořezu.
 */
export function GrantsSection({ content, onProjectOpen }: GrantsSectionProps) {
  const items = content.items
    .filter((project) => !project.hidden)
    .map((project) => ({ project, primaryImage: getPrimaryProjectImage(project) }))
    .filter(({ primaryImage }) => Boolean(primaryImage?.src));

  if (items.length === 0) return null;

  return (
    <section className="grants" id="dotacni-programy">
      <div className="container">
        <div className="grants-header">
          <div>
            <SectionHeading
              label={content.label}
              title={content.title}
              titleAccent={content.titleAccent}
            />
          </div>
          <p className="section-desc reveal">{content.description}</p>
        </div>
        <div className="grants-grid">
          {items.map(({ project, primaryImage }) => (
            <button
              type="button"
              className="grant-card reveal"
              key={project.slug}
              onClick={() => onProjectOpen(project)}
            >
              <span className="grant-card-media">
                <img
                  src={primaryImage?.src}
                  alt={primaryImage?.alt || project.title}
                  className="grant-card-img"
                  loading="lazy"
                />
              </span>
              <span className="grant-card-body">
                <span className="project-cat static">{project.category}</span>
                <h3 className="grant-card-title">{project.title}</h3>
                {project.location ? (
                  <span className="grant-card-meta">{project.location}</span>
                ) : null}
              </span>
              <span className="project-arrow">
                <Icon name="arrow-right" size={16} strokeWidth={2.5} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

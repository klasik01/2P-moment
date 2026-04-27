import type { Project, ProjectsContent } from "../types/content";
import { getPrimaryProjectImage } from "../utils/projectImages";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

type ProjectsSectionProps = {
  content: ProjectsContent;
  onProjectOpen: (project: Project) => void;
};

export function ProjectsSection({ content, onProjectOpen }: ProjectsSectionProps) {
  return (
    <section className="projects" id="reference">
      <div className="container">
        <div className="projects-header">
          <div>
            <SectionHeading
              label={content.label}
              title={content.title}
              titleAccent={content.titleAccent}
              light
            />
          </div>
          <p className="section-desc reveal is-light">{content.description}</p>
        </div>
        <div className="projects-grid">
          {content.items
            .filter((project) => !project.hidden)
            .map((project) => ({
              project,
              primaryImage: getPrimaryProjectImage(project),
            }))
            .filter(({ primaryImage }) => Boolean(primaryImage?.src))
            .map(({ project, primaryImage }, index) => (
            <button
              type="button"
              className={`project-card reveal ${index === 0 ? "is-featured" : ""}`}
              key={project.slug}
              onClick={() => onProjectOpen(project)}
            >
              <img
                src={primaryImage?.src}
                alt={primaryImage?.alt || project.title}
                className="project-img"
                loading="lazy"
              />
              <div className="project-overlay">
                <span className="project-cat">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
              </div>
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

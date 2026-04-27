import { useEffect, useState } from "react";
import { t } from "../i18n";
import type { Project } from "../types/content";
import { getVisibleProjectImages } from "../utils/projectImages";
import { Icon } from "./Icon";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleImages = project ? getVisibleProjectImages(project) : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % visibleImages.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + visibleImages.length) % visibleImages.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project, visibleImages.length]);

  if (!project) return null;

  if (visibleImages.length === 0 || !visibleImages[activeIndex]) {
    return null;
  }

  const activeImage = visibleImages[activeIndex];

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div className="project-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label={t("modal.close")}
        >
          <Icon name="close" size={24} />
        </button>
        <div className="project-modal-media">
          <img
            src={activeImage.src}
            alt={activeImage.alt || project.title}
            className="project-modal-image"
          />
          {visibleImages.length > 1 ? (
            <>
              <button
                type="button"
                className="modal-nav prev"
                onClick={() =>
                  setActiveIndex((current) => (current - 1 + visibleImages.length) % visibleImages.length)
                }
                aria-label={t("modal.prev")}
              >
                <Icon name="chevron-left" size={24} />
              </button>
              <button
                type="button"
                className="modal-nav next"
                onClick={() => setActiveIndex((current) => (current + 1) % visibleImages.length)}
                aria-label={t("modal.next")}
              >
                <Icon name="chevron-right" size={24} />
              </button>
            </>
          ) : null}
        </div>
        <div className="project-modal-body">
          <span className="project-cat static">{project.category}</span>
          <h3 className="project-modal-title">{project.title}</h3>
          {project.location ? <p className="project-modal-location">{project.location}</p> : null}
          <p className="project-modal-summary">{project.summary}</p>
          <div className="project-thumbs">
            {visibleImages.map((image, index) => (
              <button
                type="button"
                className={`project-thumb ${index === activeIndex ? "active" : ""}`}
                key={image.src}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image.src} alt={image.alt || project.title} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

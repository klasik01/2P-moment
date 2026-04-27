import type { DiaryContent } from "../types/content";
import { Icon } from "./Icon";

export function DiarySection({ content }: { content: DiaryContent }) {
  return (
    <section className="diary reveal">
      <div className="container">
        <div className="diary-inner">
          <div className="diary-icon">
            <Icon name="shield" size={40} strokeWidth={1.5} />
          </div>
          <div className="diary-content">
            <span className="section-label">{content.label}</span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </div>
          <div className="diary-cta">
            <a href={content.action.href} className="btn btn-white">
              {content.action.label}
              <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

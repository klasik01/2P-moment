import type { AboutContent } from "../types/content";
import { t } from "../i18n";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

export function AboutSection({ content }: { content: AboutContent }) {
  return (
    <section className="about" id="o-nas">
      <div className="container">
        <div className="about-inner">
          <div className="about-visual reveal">
            <img src={content.mainImage} alt={t("about.mainImageAlt")} className="about-img-main" />
            <img src={content.accentImage} alt={t("about.accentImageAlt")} className="about-img-accent" />
            <div className="about-badge">
              <div className="about-badge-num">{content.badgeValue}</div>
              <div className="about-badge-text">{content.badgeText}</div>
            </div>
          </div>
          <div className="about-content reveal">
            <SectionHeading
              label={content.label}
              title={content.title}
              titleAccent={content.titleAccent}
            />
            {content.paragraphs.map((paragraph) => (
              <p className="about-text" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className="about-features">
              {content.features.map((feature) => (
                <div className="about-feature" key={feature}>
                  <div className="about-feature-icon">
                    <Icon name="check" size={14} strokeWidth={3} />
                  </div>
                  <span className="about-feature-text">{feature}</span>
                </div>
              ))}
            </div>
            <div className="about-cta">
              <a href={content.action.href} className="btn btn-primary">
                {content.action.label}
                <Icon name="arrow-right" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

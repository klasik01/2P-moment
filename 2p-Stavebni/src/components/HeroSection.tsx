import { useEffect, useMemo, useRef, useState } from "react";
import { t } from "../i18n";
import type { HeroContent } from "../types/content";
import { Icon } from "./Icon";

type HeroSectionProps = {
  content: HeroContent;
  backgroundImages?: string[];
};

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let animationFrame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        const totalFrames = 100;
        const step = () => {
          frame += 1;
          const progress = Math.min(frame / totalFrames, 1);
          setCount(Math.floor(value * progress));
          if (progress < 1) {
            animationFrame = window.requestAnimationFrame(step);
          }
        };

        animationFrame = window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <div className="hero-stat-num" ref={ref}>
      {count}
      {count >= value ? suffix : ""}
    </div>
  );
}

export function HeroSection({ content, backgroundImages = [] }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const [activeBackgroundIndex, setActiveBackgroundIndex] = useState(0);
  const heroImages = useMemo(
    () => (backgroundImages.length > 0 ? backgroundImages : [content.backgroundImage]),
    [backgroundImages, content.backgroundImage],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setActiveBackgroundIndex(0);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveBackgroundIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroImages]);

  return (
    <section className="hero" id="uvod">
      <div className="hero-bg-stack" aria-hidden="true">
        {heroImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`hero-bg ${loaded ? "loaded" : ""} ${
              index === activeBackgroundIndex ? "is-active" : ""
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-accent" />
      <div className="container">
        <div className="hero-content">
          {content.brandLogo ? (
            <div className="hero-brand">
              <img
                src={content.brandLogo}
                alt={t("hero.logoAlt")}
                className="hero-brand-logo"
              />
            </div>
          ) : null}
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span>{content.eyebrow}</span>
          </div>
          <h1>
            {content.title}
            <br />
            <em>{content.titleAccent}</em>
          </h1>
          <p className="hero-desc">{content.description}</p>
          <div className="hero-actions">
            <a href={content.primaryAction.href} className="btn btn-primary">
              <Icon name="grid" size={18} />
              {content.primaryAction.label}
            </a>
            <a href={content.secondaryAction.href} className="btn btn-outline">
              <Icon name="phone" size={18} />
              {content.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <Icon name="scroll" size={20} />
      </div>
    </section>
  );
}

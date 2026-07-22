import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Kotva pro odkazy z menu a CTA. */
  id?: string;
  /** Teplejší podklad — pro odlišení sousedních sekcí. */
  muted?: boolean;
  className?: string;
  labelledBy?: string;
};

/**
 * Obal sekce — drží svislý rytmus a kontejner.
 * Odsazení se mění v styles/components/_section.scss.
 */
export function Section({
  children,
  id,
  muted = false,
  className = "",
  labelledBy,
}: SectionProps) {
  const classes = ["section", muted ? "section--muted" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} id={id} aria-labelledby={labelledBy}>
      <div className="container">{children}</div>
    </section>
  );
}

type SectionHeadProps = {
  eyebrow?: string;
  title: string;
  titleId?: string;
  /** Odstavce pod nadpisem. */
  paragraphs?: string[];
  center?: boolean;
  /** Nadpis stránky se sází jako h1, sekce uvnitř jako h2. */
  as?: "h1" | "h2";
};

/** Hlavička sekce — eyebrow, nadpis, odstavce. */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  paragraphs = [],
  center = false,
  as: Heading = "h2",
}: SectionHeadProps) {
  return (
    <header className={`section-head reveal${center ? " section-head--center" : ""}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Heading id={titleId} className="title">{title}</Heading>
      {paragraphs.map((p) => (
        <p key={p} className="prose">{p}</p>
      ))}
    </header>
  );
}

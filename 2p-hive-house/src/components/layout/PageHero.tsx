import type { ReactNode } from "react";
import { asset } from "../../utils/asset";

export type PageHeroData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lead: string;
  image: string;
  imageAlt: string;
};

type Props = {
  data: PageHeroData;
  titleId?: string;
  /** Volitelné akční tlačítka pod leadem (např. CTA). */
  actions?: ReactNode;
};

/**
 * Sdílená šablona hero sekce pro podstránky (Rezervace / Rybaření / Kontakt).
 * Full-bleed obrázek na pozadí + diagonální tmavý overlay + bílý display
 * nadpis s medovým akcentem, v duchu hero na homepage.
 *
 * Používá sdílené CSS třídy `.page-hero-*` — všechny tři stránky tak mají
 * identické rozměry i typografii.
 */
export function PageHero({ data, titleId, actions }: Props) {
  return (
    <div className="page-hero">
      <div
        className="page-hero-bg"
        style={{ backgroundImage: `url(${asset(data.image)})` }}
        role="img"
        aria-label={data.imageAlt}
      />
      <div className="page-hero-overlay" aria-hidden="true" />

      <div className="container">
        <div className="page-hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span>{data.eyebrow}</span>
          </div>
          <h1 id={titleId}>
            <span className="hero-word hero-word-1">{data.title}</span>{" "}
            <span className="hero-word hero-word-2">{data.titleAccent}</span>
          </h1>
          <p className="page-hero-lead">{data.lead}</p>
          {actions && <div className="page-hero-actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import type { ReservationData } from "../../types";
import { PageHero } from "../layout/PageHero";

type Props = {
  data: ReservationData;
};

/**
 * Obsahový blok stránky REZERVACE.
 *
 * Struktura: sdílený <PageHero /> + pod ním panel s embed kódem
 * rezervačního systému třetí strany.
 *
 * Embed se vkládá přes dangerouslySetInnerHTML; případné <script> tagy
 * se po vložení re-inicializují, aby se widget spustil.
 */
export function ReservationSection({ data }: Props) {
  const embedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = embedRef.current;
    if (!root) return;
    // Pokud nejsou žádné skripty, nic neřeš — ušetří to i runtime chyby
    // u embedů, které obsahují třeba jen <iframe>.
    const scripts = Array.from(root.querySelectorAll("script"));
    if (scripts.length === 0) return;

    scripts.forEach((oldScript) => {
      try {
        const s = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          s.setAttribute(attr.name, attr.value);
        });
        // Inline skripty převezmou obsah, externí jen src atribut.
        if (oldScript.textContent) s.appendChild(document.createTextNode(oldScript.textContent));
        oldScript.parentNode?.replaceChild(s, oldScript);
      } catch (err) {
        // Chybný embed kód nesmí shodit stránku — jen logneme do konzole.
        console.warn("[Reservation] embed script failed to load:", err);
      }
    });
  }, [data.embedHtml]);

  return (
    <section className="reservation-page" aria-labelledby="reservation-title">
      <PageHero
        titleId="reservation-title"
        data={{
          eyebrow: data.eyebrow,
          title: data.title,
          titleAccent: data.titleAccent,
          lead: data.text,
          image: data.image,
          imageAlt: data.imageAlt,
        }}
      />

      <div className="container">
        <div className="reservation-embed-wrap">
          <div
            ref={embedRef}
            className="reservation-embed"
            dangerouslySetInnerHTML={{ __html: data.embedHtml }}
          />
        </div>
      </div>
    </section>
  );
}

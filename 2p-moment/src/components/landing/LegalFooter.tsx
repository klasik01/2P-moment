import type { LandingContact } from "../../data/landing";

type Props = {
  data: LandingContact;
};

export function LegalFooter({ data }: Props) {
  const year = new Date().getFullYear();
  const telHref = `tel:${data.phone.replace(/\s/g, "")}`;

  return (
    <footer className="legal" role="contentinfo">
      <div className="legal__inner">
        <div className="legal__col">
          <h2 className="legal__heading">{data.heading}</h2>
          <ul className="legal__list">
            <li><a href={`mailto:${data.email}`}>{data.email}</a></li>
            <li><a href={telHref}>{data.phone}</a></li>
          </ul>
        </div>

        <div className="legal__col">
          <h2 className="legal__heading">{data.legalHeading}</h2>
          <ul className="legal__list">
            <li>{data.company}</li>
            <li>IČO: {data.ico}</li>
            <li>DIČ: {data.dic}</li>
            <li>Datová schránka: {data.dataBox}</li>
          </ul>
        </div>

        <div className="legal__col">
          <h2 className="legal__heading">Sídlo</h2>
          <ul className="legal__list">
            {data.addressLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="legal__bottom">
        <span>© {year} {data.company}</span>
        <span className="legal__note">{data.note}</span>
      </div>
    </footer>
  );
}

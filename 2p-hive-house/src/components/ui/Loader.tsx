import type { T } from "../../i18n";
import { asset } from "../../utils/asset";

export function Loader({ t }: { t: T }) {
  return (
    <div className="boot-splash" role="status" aria-live="polite">
      <img
        src={asset("/logo.png")}
        alt={t.nav.brandAlt}
        className="boot-splash-logo"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div className="boot-splash-spinner" aria-hidden="true" />
      <span className="visually-hidden">{t.common.loading}</span>
    </div>
  );
}

import type { AppId } from "../types";

type Props = {
  onSelect: (app: AppId) => void;
};

const APPS: { id: AppId; icon: string; name: string; desc: string }[] = [
  {
    id: "hive-house",
    icon: "🐝",
    name: "2P Hive House",
    desc: "Glamping ubytování — sezonní akce, povolenky, poukázky, statistiky",
  },
  {
    id: "stavebni",
    icon: "🏗️",
    name: "2P Stavební",
    desc: "Stavební firma — projekty, galerie, promo akce, tým",
  },
];

export function AppSelector({ onSelect }: Props) {
  return (
    <div className="app-selector">
      <div className="app-selector-inner">
        <div className="brand">
          <span className="hex">⬡</span>
          2P Moment
        </div>
        <div className="brand-sub">Administrační systém</div>

        <h2>Vyberte aplikaci ke správě:</h2>

        <div className="app-selector-apps">
          {APPS.map((app) => (
            <button
              key={app.id}
              className="app-selector-app"
              onClick={() => onSelect(app.id)}
            >
              <span className="app-icon">{app.icon}</span>
              <div className="app-info">
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
              </div>
              <span className="app-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

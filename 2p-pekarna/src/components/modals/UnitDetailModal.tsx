import type { UnitItem } from "../../types";
import type { Translations } from "../../i18n";
import { media } from "../../services/media";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Gallery } from "../ui/Gallery";
import { Icon } from "../ui/Icon";

type Props = {
  unit: UnitItem;
  t: Translations;
  onClose: () => void;
};

/** Detail bytu — popis, vybavení a galerie. */
export function UnitDetailModal({ unit, t, onClose }: Props) {
  const cover = media.getImage(unit.imageId);
  const gallery = unit.albumId ? media.getAlbum(unit.albumId) : [];
  const titleId = `unit-${unit.id}-title`;

  return (
    <Modal onClose={onClose} closeLabel={t.common.close} labelledBy={titleId}>
      {cover ? (
        <div className="modal__media">
          <img src={cover.url} alt={cover.alt} />
        </div>
      ) : null}

      <div className="modal__body">
        <span className="modal__badge">{unit.badge}</span>
        <h2 id={titleId} className="modal__title">{unit.name ?? unit.badge}</h2>

        {unit.description ? <p className="prose">{unit.description}</p> : null}

        <h3 className="modal__section-title">{t.unit.equipmentTitle}</h3>
        {unit.equipment?.length ? (
          <ul className="modal__specs" role="list">
            {unit.equipment.map((spec) => (
              <li key={spec.label}>
                <Icon name={spec.icon} size={18} />
                <span>{spec.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          // Zadání klienta vybavení jednotlivých bytů neuvádí.
          // Než ho dodá, radši přiznáme neznalost, než abychom si vymýšleli.
          <p className="prose">{t.unit.equipmentMissing}</p>
        )}

        {gallery.length > 0 ? (
          <>
            <h3 className="modal__section-title">{t.unit.galleryTitle}</h3>
            <Gallery images={gallery} t={t} variant="strip" animate={false} />
          </>
        ) : null}

        <div className="btn-group modal__actions">
          <Button href="/rezervace" onClick={onClose}>
            {t.unit.reserveCta}
          </Button>
          <Button href="/kontakt?typ=ubytovani" variant="ghost" onClick={onClose}>
            {t.unit.askCta}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { useCallback, useRef, useState } from "react";
import type { Translations } from "../../i18n";
import { asset } from "../../utils/asset";
import { Icon } from "../ui/Icon";
import { useModalOpen } from "../../hooks/useModalOpen";

type Props = {
  /** Cesta k videu (public/). */
  src: string;
  t: Translations;
  onClose: () => void;
};

// Musí sedět s délkou slide-up animace v _intro-video.scss.
const CLOSE_MS = 500;

/**
 * Uvítací video jako záclona sjíždějící shora. Video běží automaticky,
 * bez ovládání (nejde stopnout ani přetáčet). Po dohrání se záclona
 * sama vysune nahoru a pokračuje aplikace; křížkem jde zavřít dřív.
 *
 * Autoplay se zvukem prohlížeče blokují, takže video startuje ztlumené
 * a nabízí tlačítko „Zapnout zvuk".
 */
export function IntroVideoModal({ src, t, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [closing, setClosing] = useState(false);

  // Zavření spustí slide-up a teprve po dojetí odmontuje.
  const close = useCallback(() => {
    setClosing((already) => {
      if (already) return already;
      window.setTimeout(onClose, CLOSE_MS);
      return true;
    });
  }, [onClose]);

  useModalOpen(true, close);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => { /* uživatel spustí ručně */ });
  };

  return (
    <div
      className={`intro-video${closing ? " intro-video--closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.intro.label}
    >
      <div className="intro-video__panel">
        <button
          type="button"
          className="intro-video__close"
          onClick={close}
          aria-label={t.common.close}
        >
          <Icon name="close" size={22} />
        </button>

        <video
          ref={videoRef}
          className="intro-video__player"
          src={asset(src)}
          autoPlay
          muted
          playsInline
          onEnded={close}
        />

        <button
          type="button"
          className="intro-video__sound"
          onClick={toggleSound}
          aria-pressed={!muted}
        >
          {muted ? t.intro.unmute : t.intro.mute}
        </button>
      </div>
    </div>
  );
}

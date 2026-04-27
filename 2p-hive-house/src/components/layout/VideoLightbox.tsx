import { useEffect } from "react";
import { asset } from "../../utils/asset";

/**
 * Znovupoužitelný fullscreen lightbox pro přehrání jednoho videa.
 * Zavírá se kliknutím na pozadí / ESC / tlačítkem.
 */
type Props = {
  url: string;
  title?: string;
  closeLabel: string;
  onClose: () => void;
};

export function VideoLightbox({ url, title, closeLabel, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const isMp4 = /\.mp4($|\?)/i.test(url);
  const src = isMp4
    ? asset(url)
    : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;

  return (
    <div
      className="video-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <button className="video-lightbox-close" onClick={onClose} aria-label={closeLabel}>✕</button>
      <div className="video-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        {isMp4 ? (
          <video controls autoPlay>
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <iframe
            src={src}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

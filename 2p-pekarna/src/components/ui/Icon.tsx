type Props = {
  name: string;
  className?: string;
  size?: number;
};

/**
 * Placeholder Icon komponent — bude rozšířen o SVG sprite.
 */
export function Icon({ name, className = "", size = 24 }: Props) {
  return (
    <span
      className={`icon icon-${name} ${className}`}
      style={{ width: size, height: size, display: "inline-block" }}
      aria-hidden="true"
    />
  );
}

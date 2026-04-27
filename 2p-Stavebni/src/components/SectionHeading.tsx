type SectionHeadingProps = {
  label: string;
  title: string;
  titleAccent: string;
  description?: string;
  light?: boolean;
};

export function SectionHeading({
  label,
  title,
  titleAccent,
  description,
  light = false,
}: SectionHeadingProps) {
  return (
    <>
      <span className="section-label reveal">{label}</span>
      <h2 className={`section-title reveal ${light ? "is-light" : ""}`}>
        {title} <span>{titleAccent}</span>
      </h2>
      {description ? (
        <p className={`section-desc reveal ${light ? "is-light" : ""}`}>{description}</p>
      ) : null}
    </>
  );
}

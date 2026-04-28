import type { T } from "../../i18n";

type Props = { t: T };

export function Loader({ t }: Props) {
  return (
    <div className="loader">
      <p>{t.common.loading}</p>
    </div>
  );
}

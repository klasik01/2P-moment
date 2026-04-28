import type { HomepageData } from "../types";

type Props = {
  data: HomepageData;
};

export function ReservationPage({ data: _data }: Props) {
  return (
    <section className="page-reservation">
      <div className="page-reservation__inner">
        <h1>Rezervace</h1>
        <p>Rezervační systém bude brzy k dispozici.</p>
      </div>
    </section>
  );
}

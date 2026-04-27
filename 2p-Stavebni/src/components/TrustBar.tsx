import type { TrustItem } from "../types/content";
import { Icon } from "./Icon";

export function TrustBar({ items }: { items: TrustItem[] }) {
  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-bar-inner">
          {items.map((item) => (
            <div className="trust-item" key={item.text}>
              <Icon name="check" size={20} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

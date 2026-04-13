import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { AdminSection, FishingPermit, GiftVoucher, Promotion } from "../types";
import {
  deletePromotion,
  loadPermits,
  loadVouchers,
  newPromotion,
  savePromotion,
  subscribePromotions,
  updatePermitStatus,
  updateVoucherStatus,
} from "../utils/firestore";

type Props = {
  userEmail: string;
  onBack: () => void;
};

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({
  section,
  onSection,
  userEmail,
  onBack,
  open,
  onClose,
}: {
  section: AdminSection;
  onSection: (s: AdminSection) => void;
  userEmail: string;
  onBack: () => void;
  open: boolean;
  onClose: () => void;
}) {
  const navItems: { id: AdminSection; label: string; icon: string }[] = [
    { id: "dashboard", label: "Přehled", icon: "📊" },
    { id: "promotions", label: "Sezonní akce", icon: "🎁" },
    { id: "vouchers", label: "Poukázky", icon: "🎫" },
    { id: "permits", label: "Rybářské povolenky", icon: "🎣" },
    { id: "statistics", label: "Statistiky", icon: "📈" },
  ];

  return (
    <>
      <div className={`sidebar-overlay${open ? " show" : ""}`} onClick={onClose} />
      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="brand">
            <span className="hex">⬡</span>
            2P Moment
          </div>
          <div className="brand-sub">Administrace</div>
        </div>
        <div className="admin-sidebar-app-badge">🐝 Hive House</div>

        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-nav-section">Hive House</div>
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="admin-sidebar-nav-item">
                <button
                  className={section === item.id ? "active" : ""}
                  onClick={() => { onSection(item.id); onClose(); }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="admin-sidebar-nav-section" style={{ marginTop: "16px" }}>Systém</div>
          <ul>
            <li className="admin-sidebar-nav-item">
              <button onClick={() => { onBack(); onClose(); }}>
                <span className="nav-icon">🔄</span>
                Jiná aplikace
              </button>
            </li>
            <li className="admin-sidebar-nav-item">
              <button onClick={() => signOut(auth)}>
                <span className="nav-icon">🚪</span>
                Odhlásit se
              </button>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="user-info">{userEmail}</div>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────
function Dashboard({
  promotions,
  permits,
  vouchers,
}: {
  promotions: Promotion[];
  permits: FishingPermit[];
  vouchers: GiftVoucher[];
}) {
  const paidPermits = permits.filter((p) => p.status === "paid");
  const paidVouchers = vouchers.filter((v) => v.status === "paid" || v.status === "used");
  const totalRevenue =
    paidPermits.reduce((s, p) => s + p.pricePaid, 0) +
    paidVouchers.reduce((s, v) => s + v.pricePaid, 0);
  const activePromos = promotions.filter((p) => p.enabled);

  return (
    <div>
      <div className="page-title">Přehled</div>
      <div className="page-desc">Aktuální stav 2P Hive House</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Celkové tržby</div>
          <div className="stat-card-value">{totalRevenue.toLocaleString("cs-CZ")}</div>
          <div className="stat-card-sub">Kč</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Aktivní akce</div>
          <div className="stat-card-value">{activePromos.length}</div>
          <div className="stat-card-sub">sezonních akcí</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Poukázky</div>
          <div className="stat-card-value">{paidVouchers.length}</div>
          <div className="stat-card-sub">prodáno</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Povolenky</div>
          <div className="stat-card-value">{paidPermits.length}</div>
          <div className="stat-card-sub">vydáno</div>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
          Poslední povolenky
        </div>
        {permits.slice(0, 5).map((p) => (
          <div key={p.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: "var(--dark-2)",
            borderRadius: "8px",
            marginBottom: "8px",
            fontSize: "13px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{p.name} — {p.date}</span>
            <span className={`status-badge status-badge-${p.status}`}>{p.status}</span>
          </div>
        ))}
        {permits.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Žádné povolenky zatím.</div>
        )}
      </div>
    </div>
  );
}

// ─── Promotions Editor ─────────────────────────────────────────────────────
function PromotionsEditor({ promotions }: { promotions: Promotion[] }) {
  const [editors, setEditors] = useState<Promotion[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditors((prev) => {
      const editingIds = new Set(prev.filter((e) => JSON.stringify(e) !== JSON.stringify(promotions.find((p) => p.id === e.id))).map((e) => e.id));
      return promotions.map((p) => (editingIds.has(p.id) ? (prev.find((e) => e.id === p.id) ?? p) : p));
    });
  }, [promotions]);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSave = async (promo: Promotion) => {
    setSaving(promo.id);
    try {
      await savePromotion(promo);
      showNotice("success", "Akce uložena.");
    } catch {
      showNotice("error", "Chyba při ukládání.");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat tuto akci?")) return;
    try {
      await deletePromotion(id);
      showNotice("success", "Akce smazána.");
    } catch {
      showNotice("error", "Chyba při mazání.");
    }
  };

  const update = (id: string, patch: Partial<Promotion>) => {
    setEditors((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const addNew = async () => {
    const p = newPromotion();
    await savePromotion(p);
    setCollapsed((c) => { const next = new Set(c); next.delete(p.id); return next; });
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((c) => {
      const next = new Set(c);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Sezonní akce</div>
          <div className="page-desc">Vyskakovací okna s akcemi pro hosty.</div>
        </div>
        <button className="btn btn-primary" onClick={addNew}>+ Nová akce</button>
      </div>

      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

      {editors.length === 0 && (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", padding: "32px 0" }}>
          Žádné akce. Přidejte první kliknutím na "Nová akce".
        </div>
      )}

      {editors.map((p) => {
        const isCollapsed = collapsed.has(p.id);
        const orig = promotions.find((o) => o.id === p.id);
        const isDirty = JSON.stringify(p) !== JSON.stringify(orig);

        return (
          <div key={p.id} className={`admin-card${isCollapsed ? " collapsed" : ""}`}>
            <div className="admin-card-header" onClick={() => toggleCollapse(p.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: p.enabled ? "var(--honey)" : "rgba(255,255,255,0.2)",
                    flexShrink: 0,
                  }}
                />
                <h3>{p.title || "(bez názvu)"}</h3>
                {isDirty && <span style={{ fontSize: "11px", color: "var(--honey)", letterSpacing: "0.5px" }}>● Neuloženo</span>}
              </div>
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSave(p)}
                  disabled={saving === p.id || !isDirty}
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  {saving === p.id ? "Ukládám..." : "Uložit"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(p.id)}
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  Smazat
                </button>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: "row", marginBottom: "16px" }}>
                <label className="form-checkbox" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={(e) => update(p.id, { enabled: e.target.checked })}
                  />
                  <span>Zobrazit na webu</span>
                </label>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Badge (štítek)</label>
                  <input
                    value={p.badge}
                    onChange={(e) => update(p.id, { badge: e.target.value })}
                    placeholder="Jarní akce"
                  />
                </div>
                <div className="form-group">
                  <label>Název akce</label>
                  <input
                    value={p.title}
                    onChange={(e) => update(p.id, { title: e.target.value })}
                    placeholder="Sleva 20 % na víkend"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Popis</label>
                <textarea
                  value={p.text}
                  onChange={(e) => update(p.id, { text: e.target.value })}
                  placeholder="Popis akce pro hosty..."
                  rows={2}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Text tlačítka</label>
                  <input
                    value={p.ctaLabel}
                    onChange={(e) => update(p.id, { ctaLabel: e.target.value })}
                    placeholder="Rezervovat"
                  />
                </div>
                <div className="form-group">
                  <label>Odkaz tlačítka</label>
                  <input
                    value={p.ctaHref}
                    onChange={(e) => update(p.id, { ctaHref: e.target.value })}
                    placeholder="#rezervace"
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Platí od (nepovinné)</label>
                  <input
                    type="date"
                    value={p.startsAt ?? ""}
                    onChange={(e) => update(p.id, { startsAt: e.target.value || undefined })}
                  />
                </div>
                <div className="form-group">
                  <label>Platí do (nepovinné)</label>
                  <input
                    type="date"
                    value={p.endsAt ?? ""}
                    onChange={(e) => update(p.id, { endsAt: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Permits Manager ───────────────────────────────────────────────────────
function PermitsManager() {
  const [permits, setPermits] = useState<FishingPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadPermits()
      .then(setPermits)
      .finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const changeStatus = async (id: string, status: FishingPermit["status"]) => {
    try {
      await updatePermitStatus(id, status);
      setPermits((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
      showNotice("success", "Status aktualizován.");
    } catch {
      showNotice("error", "Chyba při aktualizaci.");
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-title">Rybářské povolenky</div>
      <div className="page-desc">Správa vydaných rybářských povolenek.</div>

      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Jméno</th>
              <th>E-mail</th>
              <th>Osob</th>
              <th>Sleva</th>
              <th>Cena</th>
              <th>Status</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {permits.length === 0 ? (
              <tr><td colSpan={8} style={{ color: "rgba(255,255,255,0.3)" }}>Žádné záznamy.</td></tr>
            ) : (
              permits.map((p) => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.persons}</td>
                  <td>
                    {p.isHojanoviceChild ? "🧒 Dítě" : p.isFirefighter ? "🚒 Hasič" : "—"}
                  </td>
                  <td>{p.pricePaid === 0 ? "ZDARMA" : `${p.pricePaid} Kč`}</td>
                  <td><span className={`status-badge status-badge-${p.status}`}>{p.status}</span></td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => changeStatus(p.id, e.target.value as FishingPermit["status"])}
                      style={{
                        background: "var(--dark-3)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Vouchers Manager ─────────────────────────────────────────────────────
function VouchersManager() {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadVouchers()
      .then(setVouchers)
      .finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const changeStatus = async (id: string, status: GiftVoucher["status"]) => {
    try {
      await updateVoucherStatus(id, status);
      setVouchers((vs) => vs.map((v) => (v.id === id ? { ...v, status } : v)));
      showNotice("success", "Status aktualizován.");
    } catch {
      showNotice("error", "Chyba při aktualizaci.");
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-title">Dárkové poukázky</div>
      <div className="page-desc">Správa prodaných dárkových poukázek.</div>

      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kód</th>
              <th>Příjemce</th>
              <th>Odesílatel</th>
              <th>Noci</th>
              <th>Cena</th>
              <th>Platí do</th>
              <th>Status</th>
              <th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr><td colSpan={8} style={{ color: "rgba(255,255,255,0.3)" }}>Žádné záznamy.</td></tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontFamily: "monospace", color: "var(--honey)", fontSize: "12px" }}>{v.code}</td>
                  <td>
                    <div>{v.recipientName}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{v.recipientEmail}</div>
                  </td>
                  <td>
                    <div>{v.senderName}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{v.senderEmail}</div>
                  </td>
                  <td>{v.nights}</td>
                  <td>{v.pricePaid.toLocaleString("cs-CZ")} Kč</td>
                  <td>{v.validUntil}</td>
                  <td><span className={`status-badge status-badge-${v.status}`}>{v.status}</span></td>
                  <td>
                    <select
                      value={v.status}
                      onChange={(e) => changeStatus(v.id, e.target.value as GiftVoucher["status"])}
                      style={{
                        background: "var(--dark-3)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="used">used</option>
                      <option value="expired">expired</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Statistics ───────────────────────────────────────────────────────────
function Statistics({
  permits,
  vouchers,
}: {
  permits: FishingPermit[];
  vouchers: GiftVoucher[];
}) {
  const permitsRevenue = permits.filter((p) => p.status === "paid").reduce((s, p) => s + p.pricePaid, 0);
  const vouchersRevenue = vouchers.filter((v) => v.status === "paid" || v.status === "used").reduce((s, v) => s + v.pricePaid, 0);
  const totalRevenue = permitsRevenue + vouchersRevenue;

  const byMonth: Record<string, { permits: number; vouchers: number; revenue: number }> = {};

  permits.forEach((p) => {
    const month = p.createdAt.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = { permits: 0, vouchers: 0, revenue: 0 };
    byMonth[month].permits++;
    if (p.status === "paid") byMonth[month].revenue += p.pricePaid;
  });

  vouchers.forEach((v) => {
    const month = v.createdAt.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = { permits: 0, vouchers: 0, revenue: 0 };
    byMonth[month].vouchers++;
    if (v.status === "paid" || v.status === "used") byMonth[month].revenue += v.pricePaid;
  });

  const months = Object.keys(byMonth).sort().reverse();

  return (
    <div>
      <div className="page-title">Statistiky</div>
      <div className="page-desc">Přehled tržeb a aktivit.</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Celkové tržby</div>
          <div className="stat-card-value">{totalRevenue.toLocaleString("cs-CZ")}</div>
          <div className="stat-card-sub">Kč celkem</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Tržby z povolenek</div>
          <div className="stat-card-value">{permitsRevenue.toLocaleString("cs-CZ")}</div>
          <div className="stat-card-sub">Kč</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Tržby z poukázek</div>
          <div className="stat-card-value">{vouchersRevenue.toLocaleString("cs-CZ")}</div>
          <div className="stat-card-sub">Kč</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Celkem transakcí</div>
          <div className="stat-card-value">{permits.length + vouchers.length}</div>
          <div className="stat-card-sub">objednávek</div>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}>
          Po měsících
        </div>
        {months.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Zatím žádná data.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Měsíc</th>
                  <th>Povolenky</th>
                  <th>Poukázky</th>
                  <th>Tržby</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m}>
                    <td>{m}</td>
                    <td>{byMonth[m].permits}</td>
                    <td>{byMonth[m].vouchers}</td>
                    <td style={{ color: "var(--honey)", fontWeight: 600 }}>
                      {byMonth[m].revenue.toLocaleString("cs-CZ")} Kč
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hlavní HiveHouseAdmin ─────────────────────────────────────────────────
export function HiveHouseAdmin({ userEmail, onBack }: Props) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [permits, setPermits] = useState<FishingPermit[]>([]);
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);

  const sectionTitles: Record<AdminSection, string> = {
    dashboard: "Přehled",
    promotions: "Sezonní akce",
    vouchers: "Poukázky",
    permits: "Rybářské povolenky",
    statistics: "Statistiky",
  };

  useEffect(() => {
    const unsub = subscribePromotions(setPromotions);
    return () => unsub();
  }, []);

  useEffect(() => {
    loadPermits().then(setPermits);
    loadVouchers().then(setVouchers);
  }, []);

  return (
    <div className="admin-shell">
      <Sidebar
        section={section}
        onSection={setSection}
        userEmail={userEmail}
        onBack={onBack}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen((o) => !o)}>
              <span /><span /><span />
            </button>
            <h1>{sectionTitles[section]}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{userEmail}</span>
            <button className="btn btn-secondary" style={{ fontSize: "12px" }} onClick={() => signOut(auth)}>
              Odhlásit
            </button>
          </div>
        </div>

        <div className="admin-content">
          {section === "dashboard" && (
            <Dashboard promotions={promotions} permits={permits} vouchers={vouchers} />
          )}
          {section === "promotions" && (
            <PromotionsEditor promotions={promotions} />
          )}
          {section === "vouchers" && <VouchersManager />}
          {section === "permits" && <PermitsManager />}
          {section === "statistics" && (
            <Statistics permits={permits} vouchers={vouchers} />
          )}
        </div>
      </div>
    </div>
  );
}

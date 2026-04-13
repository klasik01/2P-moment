import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Icon } from "./Icon";
import type {
  AdminSection,
  ApiaryContent,
  ContactContent,
  FishingContent,
  FishingInfoCard,
  FishingPermit,
  GiftVoucher,
  HomepageApitherapy,
  HomepageHero,
  HomepageOfferingCard,
  HomepageOfferings,
  HomepageReviewsConfig,
  HomepageTrustbar,
  ManagedImage,
  PermitFormConfig,
  Promotion,
  Review,
  RoomContent,
  RoomStorySection,
  StorySectionLayout,
  VoucherFormConfig,
} from "../types";
import {
  deletePromotion,
  deleteReview,
  loadApiaryContent,
  loadContactContent,
  loadFishingContent,
  loadPermits,
  loadReviews,
  loadRoomContent,
  loadVouchers,
  newApiaryContent,
  newContactContent,
  newFishingContent,
  newPromotion,
  newReview,
  newRoomContent,
  saveApiaryHero,
  saveApiaryGlamping,
  saveApiaryBeeLiving,
  saveApiaryApiTherapy,
  saveApiaryExperience,
  saveApiaryGallery,
  saveContactContent,
  saveFishingHero,
  saveFishingInfo,
  saveFishingGallery,
  savePermitFormConfig,
  savePromotion,
  saveReview,
  saveRoomHero,
  saveRoomDetail,
  saveRoomGallery,
  saveRoomSections,
  saveRoomEquipment,
  saveRoomFacilities,
  saveVoucherFormConfig,
  subscribePromotions,
  updatePermitStatus,
  updateVoucherStatus,
  loadVoucherFormConfig,
  loadPermitFormConfig,
  newVoucherFormConfig,
  newPermitFormConfig,
  loadHomepageHero,
  loadHomepageOfferings,
  loadHomepageApitherapy,
  loadHomepageTrustbar,
  loadHomepageReviewsConfig,
  saveHomepageHero,
  saveHomepageOfferings,
  saveHomepageApitherapy,
  saveHomepageTrustbar,
  saveHomepageReviewsConfig,
  newHomepageHero,
  newHomepageOfferings,
  newHomepageApitherapy,
  newHomepageTrustbar,
  newHomepageReviewsConfig,
} from "../utils/firestore";
import { removeHiveHouseImage, uploadHiveHouseImage } from "../utils/storage";

type Props = {
  userEmail: string;
  onBack: () => void;
  initialSection?: AdminSection;
  onSectionChange?: (section: AdminSection) => void;
};

function isEqual<T>(a: T, b: T) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
};

function useConfirmDialog() {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const requestConfirm = (next: ConfirmState) => setConfirmState(next);

  const ConfirmDialog = () =>
    confirmState ? (
      <div className="admin-confirm-backdrop" onClick={() => setConfirmState(null)}>
        <div className="admin-confirm-dialog" onClick={(event) => event.stopPropagation()}>
          <span className="section-label">Potvrzení akce</span>
          <h2>{confirmState.title}</h2>
          <p>{confirmState.message}</p>
          <div className="admin-confirm-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmState(null)}>Zrušit</button>
            <button
              className={`btn ${confirmState.tone === "danger" ? "btn-danger" : "btn-primary"}`}
              onClick={async () => {
                const action = confirmState.onConfirm;
                setConfirmState(null);
                await action();
              }}
            >
              {confirmState.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return { requestConfirm, ConfirmDialog };
}

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
  type NavGroup = {
    label: string;
    items: { id: AdminSection; label: string; icon: string }[];
  };

  const navGroups: NavGroup[] = [
    {
      label: "Přehled",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
      ],
    },
    {
      label: "Stránky & obsah",
      items: [
        { id: "homepage", label: "Homepage", icon: "🏠" },
        { id: "room", label: "Pokoj", icon: "🛏️" },
        { id: "fishing", label: "Rybaření", icon: "🎣" },
        { id: "apiary", label: "Včelín & Glamping", icon: "🐝" },
      ],
    },
    {
      label: "Akce & prodej",
      items: [
        { id: "promotions", label: "Sezonní akce", icon: "🎁" },
        { id: "voucher-config", label: "Nastavení poukázky", icon: "🎫" },
        { id: "vouchers", label: "Objednané poukázky", icon: "📦" },
        { id: "permit-config", label: "Nastavení povolenky", icon: "🎣" },
        { id: "permits", label: "Vydané povolenky", icon: "📋" },
      ],
    },
    {
      label: "Informace",
      items: [
        { id: "reviews", label: "Recenze", icon: "⭐" },
        { id: "contact", label: "Kontakt", icon: "📞" },
        { id: "statistics", label: "Statistiky", icon: "📈" },
      ],
    },
  ];

  return (
    <>
      <div className={`sidebar-overlay${open ? " show" : ""}`} onClick={onClose} />
      <aside className={`moment-sidebar${open ? " open" : ""}`}>
        <div className="moment-sidebar-brand">
          <div className="brand-hex">⬡</div>
          <div className="brand-text">
            <div className="brand-name">2P Moment</div>
            <div className="brand-app">Hive House</div>
          </div>
        </div>

        <nav className="moment-sidebar-nav">
          {navGroups.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="moment-sidebar-nav-separator" />}
              <div className="moment-sidebar-nav-group-label">{group.label}</div>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id} className="moment-sidebar-nav-item">
                    <button
                      className={section === item.id ? "active" : ""}
                      onClick={() => { onSection(item.id); onClose(); }}
                    >
                      <span className="nav-item-icon">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="moment-sidebar-nav-separator" />
          <ul>
            <li className="moment-sidebar-nav-item">
              <button onClick={() => { onBack(); onClose(); }}>Jiná aplikace</button>
            </li>
          </ul>
        </nav>

        <div className="moment-sidebar-footer">
          <div className="user-info">{userEmail}</div>
          <div className="moment-sidebar-footer-actions">
            <button className="btn btn-outline-dark" onClick={() => { onBack(); onClose(); }}>Zpět</button>
            <button className="btn btn-dark" onClick={() => void signOut(auth)}>Odhlásit</button>
          </div>
        </div>
      </aside>
    </>
  );
}

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
    </div>
  );
}

function PromotionsEditor({ promotions }: { promotions: Promotion[] }) {
  const [editors, setEditors] = useState<Promotion[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

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

  const handleSave = (promo: Promotion) => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(promo.id);
        try {
          await savePromotion(promo);
          showNotice("success", "Akce uložena.");
        } catch {
          showNotice("error", "Chyba při ukládání.");
        } finally {
          setSaving(null);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    requestConfirm({
      title: "Smazat akci?",
      message: "Tato akce bude trvale odstraněna.",
      confirmLabel: "Smazat",
      tone: "danger",
      onConfirm: async () => {
        try {
          await deletePromotion(id);
          showNotice("success", "Akce smazána.");
        } catch {
          showNotice("error", "Chyba při mazání.");
        }
      },
    });
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

      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      {editors.length === 0 && (
        <div style={{ color: "rgba(17,17,17,0.35)", fontSize: "14px", padding: "32px 0" }}>
          Žádné akce. Přidejte první kliknutím na "Nová akce".
        </div>
      )}

      {editors.map((p) => {
        const isCollapsed = collapsed.has(p.id);
        const orig = promotions.find((o) => o.id === p.id);
        const isDirty = !isEqual(p, orig);

        return (
          <article key={p.id} className="admin-card">
            <div className="admin-card-head">
              <button className="admin-card-toggle" onClick={() => toggleCollapse(p.id)}>
                <div
                  className="hh-status-dot"
                  style={{ background: p.enabled ? "var(--red)" : "rgba(17,17,17,0.15)" }}
                />
                <div>
                  <h3>{p.title || "(bez názvu)"}</h3>
                  {isDirty && <p className="admin-dirty">Neuloženo</p>}
                </div>
                <span className={`admin-chevron${!isCollapsed ? " open" : ""}`}>
                  <Icon name="chevron-right" size={18} />
                </span>
              </button>
              <div className="admin-card-controls">
                <button className="btn btn-secondary" onClick={() => handleSave(p)} disabled={saving === p.id || !isDirty}>
                  {saving === p.id ? "Ukládám..." : "Uložit"}
                </button>
                <button className="admin-remove" onClick={() => handleDelete(p.id)}>Smazat</button>
              </div>
            </div>

            {!isCollapsed && <div className="admin-card-body open">
              <div className="admin-card-body-inner">
                <label className="form-checkbox" style={{ marginBottom: "20px" }}>
                  <input type="checkbox" checked={p.enabled} onChange={(e) => update(p.id, { enabled: e.target.checked })} />
                  <span>Zobrazit na webu</span>
                </label>

                <div className="admin-grid">
                  <label>Badge (štítek)<input value={p.badge} onChange={(e) => update(p.id, { badge: e.target.value })} placeholder="Jarní akce" /></label>
                  <label>Název akce<input value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} placeholder="Sleva 20 % na víkend" /></label>
                  <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={p.text} onChange={(e) => update(p.id, { text: e.target.value })} placeholder="Popis akce pro hosty..." rows={2} /></label>
                  <label>Text tlačítka<input value={p.ctaLabel} onChange={(e) => update(p.id, { ctaLabel: e.target.value })} placeholder="Rezervovat" /></label>
                  <label>Odkaz tlačítka<input value={p.ctaHref} onChange={(e) => update(p.id, { ctaHref: e.target.value })} placeholder="/rezervace" /></label>
                  <label>Platí od<input type="date" value={p.startsAt ?? ""} onChange={(e) => update(p.id, { startsAt: e.target.value || undefined })} /></label>
                  <label>Platí do<input type="date" value={p.endsAt ?? ""} onChange={(e) => update(p.id, { endsAt: e.target.value || undefined })} /></label>
                </div>
              </div>
            </div>}
          </article>
        );
      })}
      <ConfirmDialog />
    </div>
  );
}


// ── Shared drag-and-drop card for Equipment / Facility / Intentional ──
const INPUT_STYLE: React.CSSProperties = {
  border: "2px solid #e5e5e5",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  color: "#111",
  background: "#fff",
  width: "100%",
  transition: "border-color var(--transition)",
};

function DndItemRow<T extends { id: string; icon: string; title: string; desc: string }>({
  item,
  index,
  draggingId,
  placeholder,
  onDragStart,
  onDragEnd,
  onDrop,
  onChange,
  onDelete,
}: {
  item: T;
  index: number;
  draggingId: string | null;
  placeholder?: { title?: string; desc?: string };
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onChange: (patch: Partial<T>) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`draggable-card${draggingId === item.id ? " dragging" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        background: "#fff",
        border: "1px solid rgba(17,17,17,0.08)",
        borderRadius: 16,
        marginBottom: 10,
        padding: "16px 16px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Řádek 1: drag handle + číslo + emoji ikona + název input + koš */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span className="drag-handle" style={{ flexShrink: 0 }}>⋮⋮</span>
        <span className="order-chip" style={{ flexShrink: 0 }}>{index + 1}</span>
        <input
          value={item.icon}
          onChange={(e) => onChange({ icon: e.target.value } as Partial<T>)}
          placeholder="🏠"
          title="Emoji ikona"
          style={{
            ...INPUT_STYLE,
            width: 56,
            flexShrink: 0,
            textAlign: "center",
            fontSize: 22,
            padding: "8px 6px",
          }}
        />
        <input
          value={item.title}
          onChange={(e) => onChange({ title: e.target.value } as Partial<T>)}
          placeholder={placeholder?.title || "Název"}
          style={{ ...INPUT_STYLE, flex: 1, fontWeight: 600 }}
        />
        <button className="admin-icon-button danger" type="button" onClick={onDelete} style={{ flexShrink: 0 }}>
          <Icon name="trash" size={15} />
        </button>
      </div>
      {/* Řádek 2: popis (odsazený za handle+číslo+ikona) */}
      <div style={{ paddingLeft: 88 }}>
        <input
          value={item.desc}
          onChange={(e) => onChange({ desc: e.target.value } as Partial<T>)}
          placeholder={placeholder?.desc || "Popis…"}
          style={{ ...INPUT_STYLE, color: "#5d5d5d", fontSize: 13 }}
        />
      </div>
    </div>
  );
}

function RoomEditor() {
  const [room, setRoom] = useState<RoomContent>(newRoomContent());
  const [originalRoom, setOriginalRoom] = useState<RoomContent>(newRoomContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "detail" | "gallery" | "sections" | "equipment" | "facilities">("hero");
  // drag states
  const [sectionDraggingId, setSectionDraggingId] = useState<string | null>(null);
  const [equipDraggingId, setEquipDraggingId] = useState<string | null>(null);
  const [facDraggingId, setFacDraggingId] = useState<string | null>(null);
  const [intDraggingId, setIntDraggingId] = useState<string | null>(null);
  const [imageDraggingIndex, setImageDraggingIndex] = useState<number | null>(null);
  const [btnDraggingKey, setBtnDraggingKey] = useState<string | null>(null);
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();
  // collapsed story sections — všechny zavřené při načtení
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set<string>());

  useEffect(() => {
    loadRoomContent()
      .then((data) => {
        setRoom(data);
        setOriginalRoom(data);
        // všechny sekce začínají zavřené
        setCollapsedSections(new Set(data.sections.map((s) => s.id)));
      })
      .finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const isDirty = useMemo(() => !isEqual(room, originalRoom), [room, originalRoom]);

  type RoomSection = "hero" | "detail" | "gallery" | "sections" | "equipment" | "facilities" | "all";

  const handleSave = (section: RoomSection) => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: () => performSave(section),
    });
  };

  const performSave = async (section: RoomSection) => {
    setSaving(section);
    try {
      if (section === "hero" || section === "all") {
        await saveRoomHero({ heroEyebrow: room.heroEyebrow, heroTitle: room.heroTitle, heroHighlight: room.heroHighlight, heroDescription: room.heroDescription, heroImage: room.heroImage });
        await saveRoomDetail({ detailEyebrow: room.detailEyebrow, title: room.title, detailHighlight: room.detailHighlight, description: room.description, modalTitle: room.modalTitle, modalSubtitle: room.modalSubtitle, modalDescription: room.modalDescription, reserveLabel: room.reserveLabel, galleryLabel: room.galleryLabel, voucherLabel: room.voucherLabel, showReserveBtn: room.showReserveBtn, showGalleryBtn: room.showGalleryBtn, showVoucherBtn: room.showVoucherBtn, buttonsOrder: room.buttonsOrder, labels: room.labels });
        setOriginalRoom((p) => ({ ...p, heroEyebrow: room.heroEyebrow, heroTitle: room.heroTitle, heroHighlight: room.heroHighlight, heroDescription: room.heroDescription, heroImage: room.heroImage, reserveLabel: room.reserveLabel, galleryLabel: room.galleryLabel, voucherLabel: room.voucherLabel, showReserveBtn: room.showReserveBtn, showGalleryBtn: room.showGalleryBtn, showVoucherBtn: room.showVoucherBtn, buttonsOrder: room.buttonsOrder }));
      }
      if (section === "detail" || section === "all") {
        await saveRoomDetail({ detailEyebrow: room.detailEyebrow, title: room.title, detailHighlight: room.detailHighlight, description: room.description, modalTitle: room.modalTitle, modalSubtitle: room.modalSubtitle, modalDescription: room.modalDescription, reserveLabel: room.reserveLabel, galleryLabel: room.galleryLabel, voucherLabel: room.voucherLabel, showReserveBtn: room.showReserveBtn, showGalleryBtn: room.showGalleryBtn, showVoucherBtn: room.showVoucherBtn, buttonsOrder: room.buttonsOrder, labels: room.labels });
        setOriginalRoom((p) => ({ ...p, detailEyebrow: room.detailEyebrow, title: room.title, detailHighlight: room.detailHighlight, description: room.description, modalTitle: room.modalTitle, modalSubtitle: room.modalSubtitle, modalDescription: room.modalDescription, reserveLabel: room.reserveLabel, galleryLabel: room.galleryLabel, voucherLabel: room.voucherLabel, showReserveBtn: room.showReserveBtn, showGalleryBtn: room.showGalleryBtn, showVoucherBtn: room.showVoucherBtn, buttonsOrder: room.buttonsOrder, labels: room.labels }));
      }
      if (section === "gallery" || section === "all") {
        await saveRoomGallery({ images: room.images });
        setOriginalRoom((p) => ({ ...p, images: room.images }));
      }
      if (section === "sections" || section === "all") {
        await saveRoomSections({ sections: room.sections });
        setOriginalRoom((p) => ({ ...p, sections: room.sections }));
      }
      if (section === "equipment" || section === "all") {
        await saveRoomEquipment({ equipment: room.equipment });
        setOriginalRoom((p) => ({ ...p, equipment: room.equipment }));
      }
      if (section === "facilities" || section === "all") {
        await saveRoomFacilities({ facilities: room.facilities, intentional: room.intentional });
        setOriginalRoom((p) => ({ ...p, facilities: room.facilities, intentional: room.intentional }));
      }
      const labels: Record<RoomSection, string> = {
        hero: "Hero sekce uložena.",
        detail: "Texty a popup uloženy.",
        gallery: "Galerie uložena.",
        sections: "Obsahové bloky uloženy.",
        equipment: "Vybavení uloženo.",
        facilities: "Zázemí uloženo.",
        all: "Celý obsah pokoje uložen.",
      };
      showNotice("success", labels[section]);
    } catch {
      showNotice("error", "Chyba při ukládání.");
    } finally {
      setSaving(null);
    }
  };

  const addLabel = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    setRoom((current) => ({ ...current, labels: [...current.labels, trimmed] }));
    setNewLabel("");
  };

  const handleImageDrop = (targetIndex: number) => {
    if (imageDraggingIndex === null || imageDraggingIndex === targetIndex) return;
    setRoom((current) => ({ ...current, images: moveItem(current.images, imageDraggingIndex, targetIndex) }));
    setImageDraggingIndex(null);
  };

  // ── Story sections ──
  const updateSection = (id: string, patch: Partial<RoomStorySection>) => {
    setRoom((c) => ({ ...c, sections: c.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  };
  const addSection = () => {
    const id = `room-section-${Date.now()}`;
    setRoom((c) => ({
      ...c,
      sections: [...c.sections, { id, eyebrow: "", title: "", text: "", layout: "text" as StorySectionLayout }],
    }));
    // otevřít novou sekci, zavřít ostatní
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      // close all existing
      room.sections.forEach((s) => next.add(s.id));
      // keep new one open (not in collapsed set)
      next.delete(id);
      return next;
    });
  };
  // accordion — otevřít jednu, ostatní zavřít
  const toggleCollapseSection = (id: string) => {
    setCollapsedSections((prev) => {
      const isOpen = !prev.has(id);
      if (isOpen) {
        // was open → close it
        const next = new Set(prev);
        next.add(id);
        return next;
      } else {
        // was closed → open it, close all others
        const next = new Set(room.sections.map((s) => s.id));
        next.delete(id);
        return next;
      }
    });
  };
  const handleSectionDrop = (targetId: string) => {
    if (!sectionDraggingId || sectionDraggingId === targetId) return;
    const from = room.sections.findIndex((s) => s.id === sectionDraggingId);
    const to   = room.sections.findIndex((s) => s.id === targetId);
    if (from < 0 || to < 0) return;
    setRoom((c) => ({ ...c, sections: moveItem(c.sections, from, to) }));
    setSectionDraggingId(null);
  };

  // ── Equipment ──
  const handleEquipDrop = (targetId: string) => {
    if (!equipDraggingId || equipDraggingId === targetId) return;
    const from = room.equipment.findIndex((e) => e.id === equipDraggingId);
    const to   = room.equipment.findIndex((e) => e.id === targetId);
    if (from < 0 || to < 0) return;
    setRoom((c) => ({ ...c, equipment: moveItem(c.equipment, from, to) }));
    setEquipDraggingId(null);
  };

  // ── Facilities ──
  const handleFacDrop = (targetId: string) => {
    if (!facDraggingId || facDraggingId === targetId) return;
    const from = room.facilities.findIndex((f) => f.id === facDraggingId);
    const to   = room.facilities.findIndex((f) => f.id === targetId);
    if (from < 0 || to < 0) return;
    setRoom((c) => ({ ...c, facilities: moveItem(c.facilities, from, to) }));
    setFacDraggingId(null);
  };

  // ── Intentional ──
  const handleIntDrop = (targetId: string) => {
    if (!intDraggingId || intDraggingId === targetId) return;
    const from = room.intentional.findIndex((f) => f.id === intDraggingId);
    const to   = room.intentional.findIndex((f) => f.id === targetId);
    if (from < 0 || to < 0) return;
    setRoom((c) => ({ ...c, intentional: moveItem(c.intentional, from, to) }));
    setIntDraggingId(null);
  };

  const uploadRoomImage = async (file: File, index?: number) => {
    if (typeof index === "number") setUploadingImageIndex(index);
    else setIsAddingImage(true);

    try {
      const currentImage = typeof index === "number" ? room.images[index] : undefined;
      if (currentImage?.storagePath) {
        await removeHiveHouseImage(currentImage.storagePath);
      }

      const uploaded = await uploadHiveHouseImage(file, `room/${room.title || "main"}`);
      setRoom((current) => {
        if (typeof index === "number") {
          return {
            ...current,
            images: current.images.map((image, imageIndex) =>
              imageIndex === index ? uploaded : image,
            ),
          };
        }
        return {
          ...current,
          images: [...current.images, uploaded],
        };
      });
      showNotice("success", "Obrázek pokoje byl nahrán. Ulož změny.");
    } catch {
      showNotice("error", "Nahrání obrázku pokoje se nepodařilo.");
    } finally {
      setUploadingImageIndex(null);
      setIsAddingImage(false);
    }
  };


  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const tabs = [
    { id: "hero"      as const, label: "Hero" },
    { id: "detail"    as const, label: "Detail & Popup" },
    { id: "gallery"   as const, label: "Galerie" },
    { id: "sections"  as const, label: "Obsahové bloky" },
    { id: "equipment" as const, label: "Vybavení" },
    { id: "facilities"as const, label: "Zázemí" },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Pokoj — ubytování</div>
          <div className="page-desc">Správa stránky ubytování: hero, texty, galerie, vybavení a zázemí.</div>
        </div>
        <button className="btn btn-primary" onClick={() => handleSave("all")} disabled={saving !== null || !isDirty}>
          {saving === "all" ? "Ukládám…" : "Uložit vše"}
        </button>
      </div>

      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ HERO ══════════ */}
      {activeTab === "hero" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <div className="admin-grid">
                <label style={{ gridColumn: "1 / -1" }}>Eyebrow<input value={room.heroEyebrow} onChange={(e) => setRoom((c) => ({ ...c, heroEyebrow: e.target.value }))} placeholder="Ubytování" /></label>
                <label>Hlavní nadpis<input value={room.heroTitle} onChange={(e) => setRoom((c) => ({ ...c, heroTitle: e.target.value }))} placeholder="Ubytování v" /></label>
                <label>Zvýrazněná část<input value={room.heroHighlight} onChange={(e) => setRoom((c) => ({ ...c, heroHighlight: e.target.value }))} placeholder="Hive House" /></label>
                <label style={{ gridColumn: "1 / -1" }}>Popis pod nadpisem<textarea value={room.heroDescription} onChange={(e) => setRoom((c) => ({ ...c, heroDescription: e.target.value }))} rows={3} placeholder="Úvodní text…" /></label>
              </div>

              {/* CTA tlačítka */}
              <div className="admin-subsection">
                <div className="admin-subsection-head">
                  <h4>CTA tlačítka</h4>
                </div>
                <p className="admin-subsection-text">Zaškrtněte která tlačítka se mají zobrazit. Přetažením za rukojeť ⋮⋮ změňte pořadí.</p>

                {(() => {
                  const btnMeta: Record<"reserve" | "gallery" | "voucher", { showKey: "showReserveBtn" | "showGalleryBtn" | "showVoucherBtn"; labelKey: "reserveLabel" | "galleryLabel" | "voucherLabel"; name: string; placeholder: string }> = {
                    reserve: { showKey: "showReserveBtn", labelKey: "reserveLabel", name: "Rezervace", placeholder: "Rezervovat pobyt" },
                    gallery: { showKey: "showGalleryBtn", labelKey: "galleryLabel", name: "Galerie", placeholder: "Zobrazit galerii" },
                    voucher: { showKey: "showVoucherBtn", labelKey: "voucherLabel", name: "Poukázka", placeholder: "Koupit poukázku" },
                  };
                  const order = room.buttonsOrder && room.buttonsOrder.length > 0
                    ? room.buttonsOrder
                    : (["reserve", "gallery", "voucher"] as const);

                  const handleBtnDrop = (targetKey: "reserve" | "gallery" | "voucher") => {
                    if (!btnDraggingKey || btnDraggingKey === targetKey) return;
                    const from = order.findIndex((k) => k === btnDraggingKey);
                    const to   = order.findIndex((k) => k === targetKey);
                    if (from < 0 || to < 0) return;
                    const next = [...order];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);
                    setRoom((c) => ({ ...c, buttonsOrder: next as RoomContent["buttonsOrder"] }));
                    setBtnDraggingKey(null);
                  };

                  return order.map((key, index) => {
                    const btn = btnMeta[key];
                    const isActive = room[btn.showKey];
                    return (
                      <article
                        key={btn.showKey}
                        className={`admin-card draggable-card${btnDraggingKey === key ? " dragging" : ""}`}
                        draggable
                        onDragStart={() => setBtnDraggingKey(key)}
                        onDragEnd={() => setBtnDraggingKey(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleBtnDrop(key)}
                        style={{ marginBottom: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "auto auto 1fr 2fr", gap: 12, alignItems: "center", border: `2px solid ${isActive ? "var(--red)" : "#e5e5e5"}` }}
                      >
                        <span className="drag-handle" title="Přetáhnout">⋮⋮</span>
                        <span className="order-chip">{index + 1}</span>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setRoom((c) => ({ ...c, [btn.showKey]: e.target.checked }))}
                            style={{ width: 18, height: 18, accentColor: "var(--red)", flexShrink: 0, cursor: "pointer" }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: isActive ? "var(--red)" : "#9a9a9a", transition: "color 0.2s" }}>
                            {btn.name}
                          </span>
                        </label>
                        <input
                          value={room[btn.labelKey]}
                          onChange={(e) => setRoom((c) => ({ ...c, [btn.labelKey]: e.target.value }))}
                          placeholder={btn.placeholder}
                          disabled={!isActive}
                          style={{
                            border: "2px solid #e5e5e5",
                            borderRadius: 10,
                            padding: "10px 14px",
                            fontSize: 14,
                            background: isActive ? "#fff" : "#f5f5f5",
                            color: "#111",
                            opacity: isActive ? 1 : 0.45,
                            width: "100%",
                            transition: "opacity 0.2s, background 0.2s",
                          }}
                        />
                      </article>
                    );
                  });
                })()}
              </div>

              <div className="admin-subsection">
                <p className="admin-subsection-label">Úvodní fotka (hero)</p>
                <ManagedImageUploader
                  image={room.heroImage}
                  folder="room/hero"
                  onUpload={(img) => setRoom((c) => ({ ...c, heroImage: img }))}
                  onRemove={() => setRoom((c) => ({ ...c, heroImage: undefined }))}
                  onNotice={showNotice}
                />
              </div>
              <div className="section-save-row">
                <button className="btn btn-secondary" onClick={() => handleSave("hero")} disabled={saving !== null}>
                  {saving === "hero" ? "Ukládám…" : "Uložit hero"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DETAIL & POPUP ══════════ */}
      {activeTab === "detail" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <h3 style={{ marginBottom: 16 }}>Texty a popup galerie</h3>
              <div className="admin-grid">
                <label>Eyebrow v detailu<input value={room.detailEyebrow} onChange={(e) => setRoom((c) => ({ ...c, detailEyebrow: e.target.value }))} placeholder="Vybavení" /></label>
                <label>Název sekce<input value={room.title} onChange={(e) => setRoom((c) => ({ ...c, title: e.target.value }))} placeholder="Včelín Hive House" /></label>
                <label>Zvýrazněná část titulku<input value={room.detailHighlight} onChange={(e) => setRoom((c) => ({ ...c, detailHighlight: e.target.value }))} placeholder="do detailu" /></label>
                <label style={{ gridColumn: "1 / -1" }}>Popis pokoje<textarea value={room.description} onChange={(e) => setRoom((c) => ({ ...c, description: e.target.value }))} rows={4} /></label>
                <label>Nadpis popupu<input value={room.modalTitle} onChange={(e) => setRoom((c) => ({ ...c, modalTitle: e.target.value }))} /></label>
                <label>Podtitulek popupu<input value={room.modalSubtitle} onChange={(e) => setRoom((c) => ({ ...c, modalSubtitle: e.target.value }))} /></label>
                <label style={{ gridColumn: "1 / -1" }}>Popis popupu<textarea value={room.modalDescription} onChange={(e) => setRoom((c) => ({ ...c, modalDescription: e.target.value }))} rows={3} /></label>
              </div>
              <div className="admin-subsection">
                <p className="admin-subsection-label">Štítky v popupu galerie</p>
                <div className="inline-editor-row" style={{ marginBottom: 12 }}>
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLabel(); } }} placeholder="Soukromá terasa" />
                  <button className="btn btn-secondary" type="button" onClick={addLabel}>Přidat</button>
                </div>
                <div className="tag-list">
                  {room.labels.map((label, i) => (
                    <span key={`${label}-${i}`} className="tag-chip">
                      {label}
                      <button className="tag-chip-remove" type="button" onClick={() => setRoom((c) => ({ ...c, labels: c.labels.filter((_, j) => j !== i) }))}>×</button>
                    </span>
                  ))}
                  {room.labels.length === 0 && <span className="empty-hint">Žádné štítky.</span>}
                </div>
              </div>
              <div className="section-save-row">
                <button className="btn btn-secondary" onClick={() => handleSave("detail")} disabled={saving !== null}>
                  {saving === "detail" ? "Ukládám…" : "Uložit detail & popup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ GALERIE ══════════ */}
      {activeTab === "gallery" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>Galerie fotek</h3>
                  <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Přetažením řaďte fotky.</p>
                </div>
              </div>
              <div className="admin-gallery-grid">
                {room.images.map((image, index) => (
                  <article
                    key={`${image.url}-${index}`}
                    className={`admin-gallery-tile${imageDraggingIndex === index ? " dragging" : ""}`}
                    draggable
                    onDragStart={() => setImageDraggingIndex(index)}
                    onDragEnd={() => setImageDraggingIndex(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleImageDrop(index)}
                  >
                    <div className="admin-gallery-frame">
                      <span className="admin-gallery-order">{index + 1}</span>
                      <span className="admin-gallery-drag" title="Přetáhnout">⋮⋮</span>
                      {image.url
                        ? <img className="admin-image-preview" src={image.url} alt={`Fotka ${index + 1}`} />
                        : <div className="admin-image-placeholder"><Icon name="image" size={24} /></div>}
                    </div>
                    <div className="admin-gallery-actions">
                      <label className={`admin-icon-button admin-file-trigger${uploadingImageIndex === index ? " is-busy" : ""}`}>
                        <Icon name="upload" size={16} />
                        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; await uploadRoomImage(f, index); e.target.value = ""; }} />
                      </label>
                      <button className="admin-icon-button danger" onClick={() => {
                        requestConfirm({
                          title: "Smazat fotku?",
                          message: "Fotka bude odstraněna z galerie.",
                          confirmLabel: "Smazat",
                          tone: "danger",
                          onConfirm: async () => {
                            try { await removeHiveHouseImage(image.storagePath); } catch { /* ok */ }
                            setRoom((c) => ({ ...c, images: c.images.filter((_, i) => i !== index) }));
                          },
                        });
                      }}><Icon name="trash" size={16} /></button>
                    </div>
                  </article>
                ))}
                <article className="admin-gallery-tile admin-gallery-tile-add">
                  <div className="admin-gallery-frame">
                    <div className="admin-image-placeholder admin-image-placeholder-add">
                      <div className="admin-image-placeholder-copy"><Icon name="upload" size={24} /></div>
                    </div>
                  </div>
                  <div className="admin-gallery-actions">
                    <label className={`admin-icon-button admin-file-trigger admin-icon-button-wide${isAddingImage ? " is-busy" : ""}`}>
                      <Icon name="upload" size={16} /><span>{isAddingImage ? "Nahrávám…" : "Přidat fotku"}</span>
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; await uploadRoomImage(f); e.target.value = ""; }} />
                    </label>
                  </div>
                </article>
              </div>
              <div className="section-save-row">
                <button className="btn btn-secondary" onClick={() => handleSave("gallery")} disabled={saving !== null}>
                  {saving === "gallery" ? "Ukládám…" : "Uložit galerii"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ OBSAHOVÉ BLOKY ══════════ */}
      {activeTab === "sections" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Přetažením řaďte bloky. Kliknutím na hlavičku rozbalit/sbalit.</p>
            <button className="btn btn-secondary" type="button" onClick={addSection}>+ Přidat blok</button>
          </div>

          {room.sections.map((section, index) => {
            const isCollapsed = collapsedSections.has(section.id);
            return (
              <article
                key={section.id}
                className={`admin-card draggable-card${sectionDraggingId === section.id ? " dragging" : ""}`}
                draggable
                onDragStart={() => setSectionDraggingId(section.id)}
                onDragEnd={() => setSectionDraggingId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleSectionDrop(section.id)}
                style={{ marginBottom: 10, padding: 0, overflow: "hidden" }}
              >
                {/* Header */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => toggleCollapseSection(section.id)}
                >
                  <span className="drag-handle" onClick={(e) => e.stopPropagation()}>⋮⋮</span>
                  <span className="order-chip">{index + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "rgba(17,17,17,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {section.title || section.eyebrow || "(bez názvu)"}
                    </div>
                    {section.eyebrow && section.title && (
                      <div style={{ fontSize: 12, color: "rgba(17,17,17,0.4)" }}>{section.eyebrow}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {section.layout === "image-left" ? "obr + text" : "text"}
                  </span>
                  <button
                    className="admin-icon-button danger"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRoom((c) => ({ ...c, sections: c.sections.filter((s) => s.id !== section.id) })); }}
                  ><Icon name="trash" size={15} /></button>
                  <Icon name={isCollapsed ? "chevron-right" : "chevron-down"} size={16} />
                </div>

                {/* Body */}
                {!isCollapsed && (
                  <div style={{ borderTop: "1px solid rgba(17,17,17,0.07)", padding: "16px" }}>
                    <div className="admin-grid">
                      <label>Eyebrow<input value={section.eyebrow} onChange={(e) => updateSection(section.id, { eyebrow: e.target.value })} placeholder="Ráno v Hive House" /></label>
                      <label>Nadpis<input value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="Klidný start dne" /></label>
                      <label style={{ gridColumn: "1 / -1" }}>Text<textarea value={section.text} onChange={(e) => updateSection(section.id, { text: e.target.value })} rows={3} placeholder="Popis…" /></label>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(17,17,17,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Rozložení:</span>
                      <label className="form-checkbox" style={{ marginBottom: 0 }}>
                        <input type="radio" name={`layout-${section.id}`} checked={(section.layout ?? "text") === "text"} onChange={() => updateSection(section.id, { layout: "text" })} />
                        <span>Samotný text</span>
                      </label>
                      <label className="form-checkbox" style={{ marginBottom: 0 }}>
                        <input type="radio" name={`layout-${section.id}`} checked={section.layout === "image-left"} onChange={() => updateSection(section.id, { layout: "image-left" })} />
                        <span>Obrázek vlevo</span>
                      </label>
                    </div>
                    {section.layout === "image-left" && (
                      <div style={{ marginTop: 12 }}>
                        <p className="admin-subsection-label" style={{ marginBottom: 8 }}>Obrázek sekce</p>
                        <ManagedImageUploader
                          image={section.image}
                          folder={`room/sections/${section.id}`}
                          onUpload={(img) => updateSection(section.id, { image: img })}
                          onRemove={() => updateSection(section.id, { image: undefined })}
                          onNotice={showNotice}
                        />
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {room.sections.length === 0 && (
            <div className="empty-hint" style={{ padding: "32px 0" }}>Žádné obsahové bloky. Přidejte první.</div>
          )}

          <div className="section-save-row" style={{ marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => handleSave("sections")} disabled={saving !== null}>
              {saving === "sections" ? "Ukládám…" : "Uložit obsahové bloky"}
            </button>
          </div>
        </div>
      )}

      {/* ══════════ VYBAVENÍ ══════════ */}
      {activeTab === "equipment" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>Vybavení pokoje</h3>
                  <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Přetažením řaďte. Emoji jako ikona (🛏️ 📶 🌡️).</p>
                </div>
                <button className="btn btn-secondary" type="button" onClick={() => setRoom((c) => ({ ...c, equipment: [...c.equipment, { id: `eq-${Date.now()}`, icon: "🏠", title: "", desc: "" }] }))}>
                  + Přidat
                </button>
              </div>

              {room.equipment.map((item, index) => (
                <DndItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  draggingId={equipDraggingId}
                  placeholder={{ title: "Postel 140 cm", desc: "Krátký popis vybavení…" }}
                  onDragStart={() => setEquipDraggingId(item.id)}
                  onDragEnd={() => setEquipDraggingId(null)}
                  onDrop={() => handleEquipDrop(item.id)}
                  onChange={(patch) => setRoom((c) => ({ ...c, equipment: c.equipment.map((e) => (e.id === item.id ? { ...e, ...patch } : e)) }))}
                  onDelete={() => setRoom((c) => ({ ...c, equipment: c.equipment.filter((e) => e.id !== item.id) }))}
                />
              ))}
              {room.equipment.length === 0 && <div className="empty-hint">Žádné položky vybavení.</div>}

              <div className="section-save-row">
                <button className="btn btn-secondary" onClick={() => handleSave("equipment")} disabled={saving !== null}>
                  {saving === "equipment" ? "Ukládám…" : "Uložit vybavení"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ZÁZEMÍ ══════════ */}
      {activeTab === "facilities" && (
        <div>
          {/* Zázemí a služby */}
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <div className="admin-card-body open">
              <div className="admin-card-body-inner">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>Zázemí a služby</h3>
                    <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Sekce „Vše na dosah" — kuchyňka, toaleta apod.</p>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={() => setRoom((c) => ({ ...c, facilities: [...c.facilities, { id: `fac-${Date.now()}`, icon: "🏠", title: "", desc: "" }] }))}>
                    + Přidat
                  </button>
                </div>

                {room.facilities.map((item, index) => (
                  <DndItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    draggingId={facDraggingId}
                    placeholder={{ title: "Kuchyňka", desc: "Kde se nachází, co obsahuje…" }}
                    onDragStart={() => setFacDraggingId(item.id)}
                    onDragEnd={() => setFacDraggingId(null)}
                    onDrop={() => handleFacDrop(item.id)}
                    onChange={(patch) => setRoom((c) => ({ ...c, facilities: c.facilities.map((f) => (f.id === item.id ? { ...f, ...patch } : f)) }))}
                    onDelete={() => setRoom((c) => ({ ...c, facilities: c.facilities.filter((f) => f.id !== item.id) }))}
                  />
                ))}
                {room.facilities.length === 0 && <div className="empty-hint">Žádné zázemí.</div>}
              </div>
            </div>
          </div>

          {/* Co nenajdete */}
          <div className="admin-card">
            <div className="admin-card-body open">
              <div className="admin-card-body-inner">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>Co u nás nenajdete</h3>
                    <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Záměrně chybějící věci s vysvětlením (pravý sloupec).</p>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={() => setRoom((c) => ({ ...c, intentional: [...c.intentional, { id: `int-${Date.now()}`, icon: "🌿", title: "", desc: "" }] }))}>
                    + Přidat
                  </button>
                </div>

                {room.intentional.map((item, index) => (
                  <DndItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    draggingId={intDraggingId}
                    placeholder={{ title: "Televize", desc: "Proč záměrně chybí…" }}

                    onDragStart={() => setIntDraggingId(item.id)}
                    onDragEnd={() => setIntDraggingId(null)}
                    onDrop={() => handleIntDrop(item.id)}
                    onChange={(patch) => setRoom((c) => ({ ...c, intentional: c.intentional.map((f) => (f.id === item.id ? { ...f, ...patch } : f)) }))}
                    onDelete={() => setRoom((c) => ({ ...c, intentional: c.intentional.filter((f) => f.id !== item.id) }))}
                  />
                ))}
                {room.intentional.length === 0 && <div className="empty-hint">Žádné záměrně chybějící položky.</div>}

                <div className="section-save-row">
                  <button className="btn btn-secondary" onClick={() => handleSave("facilities")} disabled={saving !== null}>
                    {saving === "facilities" ? "Ukládám…" : "Uložit zázemí"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}

function PermitsManager() {
  const [permits, setPermits] = useState<FishingPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadPermits().then(setPermits).finally(() => setLoading(false));
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
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}
      <div className="admin-card" style={{ marginTop: "20px" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Datum</th><th>Jméno</th><th>E-mail</th><th>Osob</th><th>Sleva</th><th>Cena</th><th>Status</th><th>Změnit</th>
              </tr>
            </thead>
            <tbody>
              {permits.length === 0 ? (
                <tr><td colSpan={8} className="empty-hint">Žádné záznamy.</td></tr>
              ) : permits.map((p) => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>{p.name}</td>
                  <td style={{ fontSize: "12px", color: "#666" }}>{p.email}</td>
                  <td>{p.persons}</td>
                  <td>{p.isHojanoviceChild ? "Dítě" : p.isFirefighter ? "Hasič" : "—"}</td>
                  <td style={{ fontWeight: 600 }}>{p.pricePaid === 0 ? "ZDARMA" : `${p.pricePaid} Kč`}</td>
                  <td><span className={`status-badge status-badge-${p.status}`}>{p.status}</span></td>
                  <td>
                    <select value={p.status} onChange={(e) => changeStatus(p.id, e.target.value as FishingPermit["status"])} style={{ background: "var(--gray-light)", color: "#111", border: "1.5px solid var(--dark-16)", borderRadius: "8px", padding: "5px 10px", fontSize: "12px", cursor: "pointer" }}>
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VouchersManager() {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadVouchers().then(setVouchers).finally(() => setLoading(false));
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
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}
      <div className="admin-card" style={{ marginTop: "20px" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kód</th><th>Příjemce</th><th>Odesílatel</th><th>Noci</th><th>Cena</th><th>Platí do</th><th>Status</th><th>Změnit</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr><td colSpan={8} className="empty-hint">Žádné záznamy.</td></tr>
              ) : vouchers.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontFamily: "monospace", color: "var(--red)", fontSize: "12px", fontWeight: 700 }}>{v.code}</td>
                  <td><div>{v.recipientName}</div><div style={{ fontSize: "11px", color: "rgba(17,17,17,0.45)" }}>{v.recipientEmail}</div></td>
                  <td><div>{v.senderName}</div><div style={{ fontSize: "11px", color: "rgba(17,17,17,0.45)" }}>{v.senderEmail}</div></td>
                  <td>{v.nights}</td>
                  <td style={{ fontWeight: 600 }}>{v.pricePaid.toLocaleString("cs-CZ")} Kč</td>
                  <td>{v.validUntil}</td>
                  <td><span className={`status-badge status-badge-${v.status}`}>{v.status}</span></td>
                  <td>
                    <select value={v.status} onChange={(e) => changeStatus(v.id, e.target.value as GiftVoucher["status"])} style={{ background: "var(--gray-light)", color: "#111", border: "1.5px solid var(--dark-16)", borderRadius: "8px", padding: "5px 10px", fontSize: "12px", cursor: "pointer" }}>
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="used">used</option>
                      <option value="expired">expired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
        <div className="stat-card"><div className="stat-card-label">Celkové tržby</div><div className="stat-card-value">{totalRevenue.toLocaleString("cs-CZ")}</div><div className="stat-card-sub">Kč celkem</div></div>
        <div className="stat-card"><div className="stat-card-label">Tržby z povolenek</div><div className="stat-card-value">{permitsRevenue.toLocaleString("cs-CZ")}</div><div className="stat-card-sub">Kč</div></div>
        <div className="stat-card"><div className="stat-card-label">Tržby z poukázek</div><div className="stat-card-value">{vouchersRevenue.toLocaleString("cs-CZ")}</div><div className="stat-card-sub">Kč</div></div>
        <div className="stat-card"><div className="stat-card-label">Celkem transakcí</div><div className="stat-card-value">{permits.length + vouchers.length}</div><div className="stat-card-sub">objednávek</div></div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <p className="admin-subsection-label" style={{ marginBottom: "12px" }}>Po měsících</p>
        {months.length === 0 ? (
          <div className="empty-hint">Zatím žádná data.</div>
        ) : (
          <div className="admin-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Měsíc</th><th>Povolenky</th><th>Poukázky</th><th>Tržby</th></tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m}>
                      <td>{m}</td>
                      <td>{byMonth[m].permits}</td>
                      <td>{byMonth[m].vouchers}</td>
                      <td style={{ color: "var(--red)", fontWeight: 600 }}>{byMonth[m].revenue.toLocaleString("cs-CZ")} Kč</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VoucherFormEditor ─────────────────────────────────────────────────────────
function VoucherFormEditor() {
  const [config, setConfig] = useState<VoucherFormConfig>(newVoucherFormConfig());
  const [original, setOriginal] = useState<VoucherFormConfig>(newVoucherFormConfig());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newNight, setNewNight] = useState("");
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadVoucherFormConfig().then((d) => { setConfig(d); setOriginal(d); }).finally(() => setLoading(false));
  }, []);

  const isDirty = useMemo(() => !isEqual(config, original), [config, original]);
  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };
  const handleSave = () => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(true);
        try { await saveVoucherFormConfig(config); setOriginal(config); showNotice("success", "Nastavení poukázky uloženo."); }
        catch { showNotice("error", "Chyba při ukládání."); }
        finally { setSaving(false); }
      },
    });
  };

  const addNightOption = () => {
    const val = parseInt(newNight, 10);
    if (!val || val < 1 || val > 365) return;
    if (config.nightOptions.includes(val)) return;
    setConfig((c) => ({ ...c, nightOptions: [...c.nightOptions, val].sort((a, b) => a - b) }));
    setNewNight("");
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const pricePerNight = config.pricePerNight;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Nastavení poukázky</div>
          <div className="page-desc">Texty formuláře, cena za noc, nabídka počtu nocí a platnost.</div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      {/* Texty */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Texty formuláře</p>
          <div className="admin-grid">
            <label style={{ gridColumn: "1 / -1" }}>Nadpis modalu<input value={config.modalTitle} onChange={(e) => setConfig((c) => ({ ...c, modalTitle: e.target.value }))} placeholder="Dárková poukázka" /></label>
            <label style={{ gridColumn: "1 / -1" }}>Popis pod nadpisem<textarea value={config.modalDesc} onChange={(e) => setConfig((c) => ({ ...c, modalDesc: e.target.value }))} rows={2} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Zpráva po odeslání (úspěch)<input value={config.successMessage} onChange={(e) => setConfig((c) => ({ ...c, successMessage: e.target.value }))} /></label>
            <label>Text tlačítka Odeslat<input value={config.payButtonLabel} onChange={(e) => setConfig((c) => ({ ...c, payButtonLabel: e.target.value }))} placeholder="Zaplatit a odeslat" /></label>
            <label>Text tlačítka Zrušit<input value={config.cancelButtonLabel} onChange={(e) => setConfig((c) => ({ ...c, cancelButtonLabel: e.target.value }))} placeholder="Zrušit" /></label>
          </div>
        </div></div>
      </div>

      {/* Cena a platnost */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Cena a platnost</p>
          <div className="admin-grid">
            <label>Cena za noc (Kč)
              <input type="number" min={0} step={100} value={config.pricePerNight}
                onChange={(e) => setConfig((c) => ({ ...c, pricePerNight: Number(e.target.value) }))} />
            </label>
            <label>Platnost poukázky (měsíce)
              <input type="number" min={1} max={60} value={config.validityMonths}
                onChange={(e) => setConfig((c) => ({ ...c, validityMonths: Number(e.target.value) }))} />
            </label>
          </div>
        </div></div>
      </div>

      {/* Nabídka nocí */}
      <div className="admin-card">
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Nabídka počtu nocí</p>
          <div className="inline-editor-row" style={{ marginBottom: "16px" }}>
            <input type="number" min={1} max={365} value={newNight} onChange={(e) => setNewNight(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNightOption(); } }}
              placeholder="Přidat počet nocí…" style={{ maxWidth: "180px" }} />
            <button className="btn btn-secondary" onClick={addNightOption}>Přidat</button>
          </div>
          <div className="tag-list">
            {config.nightOptions.map((n) => (
              <span key={n} className="tag-chip">
                {n} {n === 1 ? "noc" : n < 5 ? "noci" : "nocí"} — {(n * pricePerNight).toLocaleString("cs-CZ")} Kč
                <button className="tag-chip-remove"
                  onClick={() => setConfig((c) => ({ ...c, nightOptions: c.nightOptions.filter((o) => o !== n) }))}>×</button>
              </span>
            ))}
          </div>
          {config.nightOptions.length === 0 && <div className="empty-hint">Žádné možnosti. Přidejte alespoň jednu.</div>}
        </div></div>
      </div>
      <ConfirmDialog />
    </div>
  );
}

// ── PermitFormEditor ──────────────────────────────────────────────────────────
function PermitFormEditor() {
  const [config, setConfig] = useState<PermitFormConfig>(newPermitFormConfig());
  const [original, setOriginal] = useState<PermitFormConfig>(newPermitFormConfig());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadPermitFormConfig().then((d) => { setConfig(d); setOriginal(d); }).finally(() => setLoading(false));
  }, []);

  const isDirty = useMemo(() => !isEqual(config, original), [config, original]);
  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };
  const handleSave = () => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(true);
        try { await savePermitFormConfig(config); setOriginal(config); showNotice("success", "Nastavení povolenky uloženo."); }
        catch { showNotice("error", "Chyba při ukládání."); }
        finally { setSaving(false); }
      },
    });
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const priceAdult = config.priceAdult;
  const priceFirefighter = config.priceFirefighter;
  const priceChildDisplay = config.priceChild === 0 ? "ZDARMA" : `${config.priceChild} Kč`;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Nastavení povolenky</div>
          <div className="page-desc">Texty formuláře, ceny, slevy a maximální počet osob.</div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      {/* Texty */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Texty formuláře</p>
          <div className="admin-grid">
            <label style={{ gridColumn: "1 / -1" }}>Nadpis modalu<input value={config.modalTitle} onChange={(e) => setConfig((c) => ({ ...c, modalTitle: e.target.value }))} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Popis pod nadpisem<textarea value={config.modalDesc} onChange={(e) => setConfig((c) => ({ ...c, modalDesc: e.target.value }))} rows={2} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Zpráva po rezervaci (úspěch)<input value={config.successMessage} onChange={(e) => setConfig((c) => ({ ...c, successMessage: e.target.value }))} /></label>
            <label>Text tlačítka Rezervovat<input value={config.payButtonLabel} onChange={(e) => setConfig((c) => ({ ...c, payButtonLabel: e.target.value }))} /></label>
            <label>Text tlačítka Zrušit<input value={config.cancelButtonLabel} onChange={(e) => setConfig((c) => ({ ...c, cancelButtonLabel: e.target.value }))} /></label>
          </div>
        </div></div>
      </div>

      {/* Ceny */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Ceník</p>
          <div className="admin-grid">
            <label>Cena pro dospělého (Kč/osoba)
              <input type="number" min={0} step={10} value={priceAdult}
                onChange={(e) => setConfig((c) => ({ ...c, priceAdult: Number(e.target.value) }))} />
            </label>
            <label>Max. počet osob v objednávce
              <input type="number" min={1} max={20} value={config.maxPersons}
                onChange={(e) => setConfig((c) => ({ ...c, maxPersons: Number(e.target.value) }))} />
            </label>
          </div>
          <div style={{ marginTop: "12px", padding: "12px 16px", background: "rgba(17,17,17,.04)", borderRadius: "10px", fontSize: "13px", color: "rgba(17,17,17,.55)" }}>
            Celková cena = počet osob × cena / osoba (pokud není aktivní sleva)
          </div>
        </div></div>
      </div>

      {/* Sleva — hasiči */}
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <label className="form-checkbox" style={{ marginBottom: "16px" }}>
            <input type="checkbox" checked={config.discountFirefighterEnabled}
              onChange={(e) => setConfig((c) => ({ ...c, discountFirefighterEnabled: e.target.checked }))} />
            <span style={{ fontWeight: 600 }}>Sleva — hasiči z Hojanovic</span>
          </label>
          {config.discountFirefighterEnabled && (
            <div className="admin-grid">
              <label>Popisek checkboxu ve formuláři<input value={config.discountFirefighterLabel}
                onChange={(e) => setConfig((c) => ({ ...c, discountFirefighterLabel: e.target.value }))} /></label>
              <label>Cena po slevě (Kč/osoba)
                <input type="number" min={0} step={5} value={priceFirefighter}
                  onChange={(e) => setConfig((c) => ({ ...c, priceFirefighter: Number(e.target.value) }))} />
              </label>
            </div>
          )}
          {config.discountFirefighterEnabled && (
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(17,17,17,.04)", borderRadius: "10px", fontSize: "13px", color: "rgba(17,17,17,.55)" }}>
              Plná cena: {priceAdult} Kč → sleva: {priceFirefighter} Kč/osoba
            </div>
          )}
        </div></div>
      </div>

      {/* Sleva — děti */}
      <div className="admin-card">
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <label className="form-checkbox" style={{ marginBottom: "16px" }}>
            <input type="checkbox" checked={config.discountChildEnabled}
              onChange={(e) => setConfig((c) => ({ ...c, discountChildEnabled: e.target.checked }))} />
            <span style={{ fontWeight: 600 }}>Sleva — děti z Hojanovic (zdarma)</span>
          </label>
          {config.discountChildEnabled && (
            <div className="admin-grid">
              <label>Popisek checkboxu ve formuláři<input value={config.discountChildLabel}
                onChange={(e) => setConfig((c) => ({ ...c, discountChildLabel: e.target.value }))} /></label>
              <label>Cena (Kč/osoba)
                <input type="number" min={0} step={5} value={config.priceChild}
                  onChange={(e) => setConfig((c) => ({ ...c, priceChild: Number(e.target.value) }))} />
              </label>
            </div>
          )}
          {config.discountChildEnabled && (
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(17,17,17,.04)", borderRadius: "10px", fontSize: "13px", color: "rgba(17,17,17,.55)" }}>
              Plná cena: {priceAdult} Kč → sleva: {priceChildDisplay}/osoba
            </div>
          )}
        </div></div>
      </div>
      <ConfirmDialog />
    </div>
  );
}

// ── Reusable single-image uploader ──────────────────────────────────────────
function ManagedImageUploader({
  image,
  folder,
  onUpload,
  onRemove,
  onNotice,
}: {
  image?: ManagedImage;
  folder: string;
  onUpload: (img: ManagedImage) => void;
  onRemove: () => void;
  onNotice: (type: "success" | "error", text: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      if (image?.storagePath) await removeHiveHouseImage(image.storagePath);
      const uploaded = await uploadHiveHouseImage(file, folder);
      onUpload(uploaded);
      onNotice("success", "Obrázek nahrán. Ulož změny.");
    } catch {
      onNotice("error", "Nahrání obrázku se nepodařilo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-gallery-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
      <article className="admin-gallery-tile">
        <div className="admin-gallery-frame">
          {image?.url
            ? <img className="admin-image-preview" src={image.url} alt="Obrázek" />
            : <div className="admin-image-placeholder"><Icon name="image" size={24} /></div>}
        </div>
        <div className="admin-gallery-actions">
          <label className={`admin-icon-button admin-file-trigger admin-icon-button-wide${uploading ? " is-busy" : ""}`}>
            <Icon name="upload" size={16} />
            <span>{uploading ? "Nahrávám…" : image?.url ? "Změnit" : "Nahrát"}</span>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; await handleUpload(f); e.target.value = ""; }} />
          </label>
          {image?.storagePath && (
            <button className="admin-icon-button danger" onClick={async () => {
              try { await removeHiveHouseImage(image.storagePath!); } catch { /* ok */ }
              onRemove();
              onNotice("success", "Obrázek odebrán.");
            }}>
              <Icon name="trash" size={16} />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

// ── FishingEditor ────────────────────────────────────────────────────────────
function FishingEditor() {
  const [content, setContent] = useState<FishingContent>(newFishingContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "info" | "gallery">("hero");
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadFishingContent().then((d) => setContent(d)).finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };

  const updateCard = (id: string, patch: Partial<FishingInfoCard>) =>
    setContent((c) => ({ ...c, infoCards: c.infoCards.map((card) => card.id === id ? { ...card, ...patch } : card) }));

  const handleSave = (section: "hero" | "info" | "gallery") => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(section);
        try {
          if (section === "hero") {
            await saveFishingHero({ heroEyebrow: content.heroEyebrow, heroTitle: content.heroTitle, heroHighlight: content.heroHighlight, heroDescription: content.heroDescription, heroImage: content.heroImage, ctaLabel: content.ctaLabel, ctaHref: content.ctaHref });
          }
          if (section === "info") {
            await saveFishingInfo({ infoCards: content.infoCards });
          }
          if (section === "gallery") {
            await saveFishingGallery({ gallery: content.gallery });
          }
          const labels: Record<string, string> = { hero: "Hero uložena.", info: "Info karty uloženy.", gallery: "Galerie uložena." };
          showNotice("success", labels[section]);
        } catch { showNotice("error", "Chyba při ukládání."); }
        finally { setSaving(null); }
      },
    });
  };

  const handleDeleteCard = (id: string) => {
    requestConfirm({
      title: "Smazat kartu?",
      message: "Karta bude odstraněna.",
      confirmLabel: "Smazat",
      tone: "danger",
      onConfirm: () => {
        setContent((c) => ({ ...c, infoCards: c.infoCards.filter((ic) => ic.id !== id) }));
      },
    });
  };

  const handleDeleteGalleryImage = (idx: number) => {
    requestConfirm({
      title: "Smazat obrázek?",
      message: "Obrázek bude odstraněn z galerie.",
      confirmLabel: "Smazat",
      tone: "danger",
      onConfirm: () => {
        setContent((c) => ({ ...c, gallery: c.gallery.filter((_, i) => i !== idx) }));
      },
    });
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const tabs = [
    { id: "hero" as const, label: "Hero" },
    { id: "info" as const, label: "Info karty" },
    { id: "gallery" as const, label: "Galerie" },
  ];

  return (
    <div>
      <div className="page-title">Rybaření</div>
      <div className="page-desc">Správa stránky rybaření — hero, info karty, galerie</div>

      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== HERO ===== */}
      {activeTab === "hero" && (
        <div className="admin-card">
          <div className="admin-card-body open"><div className="admin-card-body-inner">
            <h3 style={{ marginBottom: 16 }}>Hero sekce</h3>
            <div className="admin-grid">
              <label style={{ gridColumn: "1 / -1" }}>Eyebrow<input value={content.heroEyebrow} onChange={(e) => setContent((c) => ({ ...c, heroEyebrow: e.target.value }))} placeholder="Rybaření" /></label>
              <label>Hlavní nadpis<input value={content.heroTitle} onChange={(e) => setContent((c) => ({ ...c, heroTitle: e.target.value }))} /></label>
              <label>Zvýrazněná část<input value={content.heroHighlight} onChange={(e) => setContent((c) => ({ ...c, heroHighlight: e.target.value }))} /></label>
              <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={content.heroDescription} onChange={(e) => setContent((c) => ({ ...c, heroDescription: e.target.value }))} rows={3} /></label>
              <label>Text tlačítka CTA<input value={content.ctaLabel} onChange={(e) => setContent((c) => ({ ...c, ctaLabel: e.target.value }))} /></label>
              <label>Odkaz CTA<input value={content.ctaHref} onChange={(e) => setContent((c) => ({ ...c, ctaHref: e.target.value }))} /></label>
            </div>
            <div className="admin-subsection">
              <p className="admin-subsection-label">Pozadí fotka</p>
              <ManagedImageUploader image={content.heroImage} folder="fishing/hero" onUpload={(img) => setContent((c) => ({ ...c, heroImage: img }))} onRemove={() => setContent((c) => ({ ...c, heroImage: undefined }))} onNotice={showNotice} />
            </div>
            <div className="section-save-row">
              <button className="btn btn-primary" onClick={() => handleSave("hero")} disabled={saving !== null}>
                {saving === "hero" ? "Ukládám..." : "Uložit hero"}
              </button>
            </div>
          </div></div>
        </div>
      )}

      {/* ===== INFO KARTY ===== */}
      {activeTab === "info" && (
        <div className="admin-card">
          <div className="admin-card-body open"><div className="admin-card-body-inner">
            <h3 style={{ marginBottom: 16 }}>Info karty (oranžový pruh)</h3>
            {content.infoCards.map((card) => (
              <div key={card.id} className="inline-editor-row" style={{ marginBottom: "8px" }}>
                <input value={card.label} onChange={(e) => updateCard(card.id, { label: e.target.value })} placeholder="Popisek" style={{ flex: 1 }} />
                <input value={card.value} onChange={(e) => updateCard(card.id, { value: e.target.value })} placeholder="Hodnota" style={{ flex: 1 }} />
                <button className="admin-icon-button danger" onClick={() => handleDeleteCard(card.id)}><Icon name="trash" size={16} /></button>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
              <button className="btn btn-secondary" onClick={() => setContent((c) => ({ ...c, infoCards: [...c.infoCards, { id: `info-${Date.now()}`, label: "", value: "" }] }))}>+ Přidat kartu</button>
              <button className="btn btn-primary" onClick={() => handleSave("info")} disabled={saving !== null}>
                {saving === "info" ? "Ukládám..." : "Uložit info karty"}
              </button>
            </div>
          </div></div>
        </div>
      )}

      {/* ===== GALERIE ===== */}
      {activeTab === "gallery" && (
        <div className="admin-card">
          <div className="admin-card-body open"><div className="admin-card-body-inner">
            <h3 style={{ marginBottom: 16 }}>Galerie fotek</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              {content.gallery.map((img, idx) => (
                <div key={`gal-${idx}`} style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={img.url} alt={img.alt || ""} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                  <button
                    className="admin-icon-button danger"
                    style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}
                    onClick={() => handleDeleteGalleryImage(idx)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <ManagedImageUploader
              image={undefined}
              folder="fishing/gallery"
              onUpload={(img) => setContent((c) => ({ ...c, gallery: [...c.gallery, img] }))}
              onRemove={() => {}}
              onNotice={showNotice}
            />
            <div className="section-save-row">
              <button className="btn btn-primary" onClick={() => handleSave("gallery")} disabled={saving !== null}>
                {saving === "gallery" ? "Ukládám..." : "Uložit galerii"}
              </button>
            </div>
          </div></div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}

// ── ApiaryEditor ─────────────────────────────────────────────────────────────
function ApiaryEditor() {
  const [content, setContent] = useState<ApiaryContent>(newApiaryContent());
  const [original, setOriginal] = useState<ApiaryContent>(newApiaryContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "apitherapy" | "bee-living">("hero");
  const [productDraggingId, setProductDraggingId] = useState<string | null>(null);
  const [collapsedProducts, setCollapsedProducts] = useState<Set<string>>(() => new Set());
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadApiaryContent().then((d) => {
      setContent(d);
      setOriginal(d);
      setCollapsedProducts(new Set(d.apiTherapyProducts.map((p) => p.id)));
    }).finally(() => setLoading(false));
  }, []);

  // Accordion helper
  const toggleProduct = (id: string) => setCollapsedProducts((prev) => {
    const isOpen = !prev.has(id);
    if (isOpen) { const next = new Set(prev); next.add(id); return next; }
    const next = new Set(content.apiTherapyProducts.map((p) => p.id));
    next.delete(id);
    return next;
  });

  const isDirty = useMemo(() => !isEqual(content, original), [content, original]);
  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };

  type ApiarySection = "hero" | "bee-living" | "api-therapy" | "glamping" | "experience" | "gallery" | "all";
  const handleSave = (section: ApiarySection) => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: () => performApiarySave(section),
    });
  };
  const performApiarySave = async (section: ApiarySection) => {
    setSaving(section);
    try {
      if (section === "hero" || section === "all") {
        await saveApiaryHero({ heroEyebrow: content.heroEyebrow, heroTitle: content.heroTitle, heroHighlight: content.heroHighlight, heroDescription: content.heroDescription, heroImage: content.heroImage });
        setOriginal((p) => ({ ...p, heroEyebrow: content.heroEyebrow, heroTitle: content.heroTitle, heroHighlight: content.heroHighlight, heroDescription: content.heroDescription, heroImage: content.heroImage }));
      }
      if (section === "glamping" || section === "all") {
        await saveApiaryGlamping({ glampingTitle: content.glampingTitle, glampingSubtitle: content.glampingSubtitle, glampingCards: content.glampingCards });
        setOriginal((p) => ({ ...p, glampingTitle: content.glampingTitle, glampingSubtitle: content.glampingSubtitle, glampingCards: content.glampingCards }));
      }
      if (section === "bee-living" || section === "all") {
        await saveApiaryBeeLiving({ beeLivingTitle: content.beeLivingTitle, beeLivingHighlight: content.beeLivingHighlight, beeLivingText: content.beeLivingText, beeLivingImage: content.beeLivingImage });
        setOriginal((p) => ({ ...p, beeLivingTitle: content.beeLivingTitle, beeLivingHighlight: content.beeLivingHighlight, beeLivingText: content.beeLivingText, beeLivingImage: content.beeLivingImage }));
      }
      if (section === "api-therapy" || section === "all") {
        await saveApiaryApiTherapy({ apiTherapyTitle: content.apiTherapyTitle, apiTherapyHighlight: content.apiTherapyHighlight, apiTherapyText: content.apiTherapyText, apiTherapyImage: content.apiTherapyImage, apiTherapyProducts: content.apiTherapyProducts });
        setOriginal((p) => ({ ...p, apiTherapyTitle: content.apiTherapyTitle, apiTherapyHighlight: content.apiTherapyHighlight, apiTherapyText: content.apiTherapyText, apiTherapyImage: content.apiTherapyImage, apiTherapyProducts: content.apiTherapyProducts }));
      }
      if (section === "experience" || section === "all") {
        await saveApiaryExperience({ experienceEyebrow: content.experienceEyebrow, experienceTitle: content.experienceTitle, experienceHighlight: content.experienceHighlight, experienceIntro: content.experienceIntro, experienceSteps: content.experienceSteps });
        setOriginal((p) => ({ ...p, experienceEyebrow: content.experienceEyebrow, experienceTitle: content.experienceTitle, experienceHighlight: content.experienceHighlight, experienceIntro: content.experienceIntro, experienceSteps: content.experienceSteps }));
      }
      if (section === "gallery" || section === "all") {
        await saveApiaryGallery({ gallery: content.gallery });
        setOriginal((p) => ({ ...p, gallery: content.gallery }));
      }
      const labels: Record<ApiarySection, string> = { hero: "Hero uložena.", glamping: "Glamping uložen.", "bee-living": "Proč je Včelín výjimečný uloženo.", "api-therapy": "Apiterapie uložena.", experience: "Průběh zážitku uložen.", gallery: "Galerie uložena.", all: "Celý Včelín uložen." };
      showNotice("success", labels[section]);
    } catch { showNotice("error", "Chyba při ukládání."); }
    finally { setSaving(null); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const tabs = [
    { id: "hero"        as const, label: "Hero" },
    { id: "apitherapy"  as const, label: "Apiterapie" },
    { id: "bee-living"  as const, label: "Léčivé vlastnosti" },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Včelín & Glamping</div>
          <div className="page-desc">Správa stránky Včelín: hero, apiterapie, léčivé vlastnosti, průběh zážitku a galerie.</div>
        </div>
        <button className="btn btn-primary" onClick={() => handleSave("all")} disabled={saving !== null || !isDirty}>
          {saving === "all" ? "Ukládám…" : "Uložit vše"}
        </button>
      </div>

      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button key={tab.id} className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ HERO ══════════ */}
      {activeTab === "hero" && (
        <div className="admin-card">
          <div className="admin-card-body open"><div className="admin-card-body-inner">
            <div className="admin-grid">
              <label style={{ gridColumn: "1 / -1" }}>Eyebrow<input value={content.heroEyebrow} onChange={(e) => setContent((c) => ({ ...c, heroEyebrow: e.target.value }))} /></label>
              <label>Hlavní nadpis<input value={content.heroTitle} onChange={(e) => setContent((c) => ({ ...c, heroTitle: e.target.value }))} /></label>
              <label>Zvýrazněná část<input value={content.heroHighlight} onChange={(e) => setContent((c) => ({ ...c, heroHighlight: e.target.value }))} /></label>
              <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={content.heroDescription} onChange={(e) => setContent((c) => ({ ...c, heroDescription: e.target.value }))} rows={3} /></label>
            </div>
            <div className="admin-subsection">
              <p className="admin-subsection-label">Úvodní fotka (pozadí banneru)</p>
              <ManagedImageUploader image={content.heroImage} folder="apiary/hero" onUpload={(img) => setContent((c) => ({ ...c, heroImage: img }))} onRemove={() => setContent((c) => ({ ...c, heroImage: undefined }))} onNotice={showNotice} />
            </div>
            <div className="section-save-row">
              <button className="btn btn-secondary" onClick={() => handleSave("hero")} disabled={saving !== null}>
                {saving === "hero" ? "Ukládám…" : "Uložit hero"}
              </button>
            </div>
          </div></div>
        </div>
      )}

      {/* ══════════ CO JE APITERAPIE ══════════ */}
      {activeTab === "apitherapy" && (
        <div>
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-body open"><div className="admin-card-body-inner">
              <div className="admin-grid">
                <label>Nadpis<input value={content.apiTherapyTitle} onChange={(e) => setContent((c) => ({ ...c, apiTherapyTitle: e.target.value }))} placeholder="Co je apiterapie" /></label>
                <label>Eyebrow / zvýrazněná část<input value={content.apiTherapyHighlight} onChange={(e) => setContent((c) => ({ ...c, apiTherapyHighlight: e.target.value }))} placeholder="Léčba přírodou" /></label>
                <label style={{ gridColumn: "1 / -1" }}>Text / úvodní článek (odstavce oddělte prázdným řádkem)<textarea value={content.apiTherapyText} onChange={(e) => setContent((c) => ({ ...c, apiTherapyText: e.target.value }))} rows={6} /></label>
              </div>
              <div className="admin-subsection">
                <p className="admin-subsection-label">Obrázek sekce</p>
                <ManagedImageUploader image={content.apiTherapyImage} folder="apiary/api-therapy" onUpload={(img) => setContent((c) => ({ ...c, apiTherapyImage: img }))} onRemove={() => setContent((c) => ({ ...c, apiTherapyImage: undefined }))} onNotice={showNotice} />
              </div>
            </div></div>
          </div>

          {/* Včelí produkty — collapsible drag-and-drop karty */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <p className="admin-subsection-label" style={{ marginBottom: 4 }}>Včelí produkty</p>
              <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Přetažením řaďte. Kliknutím na hlavičku rozbalit/sbalit.</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => {
              const id = `prod-${Date.now()}`;
              setContent((c) => ({ ...c, apiTherapyProducts: [...c.apiTherapyProducts, { id, icon: "🍯", title: "", text: "" }] }));
              setCollapsedProducts(() => {
                const next = new Set(content.apiTherapyProducts.map((p) => p.id));
                next.delete(id);
                return next;
              });
            }}>+ Přidat produkt</button>
          </div>

          {content.apiTherapyProducts.map((product, idx) => {
            const isCollapsed = collapsedProducts.has(product.id);
            const handleProductDrop = (targetId: string) => {
              if (!productDraggingId || productDraggingId === targetId) return;
              const from = content.apiTherapyProducts.findIndex((p) => p.id === productDraggingId);
              const to = content.apiTherapyProducts.findIndex((p) => p.id === targetId);
              if (from < 0 || to < 0) return;
              setContent((c) => ({ ...c, apiTherapyProducts: moveItem(c.apiTherapyProducts, from, to) }));
              setProductDraggingId(null);
            };
            return (
              <article
                key={product.id}
                className={`admin-card draggable-card${productDraggingId === product.id ? " dragging" : ""}`}
                draggable
                onDragStart={() => setProductDraggingId(product.id)}
                onDragEnd={() => setProductDraggingId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleProductDrop(product.id)}
                style={{ marginBottom: 10, padding: 0, overflow: "hidden" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", userSelect: "none" }} onClick={() => toggleProduct(product.id)}>
                  <span className="drag-handle" onClick={(e) => e.stopPropagation()}>⋮⋮</span>
                  <span className="order-chip">{idx + 1}</span>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{product.icon || "🍯"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "rgba(17,17,17,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {product.title || "(bez názvu)"}
                    </div>
                  </div>
                  <button className="admin-icon-button danger" type="button" onClick={(e) => {
                    e.stopPropagation();
                    requestConfirm({
                      title: "Smazat produkt?",
                      message: "Karta produktu bude odstraněna.",
                      confirmLabel: "Smazat",
                      tone: "danger",
                      onConfirm: () => {
                        setContent((c) => ({ ...c, apiTherapyProducts: c.apiTherapyProducts.filter((_, i) => i !== idx) }));
                      },
                    });
                  }}><Icon name="trash" size={15} /></button>
                  <Icon name={isCollapsed ? "chevron-right" : "chevron-down"} size={16} />
                </div>
                {!isCollapsed && (
                  <div style={{ borderTop: "1px solid rgba(17,17,17,0.07)", padding: "16px" }}>
                    <div className="admin-grid">
                      <label style={{ maxWidth: 120 }}>Emoji<input value={product.icon} placeholder="🍯" style={{ textAlign: "center", fontSize: 20 }} onChange={(e) => {
                        const next = [...content.apiTherapyProducts];
                        next[idx] = { ...next[idx], icon: e.target.value };
                        setContent({ ...content, apiTherapyProducts: next });
                      }} /></label>
                      <label style={{ gridColumn: "span 2" }}>Název produktu<input value={product.title} placeholder="Med" onChange={(e) => {
                        const next = [...content.apiTherapyProducts];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setContent({ ...content, apiTherapyProducts: next });
                      }} /></label>
                      <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={product.text} rows={4} placeholder="Krátký popis produktu…" onChange={(e) => {
                        const next = [...content.apiTherapyProducts];
                        next[idx] = { ...next[idx], text: e.target.value };
                        setContent({ ...content, apiTherapyProducts: next });
                      }} /></label>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {content.apiTherapyProducts.length === 0 && <div className="empty-hint" style={{ padding: "32px 0" }}>Žádné produkty. Přidejte první.</div>}

          <div className="section-save-row" style={{ marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => handleSave("api-therapy")} disabled={saving !== null}>
              {saving === "api-therapy" ? "Ukládám…" : "Uložit apiterapii"}
            </button>
          </div>
        </div>
      )}

      {/* ══════════ LÉČIVÉ VLASTNOSTI VČEL ══════════ */}
      {activeTab === "bee-living" && (
        <div className="admin-card">
          <div className="admin-card-body open"><div className="admin-card-body-inner">
            <div className="admin-grid">
              <label>Nadpis<input value={content.beeLivingTitle} onChange={(e) => setContent((c) => ({ ...c, beeLivingTitle: e.target.value }))} placeholder="Léčivé vlastnosti včel" /></label>
              <label>Eyebrow / zvýrazněná část<input value={content.beeLivingHighlight} onChange={(e) => setContent((c) => ({ ...c, beeLivingHighlight: e.target.value }))} /></label>
              <label style={{ gridColumn: "1 / -1" }}>Text (odstavce oddělte prázdným řádkem)<textarea value={content.beeLivingText} onChange={(e) => setContent((c) => ({ ...c, beeLivingText: e.target.value }))} rows={8} /></label>
            </div>
            <div className="admin-subsection">
              <p className="admin-subsection-label">Obrázek sekce</p>
              <ManagedImageUploader image={content.beeLivingImage} folder="apiary/bee-living" onUpload={(img) => setContent((c) => ({ ...c, beeLivingImage: img }))} onRemove={() => setContent((c) => ({ ...c, beeLivingImage: undefined }))} onNotice={showNotice} />
            </div>
            <div className="section-save-row">
              <button className="btn btn-secondary" onClick={() => handleSave("bee-living")} disabled={saving !== null}>
                {saving === "bee-living" ? "Ukládám…" : "Uložit sekci"}
              </button>
            </div>
          </div></div>
        </div>
      )}


      <ConfirmDialog />
    </div>
  );
}

// ── ReviewsEditor ─────────────────────────────────────────────────────────────
function ReviewsEditor() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadReviews().then(setReviews).finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };

  const update = (id: string, patch: Partial<Review>) =>
    setReviews((rs) => rs.map((r) => r.id === id ? { ...r, ...patch } : r));

  const handleSave = (review: Review) => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(review.id);
        try { await saveReview(review); showNotice("success", "Recenze uložena."); }
        catch { showNotice("error", "Chyba při ukládání."); }
        finally { setSaving(null); }
      },
    });
  };

  const handleDelete = (id: string) => {
    requestConfirm({
      title: "Smazat recenzi?",
      message: "Recenze bude trvale odstraněna.",
      confirmLabel: "Smazat",
      tone: "danger",
      onConfirm: async () => {
        try { await deleteReview(id); setReviews((rs) => rs.filter((r) => r.id !== id)); showNotice("success", "Recenze smazána."); }
        catch { showNotice("error", "Chyba při mazání."); }
      },
    });
  };

  const toggleCollapse = (id: string) =>
    setCollapsed((c) => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addNew = async () => {
    const r = newReview(reviews.length);
    setReviews((rs) => [...rs, r]);
    setCollapsed((c) => { const n = new Set(c); n.delete(r.id); return n; });
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Recenze</div>
          <div className="page-desc">Správa recenzí zobrazovaných na webu.</div>
        </div>
        <button className="btn btn-primary" onClick={addNew}>+ Nová recenze</button>
      </div>
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}
      {reviews.length === 0 && <div style={{ color: "rgba(17,17,17,0.35)", fontSize: "14px", padding: "32px 0" }}>Žádné recenze. Přidejte první.</div>}
      {reviews.map((r) => {
        const isCollapsed = collapsed.has(r.id);
        return (
          <article key={r.id} className="admin-card">
            <div className="admin-card-head">
              <button className="admin-card-toggle" onClick={() => toggleCollapse(r.id)}>
                <div className="hh-status-dot" style={{ background: r.enabled ? "var(--red)" : "rgba(17,17,17,0.15)" }} />
                <div>
                  <h3>{r.author || "(bez jména)"} {"★".repeat(r.rating)}</h3>
                  {r.source && <p style={{ fontSize: "11px", color: "rgba(17,17,17,0.4)" }}>{r.source}</p>}
                </div>
                <span className={`admin-chevron${!isCollapsed ? " open" : ""}`}><Icon name="chevron-right" size={18} /></span>
              </button>
              <div className="admin-card-controls">
                <button className="btn btn-secondary" onClick={() => handleSave(r)} disabled={saving === r.id}>{saving === r.id ? "Ukládám..." : "Uložit"}</button>
                <button className="admin-remove" onClick={() => handleDelete(r.id)}>Smazat</button>
              </div>
            </div>
            {!isCollapsed && (
              <div className="admin-card-body open"><div className="admin-card-body-inner">
                <label className="form-checkbox" style={{ marginBottom: "20px" }}>
                  <input type="checkbox" checked={r.enabled} onChange={(e) => update(r.id, { enabled: e.target.checked })} />
                  <span>Zobrazit na webu</span>
                </label>
                <div className="admin-grid">
                  <label>Autor<input value={r.author} onChange={(e) => update(r.id, { author: e.target.value })} placeholder="Jan Novák" /></label>
                  <label>Zdroj<input value={r.source ?? ""} onChange={(e) => update(r.id, { source: e.target.value })} placeholder="Booking.com" /></label>
                  <label>Hodnocení (1–5)
                    <select value={r.rating} onChange={(e) => update(r.id, { rating: Number(e.target.value) as Review["rating"] })} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid var(--dark-16)", background: "var(--gray-light)" }}>
                      {([1,2,3,4,5] as const).map((v) => <option key={v} value={v}>{"★".repeat(v)} ({v})</option>)}
                    </select>
                  </label>
                  <label>Datum<input type="date" value={r.date} onChange={(e) => update(r.id, { date: e.target.value })} /></label>
                  <label style={{ gridColumn: "1 / -1" }}>Text recenze<textarea value={r.text} onChange={(e) => update(r.id, { text: e.target.value })} rows={4} placeholder="Text recenze od hosta…" /></label>
                </div>
              </div></div>
            )}
          </article>
        );
      })}
      <ConfirmDialog />
    </div>
  );
}

// ── ContactEditor ─────────────────────────────────────────────────────────────
function ContactEditor() {
  const [content, setContent] = useState<ContactContent>(newContactContent());
  const [original, setOriginal] = useState<ContactContent>(newContactContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadContactContent().then((d) => { setContent(d); setOriginal(d); }).finally(() => setLoading(false));
  }, []);

  const isDirty = useMemo(() => !isEqual(content, original), [content, original]);
  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text }); setTimeout(() => setNotice(null), 3000);
  };
  const handleSave = () => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(true);
        try { await saveContactContent(content); setOriginal(content); showNotice("success", "Kontakt uložen."); }
        catch { showNotice("error", "Chyba při ukládání."); }
        finally { setSaving(false); }
      },
    });
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Kontakt</div>
          <div className="page-desc">Kontaktní informace, provozní podmínky a informace o ubytování.</div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>
      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Kontaktní osoba</p>
          <div className="admin-grid">
            <label>Jméno<input value={content.contactName} onChange={(e) => setContent((c) => ({ ...c, contactName: e.target.value }))} placeholder="Jana Nováková" /></label>
            <label>Telefon<input value={content.phone} onChange={(e) => setContent((c) => ({ ...c, phone: e.target.value }))} placeholder="+420 123 456 789" /></label>
            <label>E-mail<input value={content.email} onChange={(e) => setContent((c) => ({ ...c, email: e.target.value }))} placeholder="info@hivehouse.cz" type="email" /></label>
          </div>
        </div></div>
      </div>

      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Firma a adresa</p>
          <div className="admin-grid">
            <label>Název firmy<input value={content.companyName} onChange={(e) => setContent((c) => ({ ...c, companyName: e.target.value }))} placeholder="2P s.r.o." /></label>
            <label>IČO<input value={content.ico} onChange={(e) => setContent((c) => ({ ...c, ico: e.target.value }))} placeholder="12345678" /></label>
            <label style={{ gridColumn: "1 / -1" }}>Adresa<input value={content.address} onChange={(e) => setContent((c) => ({ ...c, address: e.target.value }))} placeholder="Hojnovice 1, 338 05 Olešná" /></label>
          </div>
        </div></div>
      </div>

      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Podmínky ubytování</p>
          <div className="admin-grid">
            <label>Check-in<input value={content.checkIn} onChange={(e) => setContent((c) => ({ ...c, checkIn: e.target.value }))} placeholder="14:00" /></label>
            <label>Check-out<input value={content.checkOut} onChange={(e) => setContent((c) => ({ ...c, checkOut: e.target.value }))} placeholder="11:00" /></label>
            <label>Kapacita (osob)<input type="number" value={content.capacity} onChange={(e) => setContent((c) => ({ ...c, capacity: Number(e.target.value) }))} min={1} max={20} /></label>
          </div>
        </div></div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body open"><div className="admin-card-body-inner">
          <p className="admin-subsection-label" style={{ marginBottom: "16px" }}>Doplňující informace</p>
          <div className="admin-grid">
            <label style={{ gridColumn: "1 / -1" }}>Poznámky (interní)<textarea value={content.notes} onChange={(e) => setContent((c) => ({ ...c, notes: e.target.value }))} rows={3} placeholder="Interní poznámky…" /></label>
            <label style={{ gridColumn: "1 / -1" }}>Vložený odkaz na mapu (embed URL)<input value={content.mapEmbedUrl ?? ""} onChange={(e) => setContent((c) => ({ ...c, mapEmbedUrl: e.target.value }))} placeholder="https://maps.google.com/maps?..." /></label>
          </div>
        </div></div>
      </div>
      <ConfirmDialog />
    </div>
  );
}

// =====================================================================
// HOMEPAGE EDITOR
// =====================================================================

function HomepageEditor() {
  const [heroData, setHeroData] = useState<HomepageHero>(newHomepageHero);
  const [offeringsData, setOfferingsData] = useState<HomepageOfferings>(newHomepageOfferings);
  const [apitherapyData, setApitherapyData] = useState<HomepageApitherapy>(newHomepageApitherapy);
  const [trustbarData, setTrustbarData] = useState<HomepageTrustbar>(newHomepageTrustbar);
  const [reviewsCfg, setReviewsCfg] = useState<HomepageReviewsConfig>(newHomepageReviewsConfig);

  const [origHero, setOrigHero] = useState<HomepageHero>(newHomepageHero);
  const [origOfferings, setOrigOfferings] = useState<HomepageOfferings>(newHomepageOfferings);
  const [origApitherapy, setOrigApitherapy] = useState<HomepageApitherapy>(newHomepageApitherapy);
  const [origTrustbar, setOrigTrustbar] = useState<HomepageTrustbar>(newHomepageTrustbar);
  const [origReviewsCfg, setOrigReviewsCfg] = useState<HomepageReviewsConfig>(newHomepageReviewsConfig);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "offerings" | "apitherapy" | "trustbar" | "reviews">("hero");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [offerOpenId, setOfferOpenId] = useState<string | null>(null);
  const [offerDraggingId, setOfferDraggingId] = useState<string | null>(null);
  const [benefitDraggingId, setBenefitDraggingId] = useState<string | null>(null);
  const { requestConfirm, ConfirmDialog } = useConfirmDialog();

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      loadHomepageHero(),
      loadHomepageOfferings(),
      loadHomepageApitherapy(),
      loadHomepageTrustbar(),
      loadHomepageReviewsConfig(),
    ])
      .then(([h, o, a, t, r]) => {
        setHeroData(h); setOrigHero(h);
        setOfferingsData(o); setOrigOfferings(o);
        setApitherapyData(a); setOrigApitherapy(a);
        setTrustbarData(t); setOrigTrustbar(t);
        setReviewsCfg(r); setOrigReviewsCfg(r);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (section: string) => {
    requestConfirm({
      title: "Uložit změny?",
      message: "Změny se zapíšou do databáze.",
      confirmLabel: "Uložit",
      tone: "primary",
      onConfirm: async () => {
        setSaving(section);
        try {
          if (section === "hero") {
            await saveHomepageHero(heroData);
            setOrigHero(heroData);
          } else if (section === "offerings") {
            await saveHomepageOfferings(offeringsData);
            setOrigOfferings(offeringsData);
          } else if (section === "apitherapy") {
            await saveHomepageApitherapy(apitherapyData);
            setOrigApitherapy(apitherapyData);
          } else if (section === "trustbar") {
            await saveHomepageTrustbar(trustbarData);
            setOrigTrustbar(trustbarData);
          } else if (section === "reviews") {
            await saveHomepageReviewsConfig(reviewsCfg);
            setOrigReviewsCfg(reviewsCfg);
          }
          showNotice("success", "Uloženo.");
        } catch {
          showNotice("error", "Chyba při ukládání.");
        } finally {
          setSaving(null);
        }
      },
    });
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(`hero-img-${index}`);
    try {
      const result = await uploadHiveHouseImage(file, `homepage/hero/${Date.now()}-${file.name}`);
      const newImages = [...heroData.images];
      newImages[index] = { url: result.url, storagePath: result.storagePath, alt: newImages[index]?.alt || "" };
      setHeroData({ ...heroData, images: newImages });
    } catch { showNotice("error", "Chyba při nahrávání obrázku."); }
    finally { setUploadingField(null); }
  };

  const handleOfferingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(`offer-img-${cardId}`);
    try {
      const result = await uploadHiveHouseImage(file, `homepage/offerings/${Date.now()}-${file.name}`);
      setOfferingsData({
        ...offeringsData,
        cards: offeringsData.cards.map((c) =>
          c.id === cardId ? { ...c, image: { url: result.url, storagePath: result.storagePath } } : c,
        ),
      });
    } catch { showNotice("error", "Chyba při nahrávání."); }
    finally { setUploadingField(null); }
  };

  const handleApiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imageMain" | "imageSmall1" | "imageSmall2") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(`api-${field}`);
    try {
      const result = await uploadHiveHouseImage(file, `homepage/apitherapy/${Date.now()}-${file.name}`);
      setApitherapyData({ ...apitherapyData, [field]: { url: result.url, storagePath: result.storagePath } });
    } catch { showNotice("error", "Chyba při nahrávání."); }
    finally { setUploadingField(null); }
  };

  if (loading) return <div style={{ padding: 40, color: "rgba(17,17,17,0.4)" }}>Načítám homepage data...</div>;

  const tabs = [
    { id: "hero" as const, label: "Banner / Hero" },
    { id: "offerings" as const, label: "Co nabízíme" },
    { id: "apitherapy" as const, label: "Apiterapie" },
    { id: "trustbar" as const, label: "Trust bar (badges)" },
    { id: "reviews" as const, label: "Recenze (config)" },
  ];

  return (
    <div>
      <div className="page-title">Homepage</div>
      <div className="page-desc">Správa všech sekcí hlavní stránky</div>

      {notice && <div className={`notice-${notice.type}`}>{notice.text}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== HERO ===== */}
      {activeTab === "hero" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <h3 style={{ marginBottom: 16 }}>Banner / Hero sekce</h3>
              <div className="admin-grid">
                <label>Nadpis<input value={heroData.title} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} /></label>
                <label>Zvýrazněný text<input value={heroData.titleAccent} onChange={(e) => setHeroData({ ...heroData, titleAccent: e.target.value })} /></label>
                <label>Podnadpis (eyebrow)<input value={heroData.subtitle} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} /></label>
                <label style={{ gridColumn: "1 / -1" }}>Text<textarea value={heroData.text} onChange={(e) => setHeroData({ ...heroData, text: e.target.value })} rows={3} /></label>
                <label>CTA Rezervace - text<input value={heroData.ctaReserveLabel} onChange={(e) => setHeroData({ ...heroData, ctaReserveLabel: e.target.value })} /></label>
                <label>CTA Rezervace - odkaz<input value={heroData.ctaReserveHref} onChange={(e) => setHeroData({ ...heroData, ctaReserveHref: e.target.value })} /></label>
                <label>CTA Poukázka - text<input value={heroData.ctaVoucherLabel} onChange={(e) => setHeroData({ ...heroData, ctaVoucherLabel: e.target.value })} /></label>
              </div>

              <h4 style={{ marginTop: 24, marginBottom: 12 }}>Statistiky</h4>
              <div className="admin-grid">
                <label>Stat 1 - číslo<input value={heroData.stat1Num} onChange={(e) => setHeroData({ ...heroData, stat1Num: e.target.value })} /></label>
                <label>Stat 1 - popis<input value={heroData.stat1Label} onChange={(e) => setHeroData({ ...heroData, stat1Label: e.target.value })} /></label>
                <label>Stat 2 - číslo<input value={heroData.stat2Num} onChange={(e) => setHeroData({ ...heroData, stat2Num: e.target.value })} /></label>
                <label>Stat 2 - popis<input value={heroData.stat2Label} onChange={(e) => setHeroData({ ...heroData, stat2Label: e.target.value })} /></label>
                <label>Stat 3 - číslo<input value={heroData.stat3Num} onChange={(e) => setHeroData({ ...heroData, stat3Num: e.target.value })} /></label>
                <label>Stat 3 - popis<input value={heroData.stat3Label} onChange={(e) => setHeroData({ ...heroData, stat3Label: e.target.value })} /></label>
              </div>

              <h4 style={{ marginTop: 24, marginBottom: 12 }}>Obrázky na pozadí</h4>
              {heroData.images.map((img, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  {img.url && <img src={img.url} alt={img.alt || ""} style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 8 }} />}
                  <label style={{ flex: 1 }}>URL<input value={img.url} onChange={(e) => {
                    const newImages = [...heroData.images];
                    newImages[idx] = { ...newImages[idx], url: e.target.value };
                    setHeroData({ ...heroData, images: newImages });
                  }} /></label>
                  <label>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleHeroImageUpload(e, idx)} />
                    <span className="btn btn-secondary" style={{ cursor: "pointer" }}>
                      {uploadingField === `hero-img-${idx}` ? "..." : "Nahrát"}
                    </span>
                  </label>
                  <button className="admin-remove" onClick={() => {
                    const newImages = heroData.images.filter((_, i) => i !== idx);
                    setHeroData({ ...heroData, images: newImages });
                  }}>X</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={() => setHeroData({ ...heroData, images: [...heroData.images, { url: "", alt: "" }] })}>
                + Přidat obrázek
              </button>

              <div style={{ marginTop: 24, textAlign: "right" }}>
                <button className="btn btn-primary" onClick={() => handleSave("hero")} disabled={saving === "hero" || isEqual(heroData, origHero)}>
                  {saving === "hero" ? "Ukládám..." : "Uložit Banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CO NABÍZÍME ===== */}
      {activeTab === "offerings" && (
        <div>
          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-body open">
              <div className="admin-card-body-inner">
                <h3 style={{ marginBottom: 16 }}>Sekce "Co nabízíme"</h3>
                <div className="admin-grid">
                  <label>Eyebrow<input value={offeringsData.sectionEyebrow} onChange={(e) => setOfferingsData({ ...offeringsData, sectionEyebrow: e.target.value })} /></label>
                  <label>Nadpis<input value={offeringsData.sectionTitle} onChange={(e) => setOfferingsData({ ...offeringsData, sectionTitle: e.target.value })} /></label>
                  <label>Zvýrazněný text<input value={offeringsData.sectionTitleAccent} onChange={(e) => setOfferingsData({ ...offeringsData, sectionTitleAccent: e.target.value })} /></label>
                  <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={offeringsData.sectionDesc} onChange={(e) => setOfferingsData({ ...offeringsData, sectionDesc: e.target.value })} rows={2} /></label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-between" style={{ marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>Karty ({offeringsData.cards.length})</h4>
            <button className="btn btn-secondary" onClick={() => {
              const newCard: HomepageOfferingCard = {
                id: `offer-${Date.now()}`,
                sortOrder: offeringsData.cards.length,
                title: "", description: "", eyebrow: "", linkHref: "", ctaLabel: "Zjistit více",
              };
              setOfferingsData({ ...offeringsData, cards: [...offeringsData.cards, newCard] });
              setOfferOpenId(newCard.id);
            }}>+ Přidat kartu</button>
          </div>

          {offeringsData.cards.map((card) => {
            const isOpen = offerOpenId === card.id;
            return (
              <article
                key={card.id}
                className={`admin-card draggable-card${offerDraggingId === card.id ? " dragging" : ""}`}
                style={{ marginBottom: 8 }}
                draggable
                onDragStart={() => setOfferDraggingId(card.id)}
                onDragEnd={() => setOfferDraggingId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!offerDraggingId || offerDraggingId === card.id) return;
                  const from = offeringsData.cards.findIndex((c) => c.id === offerDraggingId);
                  const to = offeringsData.cards.findIndex((c) => c.id === card.id);
                  if (from < 0 || to < 0) return;
                  setOfferingsData({ ...offeringsData, cards: moveItem(offeringsData.cards, from, to).map((c, i) => ({ ...c, sortOrder: i })) });
                  setOfferDraggingId(null);
                }}
              >
                <div className="admin-card-head">
                  <button className="admin-card-toggle" onClick={() => setOfferOpenId(isOpen ? null : card.id)}>
                    <span className="drag-handle" title="Přetáhnout">⋮⋮</span>
                    <div>
                      <h3>{card.title || "(bez názvu)"}</h3>
                    </div>
                    <span className={`admin-chevron${isOpen ? " open" : ""}`}>
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </button>
                  <div className="admin-card-controls">
                    <button className="admin-remove" onClick={() => {
                      if (isOpen) setOfferOpenId(null);
                      setOfferingsData({ ...offeringsData, cards: offeringsData.cards.filter((c) => c.id !== card.id).map((c, i) => ({ ...c, sortOrder: i })) });
                    }}>Smazat</button>
                  </div>
                </div>

                {isOpen && (
                  <div className="admin-card-body open">
                    <div className="admin-card-body-inner">
                      <div className="admin-grid">
                        <label>Nadpis<input value={card.title} onChange={(e) => {
                          setOfferingsData({ ...offeringsData, cards: offeringsData.cards.map((c) => c.id === card.id ? { ...c, title: e.target.value } : c) });
                        }} /></label>
                        <label>Badge (eyebrow)<input value={card.eyebrow} onChange={(e) => {
                          setOfferingsData({ ...offeringsData, cards: offeringsData.cards.map((c) => c.id === card.id ? { ...c, eyebrow: e.target.value } : c) });
                        }} /></label>
                        <label>Odkaz<input value={card.linkHref} onChange={(e) => {
                          setOfferingsData({ ...offeringsData, cards: offeringsData.cards.map((c) => c.id === card.id ? { ...c, linkHref: e.target.value } : c) });
                        }} /></label>
                        <label>Text CTA<input value={card.ctaLabel} onChange={(e) => {
                          setOfferingsData({ ...offeringsData, cards: offeringsData.cards.map((c) => c.id === card.id ? { ...c, ctaLabel: e.target.value } : c) });
                        }} /></label>
                        <label style={{ gridColumn: "1 / -1" }}>Popis<textarea value={card.description} onChange={(e) => {
                          setOfferingsData({ ...offeringsData, cards: offeringsData.cards.map((c) => c.id === card.id ? { ...c, description: e.target.value } : c) });
                        }} rows={2} /></label>
                      </div>

                      <div className="admin-subsection" style={{ marginTop: 12 }}>
                        <p className="admin-subsection-label">Obrázek</p>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          {card.image?.url && <img src={card.image.url} alt={card.title} style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 8 }} />}
                          <label>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleOfferingImageUpload(e, card.id)} />
                            <span className="btn btn-secondary" style={{ cursor: "pointer" }}>
                              {uploadingField === `offer-img-${card.id}` ? "..." : "Nahrát"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          <div style={{ marginTop: 20, textAlign: "right" }}>
            <button className="btn btn-primary" onClick={() => handleSave("offerings")} disabled={saving === "offerings" || isEqual(offeringsData, origOfferings)}>
              {saving === "offerings" ? "Ukládám..." : "Uložit Co nabízíme"}
            </button>
          </div>
        </div>
      )}

      {/* ===== APITERAPIE ===== */}
      {activeTab === "apitherapy" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <h3 style={{ marginBottom: 16 }}>Sekce Apiterapie</h3>
              <div className="admin-grid">
                <label>Eyebrow<input value={apitherapyData.eyebrow} onChange={(e) => setApitherapyData({ ...apitherapyData, eyebrow: e.target.value })} /></label>
                <label>Nadpis<input value={apitherapyData.title} onChange={(e) => setApitherapyData({ ...apitherapyData, title: e.target.value })} /></label>
                <label>Zvýrazněný text<input value={apitherapyData.titleAccent} onChange={(e) => setApitherapyData({ ...apitherapyData, titleAccent: e.target.value })} /></label>
                <label style={{ gridColumn: "1 / -1" }}>Text 1<textarea value={apitherapyData.text1} onChange={(e) => setApitherapyData({ ...apitherapyData, text1: e.target.value })} rows={4} /></label>
                <label style={{ gridColumn: "1 / -1" }}>Text 2<textarea value={apitherapyData.text2} onChange={(e) => setApitherapyData({ ...apitherapyData, text2: e.target.value })} rows={4} /></label>
                <label>CTA primární - text<input value={apitherapyData.ctaPrimaryLabel} onChange={(e) => setApitherapyData({ ...apitherapyData, ctaPrimaryLabel: e.target.value })} /></label>
                <label>CTA primární - odkaz<input value={apitherapyData.ctaPrimaryHref} onChange={(e) => setApitherapyData({ ...apitherapyData, ctaPrimaryHref: e.target.value })} /></label>
                <label>CTA sekundární - text<input value={apitherapyData.ctaSecondaryLabel} onChange={(e) => setApitherapyData({ ...apitherapyData, ctaSecondaryLabel: e.target.value })} /></label>
                <label>CTA sekundární - odkaz<input value={apitherapyData.ctaSecondaryHref} onChange={(e) => setApitherapyData({ ...apitherapyData, ctaSecondaryHref: e.target.value })} /></label>
              </div>

              <div className="admin-subsection" style={{ marginTop: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p className="admin-subsection-label" style={{ marginBottom: 4 }}>Benefity ({apitherapyData.benefits.length})</p>
                    <p style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>Přetažením řaďte. Emoji jako ikona (🐝 💛 ✨).</p>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={() => {
                    setApitherapyData({ ...apitherapyData, benefits: [...apitherapyData.benefits, { id: `b${Date.now()}`, icon: "🐝", text: "" }] });
                  }}>+ Přidat</button>
                </div>

                {apitherapyData.benefits.map((b, idx) => {
                  const handleBenefitDrop = (targetId: string) => {
                    if (!benefitDraggingId || benefitDraggingId === targetId) return;
                    const from = apitherapyData.benefits.findIndex((x) => x.id === benefitDraggingId);
                    const to = apitherapyData.benefits.findIndex((x) => x.id === targetId);
                    if (from < 0 || to < 0) return;
                    setApitherapyData({ ...apitherapyData, benefits: moveItem(apitherapyData.benefits, from, to) });
                    setBenefitDraggingId(null);
                  };
                  return (
                    <article
                      key={b.id}
                      className={`draggable-card${benefitDraggingId === b.id ? " dragging" : ""}`}
                      draggable
                      onDragStart={() => setBenefitDraggingId(b.id)}
                      onDragEnd={() => setBenefitDraggingId(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleBenefitDrop(b.id)}
                      style={{ marginBottom: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "auto auto auto 1fr auto", gap: 12, alignItems: "center" }}
                    >
                      <span className="drag-handle" style={{ flexShrink: 0 }}>⋮⋮</span>
                      <span className="order-chip" style={{ flexShrink: 0 }}>{idx + 1}</span>
                      <input
                        value={b.icon}
                        placeholder="🐝"
                        style={{ width: 56, textAlign: "center", fontSize: 20, padding: "8px 4px", borderRadius: 10, border: "1.5px solid rgba(17,17,17,0.1)" }}
                        onChange={(e) => {
                          const nb = [...apitherapyData.benefits];
                          nb[idx] = { ...nb[idx], icon: e.target.value };
                          setApitherapyData({ ...apitherapyData, benefits: nb });
                        }}
                      />
                      <input
                        value={b.text}
                        placeholder="Krátký popis benefitu…"
                        onChange={(e) => {
                          const nb = [...apitherapyData.benefits];
                          nb[idx] = { ...nb[idx], text: e.target.value };
                          setApitherapyData({ ...apitherapyData, benefits: nb });
                        }}
                      />
                      <button className="admin-icon-button danger" onClick={() => {
                        requestConfirm({
                          title: "Smazat benefit?",
                          message: "Benefit bude odstraněn.",
                          confirmLabel: "Smazat",
                          tone: "danger",
                          onConfirm: () => {
                            setApitherapyData({ ...apitherapyData, benefits: apitherapyData.benefits.filter((_, i) => i !== idx) });
                          },
                        });
                      }}><Icon name="trash" size={14} /></button>
                    </article>
                  );
                })}
                {apitherapyData.benefits.length === 0 && <div className="empty-hint">Žádné benefity.</div>}
              </div>

              <h4 style={{ marginTop: 24, marginBottom: 12 }}>Obrázky</h4>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {(["imageMain", "imageSmall1", "imageSmall2"] as const).map((field) => (
                  <div key={field}>
                    <div style={{ fontSize: 13, marginBottom: 4, color: "rgba(17,17,17,0.5)" }}>
                      {field === "imageMain" ? "Hlavní" : field === "imageSmall1" ? "Malý 1" : "Malý 2"}
                    </div>
                    {apitherapyData[field]?.url && <img src={apitherapyData[field]!.url} alt="" style={{ width: 100, height: 64, objectFit: "cover", borderRadius: 8 }} />}
                    <label>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleApiImageUpload(e, field)} />
                      <span className="btn btn-secondary" style={{ cursor: "pointer", display: "block", marginTop: 4 }}>
                        {uploadingField === `api-${field}` ? "..." : "Nahrát"}
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, textAlign: "right" }}>
                <button className="btn btn-primary" onClick={() => handleSave("apitherapy")} disabled={saving === "apitherapy" || isEqual(apitherapyData, origApitherapy)}>
                  {saving === "apitherapy" ? "Ukládám..." : "Uložit Apiterapii"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TRUST BAR ===== */}
      {activeTab === "trustbar" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <h3 style={{ marginBottom: 8 }}>Trust bar — běžící badges</h3>
              <p style={{ color: "rgba(17,17,17,0.5)", fontSize: 13, marginBottom: 16 }}>
                Textové štítky, které běží v pruhu pod hero sekcí.
              </p>

              <div className="tag-list" style={{ marginBottom: 16 }}>
                {trustbarData.items.map((item, idx) => (
                  <span key={idx} className="tag-chip">
                    {item}
                    <button className="tag-chip-remove" onClick={() => {
                      setTrustbarData({ ...trustbarData, items: trustbarData.items.filter((_, i) => i !== idx) });
                    }}><Icon name="close" size={12} /></button>
                  </span>
                ))}
              </div>

              <div className="inline-editor-row">
                <input
                  placeholder="Nový badge..."
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      setTrustbarData({ ...trustbarData, items: [...trustbarData.items, val] });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button className="btn btn-secondary" type="button" onClick={(e) => {
                  const input = (e.currentTarget.previousSibling as HTMLInputElement);
                  const val = input.value.trim();
                  if (val) {
                    setTrustbarData({ ...trustbarData, items: [...trustbarData.items, val] });
                    input.value = "";
                  }
                }}>Přidat</button>
              </div>

              <div style={{ marginTop: 24, textAlign: "right" }}>
                <button className="btn btn-primary" onClick={() => handleSave("trustbar")} disabled={saving === "trustbar" || isEqual(trustbarData, origTrustbar)}>
                  {saving === "trustbar" ? "Ukládám..." : "Uložit Trust bar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== RECENZE CONFIG ===== */}
      {activeTab === "reviews" && (
        <div className="admin-card">
          <div className="admin-card-body open">
            <div className="admin-card-body-inner">
              <h3 style={{ marginBottom: 16 }}>Konfigurace recenzí</h3>
              <p style={{ color: "rgba(17,17,17,0.5)", fontSize: 14, marginBottom: 16 }}>
                Recenze se spravují v sekci "Recenze". Zde nastavíte kolik se jich zobrazí na homepage.
              </p>
              <label>Počet zobrazených recenzí
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={reviewsCfg.displayCount}
                  onChange={(e) => setReviewsCfg({ displayCount: Math.max(1, parseInt(e.target.value) || 5) })}
                  style={{ width: 100 }}
                />
              </label>

              <div style={{ marginTop: 24, textAlign: "right" }}>
                <button className="btn btn-primary" onClick={() => handleSave("reviews")} disabled={saving === "reviews" || isEqual(reviewsCfg, origReviewsCfg)}>
                  {saving === "reviews" ? "Ukládám..." : "Uložit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}

export function HiveHouseAdmin({ userEmail, onBack, initialSection = "dashboard", onSectionChange }: Props) {
  const [section, setSection] = useState<AdminSection>(initialSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [permits, setPermits] = useState<FishingPermit[]>([]);
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);

  useEffect(() => {
    const unsub = subscribePromotions(setPromotions);
    return () => unsub();
  }, []);

  useEffect(() => {
    loadPermits().then(setPermits);
    loadVouchers().then(setVouchers);
  }, []);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    onSectionChange?.(section);
  }, [section, onSectionChange]);

  return (
    <div className="moment-shell">
      <Sidebar
        section={section}
        onSection={setSection}
        userEmail={userEmail}
        onBack={onBack}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="moment-main">
        <div className="moment-mobile-bar">
          <button className="hamburger" onClick={() => setSidebarOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>

        <div className="moment-content">
          {section === "dashboard" && <Dashboard promotions={promotions} permits={permits} vouchers={vouchers} />}
          {section === "homepage" && <HomepageEditor />}
          {section === "promotions" && <PromotionsEditor promotions={promotions} />}
          {section === "room" && <RoomEditor />}
          {section === "fishing" && <FishingEditor />}
          {section === "apiary" && <ApiaryEditor />}
          {section === "reviews" && <ReviewsEditor />}
          {section === "contact" && <ContactEditor />}
          {section === "voucher-config" && <VoucherFormEditor />}
          {section === "vouchers" && <VouchersManager />}
          {section === "permit-config" && <PermitFormEditor />}
          {section === "permits" && <PermitsManager />}
          {section === "statistics" && <Statistics permits={permits} vouchers={vouchers} />}
        </div>
      </div>
    </div>
  );
}

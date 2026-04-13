import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import type {
  AdminSection,
  FishingPermit,
  GiftVoucher,
  Promotion,
  RoomContent,
  SurroundingPlace,
} from "../types";
import {
  deletePromotion,
  deleteSurroundingPlace,
  loadPermits,
  loadRoomContent,
  loadSurroundingPlaces,
  loadVouchers,
  newPromotion,
  newRoomContent,
  newSurroundingPlace,
  reorderSurroundingPlaces,
  savePromotion,
  saveRoomContent,
  saveSurroundingPlace,
  subscribePromotions,
  updatePermitStatus,
  updateVoucherStatus,
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

function parseCommaValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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
  const navItems: { id: AdminSection; label: string; icon: string }[] = [
    { id: "dashboard", label: "Přehled", icon: "📊" },
    { id: "promotions", label: "Sezonní akce", icon: "🎁" },
    { id: "surroundings", label: "Místa v okolí", icon: "🗺️" },
    { id: "room", label: "Správa pokoje", icon: "🛏️" },
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
        const isDirty = !isEqual(p, orig);

        return (
          <div key={p.id} className={`admin-card${isCollapsed ? " collapsed" : ""}`}>
            <div className="admin-card-header" onClick={() => toggleCollapse(p.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.enabled ? "var(--honey)" : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <h3>{p.title || "(bez názvu)"}</h3>
                {isDirty && <span style={{ fontSize: "11px", color: "var(--honey)", letterSpacing: "0.5px" }}>● Neuloženo</span>}
              </div>
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-secondary" onClick={() => handleSave(p)} disabled={saving === p.id || !isDirty} style={{ fontSize: "12px", padding: "6px 14px" }}>
                  {saving === p.id ? "Ukládám..." : "Uložit"}
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(p.id)} style={{ fontSize: "12px", padding: "6px 14px" }}>
                  Smazat
                </button>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: "row", marginBottom: "16px" }}>
                <label className="form-checkbox" style={{ margin: 0 }}>
                  <input type="checkbox" checked={p.enabled} onChange={(e) => update(p.id, { enabled: e.target.checked })} />
                  <span>Zobrazit na webu</span>
                </label>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Badge (štítek)</label>
                  <input value={p.badge} onChange={(e) => update(p.id, { badge: e.target.value })} placeholder="Jarní akce" />
                </div>
                <div className="form-group">
                  <label>Název akce</label>
                  <input value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} placeholder="Sleva 20 % na víkend" />
                </div>
              </div>

              <div className="form-group">
                <label>Popis</label>
                <textarea value={p.text} onChange={(e) => update(p.id, { text: e.target.value })} placeholder="Popis akce pro hosty..." rows={2} />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Text tlačítka</label>
                  <input value={p.ctaLabel} onChange={(e) => update(p.id, { ctaLabel: e.target.value })} placeholder="Rezervovat" />
                </div>
                <div className="form-group">
                  <label>Odkaz tlačítka</label>
                  <input value={p.ctaHref} onChange={(e) => update(p.id, { ctaHref: e.target.value })} placeholder="/rezervace" />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Platí od (nepovinné)</label>
                  <input type="date" value={p.startsAt ?? ""} onChange={(e) => update(p.id, { startsAt: e.target.value || undefined })} />
                </div>
                <div className="form-group">
                  <label>Platí do (nepovinné)</label>
                  <input type="date" value={p.endsAt ?? ""} onChange={(e) => update(p.id, { endsAt: e.target.value || undefined })} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SurroundingsEditor() {
  const [places, setPlaces] = useState<SurroundingPlace[]>([]);
  const [originals, setOriginals] = useState<Record<string, SurroundingPlace>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadSurroundingPlaces()
      .then((items) => {
        setPlaces(items);
        setOriginals(Object.fromEntries(items.map((item) => [item.id, item])));
      })
      .finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const update = (id: string, patch: Partial<SurroundingPlace>) => {
    setPlaces((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addNew = () => {
    const item = newSurroundingPlace(places.length);
    setPlaces((items) => [...items, item]);
    setCollapsed((current) => {
      const next = new Set(current);
      next.delete(item.id);
      return next;
    });
  };

  const handleSave = async (place: SurroundingPlace) => {
    setSaving(place.id);
    try {
      await saveSurroundingPlace(place);
      setOriginals((current) => ({ ...current, [place.id]: place }));
      showNotice("success", "Místo v okolí uloženo.");
    } catch {
      showNotice("error", "Chyba při ukládání místa.");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat toto místo v okolí?")) return;

    const existsInDb = Boolean(originals[id]);
    const placeToDelete = places.find((item) => item.id === id);
    if (placeToDelete?.imageStoragePath) {
      try {
        await removeHiveHouseImage(placeToDelete.imageStoragePath);
      } catch {
        // Keep admin flow resilient if file is already gone.
      }
    }

    setPlaces((items) => items.filter((item) => item.id !== id).map((item, index) => ({ ...item, sortOrder: index })));

    if (!existsInDb) return;

    try {
      await deleteSurroundingPlace(id);
      setOriginals((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      showNotice("success", "Místo smazáno.");
    } catch {
      showNotice("error", "Chyba při mazání místa.");
    }
  };

  const persistOrder = async (items: SurroundingPlace[]) => {
    try {
      await reorderSurroundingPlaces(items);
      setOriginals(Object.fromEntries(items.map((item) => [item.id, item])));
      showNotice("success", "Pořadí míst bylo uloženo.");
    } catch {
      showNotice("error", "Chyba při ukládání pořadí.");
    }
  };

  const handleDrop = async (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;

    const fromIndex = places.findIndex((item) => item.id === draggingId);
    const toIndex = places.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = moveItem(places, fromIndex, toIndex).map((item, index) => ({ ...item, sortOrder: index }));
    setPlaces(reordered);
    setDraggingId(null);
    await persistOrder(reordered);
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const uploadPlaceImage = async (place: SurroundingPlace, file: File) => {
    setUploadingId(place.id);
    try {
      if (place.imageStoragePath) {
        await removeHiveHouseImage(place.imageStoragePath);
      }
      const uploaded = await uploadHiveHouseImage(file, `surroundings/${place.title || place.id}`);
      update(place.id, {
        imageUrl: uploaded.url,
        imageStoragePath: uploaded.storagePath,
      });
      showNotice("success", "Obrázek místa byl nahrán. Potvrď ho uložením.");
    } catch {
      showNotice("error", "Nahrání obrázku se nepodařilo.");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Místa v okolí</div>
          <div className="page-desc">Správa obsahu pro stránku okolí. Přidávejte, upravujte, mažte a řaďte položky drag and drop.</div>
        </div>
        <button className="btn btn-primary" onClick={addNew}>+ Nové místo</button>
      </div>

      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

      {places.length === 0 && (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", padding: "32px 0" }}>
          Žádná místa v okolí. Přidejte první položku.
        </div>
      )}

      {places.map((place, index) => {
        const isCollapsed = collapsed.has(place.id);
        const isDirty = !isEqual(place, originals[place.id]);

        return (
          <div
            key={place.id}
            className={`admin-card draggable-card${draggingId === place.id ? " dragging" : ""}`}
            draggable
            onDragStart={() => setDraggingId(place.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => void handleDrop(place.id)}
          >
            <div className="admin-card-header" onClick={() => toggleCollapse(place.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <span className="drag-handle" title="Přetáhnout">⋮⋮</span>
                <span className="order-chip">{index + 1}</span>
                <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{place.title || "(bez názvu)"}</h3>
                {isDirty && <span style={{ fontSize: "11px", color: "var(--honey)", letterSpacing: "0.5px" }}>● Neuloženo</span>}
              </div>
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-secondary" onClick={() => handleSave(place)} disabled={saving === place.id || !isDirty} style={{ fontSize: "12px", padding: "6px 14px" }}>
                  {saving === place.id ? "Ukládám..." : "Uložit"}
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(place.id)} style={{ fontSize: "12px", padding: "6px 14px" }}>
                  Smazat
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="admin-card-body">
                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: "row", marginBottom: "16px" }}>
                  <label className="form-checkbox" style={{ margin: 0 }}>
                    <input type="checkbox" checked={place.enabled} onChange={(e) => update(place.id, { enabled: e.target.checked })} />
                    <span>Zobrazit na webu</span>
                  </label>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Název</label>
                    <input value={place.title} onChange={(e) => update(place.id, { title: e.target.value })} placeholder="Vodní nádrž Švihov" />
                  </div>
                  <div className="form-group">
                    <label>Podtitulek</label>
                    <input value={place.subtitle} onChange={(e) => update(place.id, { subtitle: e.target.value })} placeholder="Krátký výlet" />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Vzdálenost / čas</label>
                    <input value={place.distance} onChange={(e) => update(place.id, { distance: e.target.value })} placeholder="15 min autem" />
                  </div>
                  <div className="form-group">
                    <label>Odkaz</label>
                    <input value={place.linkHref} onChange={(e) => update(place.id, { linkHref: e.target.value })} placeholder="/vylety" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Popis</label>
                  <textarea value={place.description} onChange={(e) => update(place.id, { description: e.target.value })} rows={3} placeholder="Krátký popis místa a proč se sem vydat..." />
                </div>

                <div className="form-group">
                  <label>Obrázek (URL)</label>
                  <input value={place.imageUrl} onChange={(e) => update(place.id, { imageUrl: e.target.value })} placeholder="https://..." />
                </div>

                <div className="upload-card">
                  <div className="image-row-preview">
                    {place.imageUrl ? <img src={place.imageUrl} alt={place.title || "Místo v okolí"} /> : <div className="image-placeholder-box">Bez obrázku</div>}
                    <span>{place.imageUrl || "Po nahrání se sem propíše veřejná URL z Firebase Storage."}</span>
                  </div>
                  <div className="upload-card-actions">
                    <label className={`btn btn-secondary file-upload-btn${uploadingId === place.id ? " is-busy" : ""}`}>
                      {uploadingId === place.id ? "Nahrávám..." : "Nahrát obrázek"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          await uploadPlaceImage(place, file);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {place.imageStoragePath && (
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={async () => {
                          try {
                            await removeHiveHouseImage(place.imageStoragePath);
                            update(place.id, { imageUrl: "", imageStoragePath: "" });
                            showNotice("success", "Obrázek místa byl odebrán.");
                          } catch {
                            showNotice("error", "Obrázek se nepodařilo odebrat.");
                          }
                        }}
                      >
                        Smazat obrázek
                      </button>
                    )}
                  </div>
                  <div className="storage-path-chip">{place.imageStoragePath || "Storage path zatím není k dispozici."}</div>
                </div>

                <div className="form-group">
                  <label>Štítky (oddělené čárkou)</label>
                  <input value={place.tags.join(", ")} onChange={(e) => update(place.id, { tags: parseCommaValues(e.target.value) })} placeholder="výlet, příroda, památka" />
                </div>

                {place.tags.length > 0 && (
                  <div className="tag-list">
                    {place.tags.map((tag) => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoomEditor() {
  const [room, setRoom] = useState<RoomContent>(newRoomContent());
  const [originalRoom, setOriginalRoom] = useState<RoomContent>(newRoomContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [isAddingImage, setIsAddingImage] = useState(false);

  useEffect(() => {
    loadRoomContent()
      .then((data) => {
        setRoom(data);
        setOriginalRoom(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const showNotice = (type: "success" | "error", text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const isDirty = useMemo(() => !isEqual(room, originalRoom), [room, originalRoom]);

  const addLabel = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    setRoom((current) => ({ ...current, labels: [...current.labels, trimmed] }));
    setNewLabel("");
  };

  const moveLabel = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= room.labels.length) return;
    setRoom((current) => ({ ...current, labels: moveItem(current.labels, index, nextIndex) }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= room.images.length) return;
    setRoom((current) => ({ ...current, images: moveItem(current.images, index, nextIndex) }));
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveRoomContent(room);
      setOriginalRoom(room);
      showNotice("success", "Obsah pokoje uložen.");
    } catch {
      showNotice("error", "Chyba při ukládání pokoje.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <div>
          <div className="page-title">Správa pokoje</div>
          <div className="page-desc">Popis pokoje, štítky a galerie fotek pro detail ubytování.</div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>

      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="form-group">
            <label>Název sekce</label>
            <input value={room.title} onChange={(e) => setRoom((current) => ({ ...current, title: e.target.value }))} placeholder="Pokoj Hive House" />
          </div>

          <div className="form-group">
            <label>Popis pokoje</label>
            <textarea value={room.description} onChange={(e) => setRoom((current) => ({ ...current, description: e.target.value }))} rows={5} placeholder="Popis pokoje, atmosféry a vybavení..." />
          </div>

          <div className="form-group">
            <label>Přidat štítek</label>
            <div className="inline-editor-row">
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Soukromá terasa" />
              <button className="btn btn-secondary" type="button" onClick={addLabel}>Přidat</button>
            </div>
          </div>

          <div className="sortable-list">
            {room.labels.map((label, index) => (
              <div key={`${label}-${index}`} className="sortable-row">
                <span className="tag-chip">{label}</span>
                <div className="sortable-actions">
                  <button className="btn btn-secondary" type="button" onClick={() => moveLabel(index, -1)} disabled={index === 0}>↑</button>
                  <button className="btn btn-secondary" type="button" onClick={() => moveLabel(index, 1)} disabled={index === room.labels.length - 1}>↓</button>
                  <button className="btn btn-danger" type="button" onClick={() => setRoom((current) => ({ ...current, labels: current.labels.filter((_, i) => i !== index) }))}>Smazat</button>
                </div>
              </div>
            ))}
            {room.labels.length === 0 && <div className="empty-hint">Zatím nejsou přidané žádné štítky.</div>}
          </div>

          <hr className="divider" />

          <div className="sortable-list">
            {room.images.map((image, index) => (
              <div key={`${image}-${index}`} className="sortable-row image-row">
                <div className="image-row-preview">
                  {image.url ? <img src={image.url} alt={image.alt || `Fotka ${index + 1}`} /> : <div className="image-placeholder-box">Bez obrázku</div>}
                  <span>{image.url || "Po nahrání se sem propíše veřejná URL z Firebase Storage."}</span>
                </div>
                <div className="sortable-actions">
                  <label className={`btn btn-secondary file-upload-btn${uploadingImageIndex === index ? " is-busy" : ""}`}>
                    {uploadingImageIndex === index ? "Nahrávám..." : "Nahrát"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        await uploadRoomImage(file, index);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <button className="btn btn-secondary" type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>↑</button>
                  <button className="btn btn-secondary" type="button" onClick={() => moveImage(index, 1)} disabled={index === room.images.length - 1}>↓</button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={async () => {
                      try {
                        await removeHiveHouseImage(image.storagePath);
                      } catch {
                        // Ignore missing files and continue removing from editor.
                      }
                      setRoom((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }));
                    }}
                  >
                    Smazat
                  </button>
                </div>
                <div className="storage-path-chip">{image.storagePath || "Storage path zatím není k dispozici."}</div>
              </div>
            ))}
            {room.images.length === 0 && <div className="empty-hint">Zatím nejsou přidané žádné fotky.</div>}
          </div>

          <div className="upload-card">
            <div className="upload-card-copy">
              <strong>Přidat novou fotku pokoje</strong>
              <span>Obrázek se nahraje do Firebase Storage a sem se uloží jeho veřejná URL.</span>
            </div>
            <label className={`btn btn-secondary file-upload-btn${isAddingImage ? " is-busy" : ""}`}>
              {isAddingImage ? "Nahrávám..." : "Vybrat obrázek"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  await uploadRoomImage(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>
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
      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Datum</th><th>Jméno</th><th>E-mail</th><th>Osob</th><th>Sleva</th><th>Cena</th><th>Status</th><th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {permits.length === 0 ? (
              <tr><td colSpan={8} style={{ color: "rgba(255,255,255,0.3)" }}>Žádné záznamy.</td></tr>
            ) : permits.map((p) => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.persons}</td>
                <td>{p.isHojanoviceChild ? "🧒 Dítě" : p.isFirefighter ? "🚒 Hasič" : "—"}</td>
                <td>{p.pricePaid === 0 ? "ZDARMA" : `${p.pricePaid} Kč`}</td>
                <td><span className={`status-badge status-badge-${p.status}`}>{p.status}</span></td>
                <td>
                  <select value={p.status} onChange={(e) => changeStatus(p.id, e.target.value as FishingPermit["status"])} style={{ background: "var(--dark-3)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>
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
      {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kód</th><th>Příjemce</th><th>Odesílatel</th><th>Noci</th><th>Cena</th><th>Platí do</th><th>Status</th><th>Akce</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr><td colSpan={8} style={{ color: "rgba(255,255,255,0.3)" }}>Žádné záznamy.</td></tr>
            ) : vouchers.map((v) => (
              <tr key={v.id}>
                <td style={{ fontFamily: "monospace", color: "var(--honey)", fontSize: "12px" }}>{v.code}</td>
                <td><div>{v.recipientName}</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{v.recipientEmail}</div></td>
                <td><div>{v.senderName}</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{v.senderEmail}</div></td>
                <td>{v.nights}</td>
                <td>{v.pricePaid.toLocaleString("cs-CZ")} Kč</td>
                <td>{v.validUntil}</td>
                <td><span className={`status-badge status-badge-${v.status}`}>{v.status}</span></td>
                <td>
                  <select value={v.status} onChange={(e) => changeStatus(v.id, e.target.value as GiftVoucher["status"])} style={{ background: "var(--dark-3)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>
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
        <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}>Po měsících</div>
        {months.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Zatím žádná data.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                    <td style={{ color: "var(--honey)", fontWeight: 600 }}>{byMonth[m].revenue.toLocaleString("cs-CZ")} Kč</td>
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

export function HiveHouseAdmin({ userEmail, onBack, initialSection = "dashboard", onSectionChange }: Props) {
  const [section, setSection] = useState<AdminSection>(initialSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [permits, setPermits] = useState<FishingPermit[]>([]);
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);

  const sectionTitles: Record<AdminSection, string> = {
    dashboard: "Přehled",
    promotions: "Sezonní akce",
    surroundings: "Místa v okolí",
    room: "Správa pokoje",
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

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    onSectionChange?.(section);
  }, [section, onSectionChange]);

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
          {section === "dashboard" && <Dashboard promotions={promotions} permits={permits} vouchers={vouchers} />}
          {section === "promotions" && <PromotionsEditor promotions={promotions} />}
          {section === "surroundings" && <SurroundingsEditor />}
          {section === "room" && <RoomEditor />}
          {section === "vouchers" && <VouchersManager />}
          {section === "permits" && <PermitsManager />}
          {section === "statistics" && <Statistics permits={permits} vouchers={vouchers} />}
        </div>
      </div>
    </div>
  );
}

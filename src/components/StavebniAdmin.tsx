import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { Project, StavebniManagedContent, StavebniPromotion, TeamMember } from "../types/stavebni";
import type { StavebniSection } from "../types/stavebni-routing";
import {
  loadStavebniContentFromFirebase,
  saveStavebniContentToFirebase,
  saveStavebniProjectDisplayToFirebase,
  subscribeStavebniContent,
} from "../utils/stavebniStorage";
import {
  normalizeProjectImages,
  removeProjectImage,
  removeProjectImages,
  uploadProjectImage,
} from "../utils/stavebniImages";
import { Icon } from "./Icon";

type Props = {
  userEmail: string;
  onBack: () => void;
  initialSection?: StavebniSection;
  onSectionChange?: (section: StavebniSection) => void;
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
};

type ProjectEditor = {
  editorId: string;
  savedSlug: string | null;
  project: Project;
};

type PromotionEditor = {
  editorId: string;
  savedId: string | null;
  promotion: StavebniPromotion;
};

type EmployeeEditor = {
  editorId: string;
  savedEmail: string | null;
  member: TeamMember;
};

function createEditorId() {
  return `editor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneProject(p: Project): Project {
  return { ...p, images: p.images.map((img) => ({ ...img })) };
}

function normalizeProject(p: Project): Project {
  return { ...p, hidden: Boolean(p.hidden), images: normalizeProjectImages(p.images) };
}

function createEmptyProject(): Project {
  return {
    slug: `projekt-${Date.now()}`,
    category: "Realizované zakázky",
    title: "Nový projekt",
    summary: "",
    location: "",
    hidden: false,
    images: [],
  };
}

function createEmptyPromotion(): StavebniPromotion {
  return {
    id: `promo-${Date.now()}`,
    enabled: false,
    startsAt: "",
    endsAt: "",
    badge: "Nová akce",
    title: "Nová promo akce",
    text: "",
    ctaLabel: "Zjistit více",
    ctaHref: "#kontakt",
  };
}

function createEmptyEmployee(): TeamMember {
  return { name: "Nový zaměstnanec", role: "", phone: "", email: "", initials: "NZ" };
}

function serialize<T>(val: T) { return JSON.stringify(val); }

function createProjectEditor(p: Project): ProjectEditor {
  return { editorId: createEditorId(), savedSlug: p.slug, project: normalizeProject(cloneProject(p)) };
}

function createPromotionEditor(promo: StavebniPromotion): PromotionEditor {
  return { editorId: createEditorId(), savedId: promo.id, promotion: { ...promo } };
}

function createEmployeeEditor(m: TeamMember): EmployeeEditor {
  return { editorId: createEditorId(), savedEmail: m.email, member: { ...m } };
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

function isInteractiveDragTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("button, input, textarea, label, a, select"));
}

function getProjectSummary(p: Project) {
  const total = p.images.length;
  const visible = p.images.filter((img) => !img.hidden && img.src).length;
  const hasPrimary = Boolean(p.images.find((img) => img.isPrimary && !img.hidden)?.src);
  return { total, visible, hasPrimary, isVisible: !p.hidden };
}

function buildPersistedProjects(
  savedProjects: Project[],
  editors: ProjectEditor[],
  overrideEditor?: ProjectEditor,
  overrideProject?: Project,
): Project[] {
  const savedMap = new Map(savedProjects.map((p) => [p.slug, p]));
  const nextProjects: Project[] = [];
  editors.forEach((editor) => {
    if (overrideEditor && editor.editorId === overrideEditor.editorId && overrideProject) {
      nextProjects.push(overrideProject);
      return;
    }
    if (!editor.savedSlug) return;
    const saved = savedMap.get(editor.savedSlug);
    if (saved) nextProjects.push({ ...saved, hidden: editor.project.hidden });
  });
  return nextProjects;
}

function reconcileProjectEditors(current: ProjectEditor[], saved: Project[]): ProjectEditor[] {
  const next: ProjectEditor[] = [];
  saved.forEach((sp) => {
    const existing = current.find((e) => e.savedSlug === sp.slug);
    if (!existing) { next.push(createProjectEditor(sp)); return; }
    const isDirty = serialize(existing.project) !== serialize(sp);
    next.push(isDirty ? existing : { ...existing, savedSlug: sp.slug, project: normalizeProject(cloneProject(sp)) });
  });
  current.filter((e) => e.savedSlug === null).forEach((e) => next.unshift(e));
  return next;
}

function reconcilePromotionEditors(current: PromotionEditor[], saved: StavebniPromotion[]): PromotionEditor[] {
  const next: PromotionEditor[] = [];
  saved.forEach((sp) => {
    const existing = current.find((e) => e.savedId === sp.id);
    if (!existing) { next.push(createPromotionEditor(sp)); return; }
    const isDirty = serialize(existing.promotion) !== serialize(sp);
    next.push(isDirty ? existing : { ...existing, savedId: sp.id, promotion: { ...sp } });
  });
  current.filter((e) => e.savedId === null).forEach((e) => next.unshift(e));
  return next;
}

function reconcileEmployeeEditors(current: EmployeeEditor[], saved: TeamMember[]): EmployeeEditor[] {
  const next: EmployeeEditor[] = [];
  saved.forEach((sm) => {
    const existing = current.find((e) => e.savedEmail === sm.email);
    if (!existing) { next.push(createEmployeeEditor(sm)); return; }
    const isDirty = serialize(existing.member) !== serialize(sm);
    next.push(isDirty ? existing : { ...existing, savedEmail: sm.email, member: { ...sm } });
  });
  current.filter((e) => e.savedEmail === null).forEach((e) => next.unshift(e));
  return next;
}

export function StavebniAdmin({ userEmail: _userEmail, onBack, initialSection, onSectionChange }: Props) {
  const [section, setSection] = useState<StavebniSection>(initialSection ?? "projects");
  const [content, setContent] = useState<StavebniManagedContent>({ projects: [], promotions: [], team: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const [projectEditors, setProjectEditors] = useState<ProjectEditor[]>([]);
  const [promotionEditors, setPromotionEditors] = useState<PromotionEditor[]>([]);
  const [employeeEditors, setEmployeeEditors] = useState<EmployeeEditor[]>([]);

  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [openPromotionId, setOpenPromotionId] = useState<string | null>(null);
  const [openEmployeeId, setOpenEmployeeId] = useState<string | null>(null);
  const [dragProjectId, setDragProjectId] = useState<string | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);
  const [savingProjectIds, setSavingProjectIds] = useState<string[]>([]);
  const [savingPromotionIds, setSavingPromotionIds] = useState<string[]>([]);
  const [savingEmployeeIds, setSavingEmployeeIds] = useState<string[]>([]);
  const [uploadingKeys, setUploadingKeys] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    loadStavebniContentFromFirebase().then((initial) => {
      if (!mounted) return;
      setContent(initial);
      setProjectEditors(initial.projects.map(createProjectEditor));
      setPromotionEditors(initial.promotions.map(createPromotionEditor));
      setEmployeeEditors(initial.team.map(createEmployeeEditor));
      setIsLoading(false);
    });
    const unsub = subscribeStavebniContent((updated) => {
      if (!mounted) return;
      setContent(updated);
      setProjectEditors((cur) => reconcileProjectEditors(cur, updated.projects));
      setPromotionEditors((cur) => reconcilePromotionEditors(cur, updated.promotions));
      setEmployeeEditors((cur) => reconcileEmployeeEditors(cur, updated.team));
    });
    return () => { mounted = false; unsub(); };
  }, []);

  const handleSection = (s: StavebniSection) => { setSection(s); onSectionChange?.(s); };
  const showNotice = (text: string, ms = 2500) => { setNotice(text); window.setTimeout(() => setNotice(""), ms); };
  const requestConfirm = (state: ConfirmState) => setConfirmState(state);
  const setUploading = (key: string, active: boolean) =>
    setUploadingKeys((cur) => active ? [...new Set([...cur, key])] : cur.filter((k) => k !== key));
  const setSavingProject = (id: string, active: boolean) =>
    setSavingProjectIds((cur) => active ? [...new Set([...cur, id])] : cur.filter((k) => k !== id));
  const setSavingPromotion = (id: string, active: boolean) =>
    setSavingPromotionIds((cur) => active ? [...new Set([...cur, id])] : cur.filter((k) => k !== id));
  const setSavingEmployee = (id: string, active: boolean) =>
    setSavingEmployeeIds((cur) => active ? [...new Set([...cur, id])] : cur.filter((k) => k !== id));

  const getSavedProject = (editor: ProjectEditor) =>
    editor.savedSlug ? content.projects.find((p) => p.slug === editor.savedSlug) ?? null : null;
  const isProjectDirty = (editor: ProjectEditor) => {
    const saved = getSavedProject(editor);
    return !saved || serialize(editor.project) !== serialize(saved);
  };
  const updateProjectEditor = (editorId: string, updater: (p: Project) => Project) =>
    setProjectEditors((cur) => cur.map((e) => e.editorId === editorId
      ? { ...e, project: normalizeProject(updater(cloneProject(e.project))) } : e));

  const saveProject = async (editor: ProjectEditor) => {
    const project = normalizeProject(editor.project);
    const visibleImages = project.images.filter((img) => !img.hidden && img.src);
    if (!project.title.trim()) { showNotice("Projekt musí mít název.", 3000); return; }
    if (project.images.filter((img) => img.src).length === 0) { showNotice("Projekt musí mít alespoň jeden obrázek.", 3000); return; }
    if (visibleImages.length === 0) { showNotice("Projekt musí mít alespoň jeden viditelný obrázek.", 3000); return; }
    setSavingProject(editor.editorId, true);
    try {
      const nextProjects = buildPersistedProjects(content.projects, projectEditors, editor, project);
      await saveStavebniContentToFirebase({ ...content, projects: nextProjects });
      await saveStavebniProjectDisplayToFirebase(nextProjects);
      const saved = getSavedProject(editor);
      const removed = (saved?.images ?? []).filter(
        (img) => img.storagePath && !project.images.some((i) => i.storagePath === img.storagePath));
      if (removed.length > 0) await removeProjectImages(removed);
      setProjectEditors((cur) => cur.map((e) => e.editorId === editor.editorId
        ? { ...e, savedSlug: project.slug, project: cloneProject(project) } : e));
      showNotice(`Projekt "${project.title}" byl uložen.`);
    } catch { showNotice("Uložení projektu se nepodařilo. Zkontroluj databázi a oprávnění.", 4000); }
    finally { setSavingProject(editor.editorId, false); }
  };

  const cancelProject = async (editor: ProjectEditor) => {
    const saved = getSavedProject(editor);
    if (!saved) {
      await removeProjectImages(editor.project.images);
      setProjectEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
      setOpenProjectId((cur) => cur === editor.editorId ? null : cur);
      return;
    }
    const savedPaths = new Set(saved.images.map((img) => img.storagePath).filter(Boolean));
    const newUploads = editor.project.images.filter((img) => img.storagePath && !savedPaths.has(img.storagePath));
    await removeProjectImages(newUploads);
    setProjectEditors((cur) => cur.map((e) => e.editorId === editor.editorId
      ? { ...e, project: normalizeProject(cloneProject(saved)) } : e));
  };

  const moveProjectEditor = (sourceId: string, targetId: string) => {
    const fromIndex = projectEditors.findIndex((e) => e.editorId === sourceId);
    const toIndex = projectEditors.findIndex((e) => e.editorId === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
    const nextEditors = moveItem(projectEditors, fromIndex, toIndex);
    setProjectEditors(nextEditors);
    const nextProjects = buildPersistedProjects(content.projects, nextEditors);
    void (async () => {
      try { await saveStavebniProjectDisplayToFirebase(nextProjects); showNotice("Pořadí projektů bylo automaticky uloženo."); }
      catch { showNotice("Automatické uložení pořadí se nepodařilo.", 3500); }
    })();
  };

  const toggleProjectVisibility = (editorId: string) => {
    const nextEditors = projectEditors.map((e) => e.editorId === editorId
      ? { ...e, project: normalizeProject({ ...e.project, hidden: !e.project.hidden }) } : e);
    setProjectEditors(nextEditors);
    const nextProjects = buildPersistedProjects(content.projects, nextEditors);
    void (async () => {
      try { await saveStavebniProjectDisplayToFirebase(nextProjects); showNotice("Viditelnost projektu byla automaticky uložena."); }
      catch { showNotice("Automatické uložení viditelnosti se nepodařilo.", 3500); }
    })();
  };

  const getSavedPromotion = (editor: PromotionEditor) =>
    editor.savedId ? content.promotions.find((p) => p.id === editor.savedId) ?? null : null;
  const isPromotionDirty = (editor: PromotionEditor) => {
    const saved = getSavedPromotion(editor);
    return !saved || serialize(editor.promotion) !== serialize(saved);
  };
  const updatePromotionEditor = (editorId: string, updater: (p: StavebniPromotion) => StavebniPromotion) =>
    setPromotionEditors((cur) => cur.map((e) => e.editorId === editorId ? { ...e, promotion: updater({ ...e.promotion }) } : e));

  const savePromotion = async (editor: PromotionEditor) => {
    const promo = { ...editor.promotion };
    if (!promo.title.trim()) { showNotice("Akce musí mít nadpis.", 3000); return; }
    setSavingPromotion(editor.editorId, true);
    try {
      const saved = getSavedPromotion(editor);
      const nextPromotions = [...content.promotions];
      const savedIndex = saved ? nextPromotions.findIndex((p) => p.id === saved.id) : -1;
      if (savedIndex >= 0) nextPromotions[savedIndex] = promo; else nextPromotions.unshift(promo);
      await saveStavebniContentToFirebase({ ...content, promotions: nextPromotions });
      setPromotionEditors((cur) => cur.map((e) => e.editorId === editor.editorId
        ? { ...e, savedId: promo.id, promotion: { ...promo } } : e));
      showNotice(`Akce "${promo.title}" byla uložena.`);
    } catch { showNotice("Uložení akce se nepodařilo. Zkontroluj databázi a oprávnění.", 4000); }
    finally { setSavingPromotion(editor.editorId, false); }
  };

  const cancelPromotion = (editor: PromotionEditor) => {
    const saved = getSavedPromotion(editor);
    if (!saved) {
      setPromotionEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
      setOpenPromotionId((cur) => cur === editor.editorId ? null : cur);
      return;
    }
    setPromotionEditors((cur) => cur.map((e) => e.editorId === editor.editorId ? { ...e, promotion: { ...saved } } : e));
  };

  const deletePromotion = async (editor: PromotionEditor) => {
    if (!editor.savedId) { setPromotionEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId)); return; }
    const nextPromotions = content.promotions.filter((p) => p.id !== editor.savedId);
    await saveStavebniContentToFirebase({ ...content, promotions: nextPromotions });
    setPromotionEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
    showNotice("Akce byla odstraněna.");
  };

  const getSavedEmployee = (editor: EmployeeEditor) =>
    editor.savedEmail ? content.team.find((m) => m.email === editor.savedEmail) ?? null : null;
  const isEmployeeDirty = (editor: EmployeeEditor) => {
    const saved = getSavedEmployee(editor);
    return !saved || serialize(editor.member) !== serialize(saved);
  };
  const updateEmployeeEditor = (editorId: string, updater: (m: TeamMember) => TeamMember) =>
    setEmployeeEditors((cur) => cur.map((e) => e.editorId === editorId ? { ...e, member: updater({ ...e.member }) } : e));

  const saveEmployee = async (editor: EmployeeEditor) => {
    const member = { ...editor.member };
    if (!member.name.trim()) { showNotice("Zaměstnanec musí mít jméno.", 3000); return; }
    if (!member.email.trim()) { showNotice("Zaměstnanec musí mít email.", 3000); return; }
    setSavingEmployee(editor.editorId, true);
    try {
      const saved = getSavedEmployee(editor);
      const nextTeam = [...content.team];
      const savedIndex = saved ? nextTeam.findIndex((m) => m.email === saved.email) : -1;
      if (savedIndex >= 0) nextTeam[savedIndex] = member; else nextTeam.unshift(member);
      await saveStavebniContentToFirebase({ ...content, team: nextTeam });
      setEmployeeEditors((cur) => cur.map((e) => e.editorId === editor.editorId
        ? { ...e, savedEmail: member.email, member: { ...member } } : e));
      showNotice(`Zaměstnanec "${member.name}" byl uložen.`);
    } catch { showNotice("Uložení zaměstnance se nepodařilo.", 4000); }
    finally { setSavingEmployee(editor.editorId, false); }
  };

  const cancelEmployee = (editor: EmployeeEditor) => {
    const saved = getSavedEmployee(editor);
    if (!saved) {
      setEmployeeEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
      setOpenEmployeeId((cur) => cur === editor.editorId ? null : cur);
      return;
    }
    setEmployeeEditors((cur) => cur.map((e) => e.editorId === editor.editorId ? { ...e, member: { ...saved } } : e));
  };

  const deleteEmployee = async (editor: EmployeeEditor) => {
    if (!editor.savedEmail) { setEmployeeEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId)); return; }
    const nextTeam = content.team.filter((m) => m.email !== editor.savedEmail);
    await saveStavebniContentToFirebase({ ...content, team: nextTeam });
    setEmployeeEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
    showNotice("Zaměstnanec byl odstraněn.");
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Načítám data 2P Stavební…</p>
      </div>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <header className="admin-header">
          <div>
            <span className="section-label">2P Moment — Správa obsahu</span>
            <h1>2P Stavební</h1>
            <p>Správa projektů, promo akcí a týmu. Data se ukládají do Firebase Realtime Database.</p>
          </div>
          <div className="admin-actions">
            <button type="button" className="btn btn-outline-dark" onClick={onBack}>
              Zpět na výběr
            </button>
            <button type="button" className="btn btn-dark" onClick={() => void signOut(auth)}>
              Odhlásit
            </button>
          </div>
        </header>

        <div className="admin-toolbar">
          <div className="admin-page-nav">
            <button type="button" className={`admin-page-link ${section === "projects" ? "active" : ""}`} onClick={() => handleSection("projects")}>
              Projekty
            </button>
            <button type="button" className={`admin-page-link ${section === "promotions" ? "active" : ""}`} onClick={() => handleSection("promotions")}>
              Akce
            </button>
            <button type="button" className={`admin-page-link ${section === "employees" ? "active" : ""}`} onClick={() => handleSection("employees")}>
              Zaměstnanci
            </button>
          </div>
          {section === "promotions" ? (
            <p className="admin-inline-help">Každá akce má vlastní změny. Po úpravě se přímo v její kartě ukáže Uložit a Zrušit.</p>
          ) : section === "employees" ? (
            <p className="admin-inline-help">Každý zaměstnanec má vlastní změny. Upravíš jméno, roli, email i telefon a pak vše uložíš přímo v kartě.</p>
          ) : (
            <p className="admin-inline-help">Každý projekt má vlastní změny. Po úpravě se přímo v jeho kartě ukáže Uložit a Zrušit.</p>
          )}
          {notice ? <p className="admin-notice">{notice}</p> : null}
        </div>

        {section === "projects" ? (
          <section className="admin-section admin-section-projects">
            <div className="admin-section-head">
              <div>
                <h2>Projekty a galerie</h2>
                <p>U každého projektu spravuješ zvlášť texty i galerii. Obrázky nahráváš přímo do Firebase Storage, pak je potvrdíš uložením konkrétní karty projektu.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => {
                const newEditor: ProjectEditor = { editorId: createEditorId(), savedSlug: null, project: normalizeProject(createEmptyProject()) };
                setProjectEditors((cur) => [newEditor, ...cur]);
                setOpenProjectId(newEditor.editorId);
              }}>
                Přidat projekt
              </button>
            </div>

            <div className="admin-stack">
              {projectEditors.map((editor, editorIndex) => {
                const project = editor.project;
                const summary = getProjectSummary(project);
                const isOpen = openProjectId === editor.editorId;
                const isDirty = isProjectDirty(editor);
                const isSaving = savingProjectIds.includes(editor.editorId);
                const isDragging = dragProjectId === editor.editorId;
                const isDropTarget = dragOverProjectId === editor.editorId && !isDragging;

                return (
                  <article
                    className={`admin-card ${isDragging ? "is-dragging" : ""} ${isDropTarget ? "is-drop-target" : ""}`}
                    key={editor.editorId}
                    draggable
                    onDragStart={(event) => {
                      if (isInteractiveDragTarget(event.target)) { event.preventDefault(); return; }
                      setDragProjectId(editor.editorId);
                      setDragOverProjectId(editor.editorId);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", editor.editorId);
                    }}
                    onDragOver={(event) => { event.preventDefault(); if (dragProjectId && dragProjectId !== editor.editorId) setDragOverProjectId(editor.editorId); }}
                    onDrop={(event) => { event.preventDefault(); if (dragProjectId) moveProjectEditor(dragProjectId, editor.editorId); setDragProjectId(null); setDragOverProjectId(null); }}
                    onDragEnd={() => { setDragProjectId(null); setDragOverProjectId(null); }}
                  >
                    <div className="admin-card-head">
                      <button type="button" className="admin-card-toggle"
                        onClick={() => setOpenProjectId((cur) => cur === editor.editorId ? null : editor.editorId)}>
                        <div>
                          <h3>{project.title || `Projekt ${editorIndex + 1}`}</h3>
                          <p className="admin-card-meta">
                            {project.location || "Bez lokality"} • {summary.total} obrázků • {summary.visible} zobrazeno
                            {summary.hasPrimary ? " • hlavní obrázek zvolen" : ""}
                            {summary.isVisible ? " • projekt zobrazen" : " • projekt skrytý"}
                          </p>
                        </div>
                        <span className={`admin-chevron ${isOpen ? "open" : ""}`}>
                          <Icon name="chevron-right" size={18} />
                        </span>
                      </button>
                      <div className="admin-card-controls">
                        <button type="button" className="admin-icon-button"
                          aria-label={project.hidden ? "Zobrazit projekt" : "Skrýt projekt"}
                          onClick={() => toggleProjectVisibility(editor.editorId)}>
                          <Icon name={project.hidden ? "eye" : "eye-off"} size={16} />
                        </button>
                        <button type="button" className="admin-remove"
                          onClick={() => requestConfirm({
                            title: "Odstranit projekt?",
                            message: `Projekt "${project.title || "Bez názvu"}" bude odstraněn z administrace i z databáze.`,
                            confirmLabel: "Ano, odstranit", tone: "danger",
                            onConfirm: async () => {
                              await removeProjectImages(project.images);
                              if (editor.savedSlug) {
                                const nextProjects = content.projects.filter((p) => p.slug !== editor.savedSlug);
                                await saveStavebniContentToFirebase({ ...content, projects: nextProjects });
                                await saveStavebniProjectDisplayToFirebase(nextProjects);
                              }
                              setProjectEditors((cur) => cur.filter((e) => e.editorId !== editor.editorId));
                              setOpenProjectId((cur) => cur === editor.editorId ? null : cur);
                            },
                          })}>
                          Odstranit
                        </button>
                      </div>
                    </div>

                    <div className={`admin-card-body ${isOpen ? "open" : ""}`}>
                      <div className="admin-card-body-inner">
                        <div className="admin-grid">
                          <label>Slug<input type="text" value={project.slug}
                            onChange={(e) => updateProjectEditor(editor.editorId, (p) => ({ ...p, slug: e.target.value }))} /></label>
                          <label>Kategorie<input type="text" value={project.category}
                            onChange={(e) => updateProjectEditor(editor.editorId, (p) => ({ ...p, category: e.target.value }))} /></label>
                          <label className="admin-field-wide">Název projektu<input type="text" value={project.title}
                            onChange={(e) => updateProjectEditor(editor.editorId, (p) => ({ ...p, title: e.target.value }))} /></label>
                          <label>Lokalita<input type="text" value={project.location ?? ""}
                            onChange={(e) => updateProjectEditor(editor.editorId, (p) => ({ ...p, location: e.target.value }))} /></label>
                          <label className="admin-field-wide">Popis projektu<textarea value={project.summary}
                            onChange={(e) => updateProjectEditor(editor.editorId, (p) => ({ ...p, summary: e.target.value }))} /></label>
                        </div>

                        <div className="admin-subsection">
                          <div className="admin-subsection-head">
                            <div>
                              <h4>Galerie obrázků</h4>
                              <p className="admin-subsection-text">Obrázky můžeš nahrát, označit jako hlavní, skrýt z webu nebo nahradit novým souborem.</p>
                            </div>
                          </div>

                          <div className="admin-gallery-grid">
                            {project.images.map((image, imageIndex) => {
                              const uploadKey = `${editor.editorId}-${imageIndex}`;
                              return (
                                <article className="admin-gallery-tile" key={`${editor.editorId}-${imageIndex}`}>
                                  <div className="admin-gallery-frame">
                                    {image.src ? (
                                      <img src={image.src} alt={project.title || "Náhled obrázku"} className="admin-image-preview" />
                                    ) : (
                                      <div className="admin-image-placeholder">Bez obrázku</div>
                                    )}
                                    <div className="admin-gallery-badges">
                                      {image.isPrimary ? <span className="admin-gallery-badge primary">Hlavní</span> : null}
                                      {image.useInHero ? <span className="admin-gallery-badge hero">Banner</span> : null}
                                      {image.hidden
                                        ? <span className="admin-gallery-badge muted">Skrytý</span>
                                        : <span className="admin-gallery-badge visible">Zobrazený</span>}
                                    </div>
                                  </div>

                                  <div className="admin-gallery-actions">
                                    <button type="button" className="admin-icon-button" aria-label="Nastavit jako hlavní obrázek"
                                      onClick={() => updateProjectEditor(editor.editorId, (p) => ({
                                        ...p, images: p.images.map((entry, i) => ({
                                          ...entry,
                                          hidden: i === imageIndex ? false : entry.hidden,
                                          isPrimary: i === imageIndex,
                                        })),
                                      }))}>
                                      <Icon name="star" size={16} />
                                    </button>
                                    <button type="button" className="admin-icon-button"
                                      aria-label={image.useInHero ? "Zakázat použití v hero banneru" : "Povolit použití v hero banneru"}
                                      onClick={() => updateProjectEditor(editor.editorId, (p) => ({
                                        ...p, images: p.images.map((entry, i) =>
                                          i === imageIndex ? { ...entry, useInHero: !entry.useInHero, hidden: false } : entry),
                                      }))}>
                                      <Icon name="image" size={16} />
                                    </button>
                                    <button type="button" className="admin-icon-button"
                                      aria-label={image.hidden ? "Zobrazit obrázek" : "Skrýt obrázek"}
                                      onClick={() => updateProjectEditor(editor.editorId, (p) => ({
                                        ...p, images: p.images.map((entry, i) =>
                                          i === imageIndex
                                            ? { ...entry, hidden: !entry.hidden, useInHero: entry.hidden ? entry.useInHero : false }
                                            : entry),
                                      }))}>
                                      <Icon name={image.hidden ? "eye" : "eye-off"} size={16} />
                                    </button>
                                    <button type="button" className="admin-icon-button" aria-label="Posunout obrázek doleva"
                                      disabled={imageIndex === 0}
                                      onClick={() => updateProjectEditor(editor.editorId, (p) => ({
                                        ...p, images: moveItem(p.images, imageIndex, imageIndex - 1),
                                      }))}>
                                      <Icon name="chevron-left" size={16} />
                                    </button>
                                    <button type="button" className="admin-icon-button" aria-label="Posunout obrázek doprava"
                                      disabled={imageIndex === project.images.length - 1}
                                      onClick={() => updateProjectEditor(editor.editorId, (p) => ({
                                        ...p, images: moveItem(p.images, imageIndex, imageIndex + 1),
                                      }))}>
                                      <Icon name="chevron-right" size={16} />
                                    </button>
                                    <label
                                      className={`admin-icon-button admin-file-trigger ${uploadingKeys.includes(uploadKey) ? "is-busy" : ""}`}
                                      aria-label="Nahrát novou verzi obrázku"
                                    >
                                      <Icon name="upload" size={16} />
                                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={async (event) => {
                                          const file = event.target.files?.[0];
                                          if (!file) return;
                                          setUploading(uploadKey, true);
                                          try {
                                            const uploaded = await uploadProjectImage(file, project.slug);
                                            updateProjectEditor(editor.editorId, (p) => ({
                                              ...p, images: p.images.map((entry, i) =>
                                                i === imageIndex ? { ...entry, src: uploaded.src, storagePath: uploaded.storagePath } : entry),
                                            }));
                                            showNotice("Obrázek byl aktualizován. Potvrď ho uložením projektu.");
                                          } catch {
                                            showNotice("Aktualizace obrázku se nepodařila.", 4000);
                                          } finally {
                                            setUploading(uploadKey, false);
                                            event.target.value = "";
                                          }
                                        }} />
                                    </label>
                                    <button type="button" className="admin-icon-button danger" aria-label="Smazat obrázek"
                                      onClick={() => requestConfirm({
                                        title: "Odstranit obrázek?",
                                        message: "Vybraný obrázek bude odstraněn z galerie projektu.",
                                        confirmLabel: "Ano, odstranit", tone: "danger",
                                        onConfirm: async () => {
                                          if (project.images.length <= 1) {
                                            showNotice("Projekt musí mít alespoň jeden obrázek.", 3000);
                                            return;
                                          }
                                          await removeProjectImage(image.storagePath);
                                          updateProjectEditor(editor.editorId, (p) => ({
                                            ...p, images: p.images.filter((_, i) => i !== imageIndex),
                                          }));
                                        },
                                      })}>
                                      <Icon name="trash" size={16} />
                                    </button>
                                  </div>
                                </article>
                              );
                            })}

                            {(() => {
                              const uploadKey = `${editor.editorId}-new`;
                              return (
                                <article className="admin-gallery-tile admin-gallery-tile-add">
                                  <div className="admin-gallery-frame">
                                    <div className="admin-image-placeholder admin-image-placeholder-add">
                                      <div className="admin-image-placeholder-copy">
                                        <Icon name="upload" size={24} />
                                        <strong>Přidat obrázek</strong>
                                        <span>Vyber soubor a po nahrání se hned objeví v galerii.</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="admin-gallery-actions">
                                    <label
                                      className={`admin-icon-button admin-file-trigger admin-icon-button-wide ${uploadingKeys.includes(uploadKey) ? "is-busy" : ""}`}
                                      aria-label="Nahrát nový obrázek"
                                    >
                                      <Icon name="upload" size={16} />
                                      <span>{uploadingKeys.includes(uploadKey) ? "Nahrávám obrázek..." : "Vybrat obrázek"}</span>
                                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={async (event) => {
                                          const file = event.target.files?.[0];
                                          if (!file) return;
                                          setUploading(uploadKey, true);
                                          try {
                                            const uploaded = await uploadProjectImage(file, project.slug);
                                            updateProjectEditor(editor.editorId, (p) => ({
                                              ...p, images: [...p.images, {
                                                ...uploaded,
                                                isPrimary: p.images.filter((img) => !img.hidden && img.src).length === 0,
                                                hidden: false,
                                              }],
                                            }));
                                            showNotice("Obrázek byl nahrán. Potvrď ho uložením projektu.");
                                          } catch {
                                            showNotice("Nahrání obrázku se nepodařilo. Zkontroluj Firebase Storage.", 4000);
                                          } finally {
                                            setUploading(uploadKey, false);
                                            event.target.value = "";
                                          }
                                        }} />
                                    </label>
                                  </div>
                                </article>
                              );
                            })()}
                          </div>
                        </div>

                        {isDirty ? (
                          <div className="admin-project-savebar">
                            <p className="admin-dirty">V tomhle projektu máš neuložené změny.</p>
                            <div className="admin-project-save-actions">
                              <button type="button" className="btn btn-secondary"
                                onClick={() => requestConfirm({
                                  title: "Zrušit změny?",
                                  message: "Vrátí se poslední uložený stav projektu a zahodí se lokální úpravy.",
                                  confirmLabel: "Ano, zrušit změny", tone: "danger",
                                  onConfirm: () => cancelProject(editor),
                                })}>
                                Zrušit změny
                              </button>
                              <button type="button" className="btn btn-primary" disabled={isSaving}
                                onClick={() => requestConfirm({
                                  title: "Uložit projekt?",
                                  message: "Tímto uložíš texty i galerii tohoto projektu do Firebase databáze.",
                                  confirmLabel: isSaving ? "Ukládám..." : "Ano, uložit projekt", tone: "primary",
                                  onConfirm: () => saveProject(editor),
                                })}>
                                {isSaving ? "Ukládám..." : "Uložit projekt"}
                                <Icon name="send" size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-project-savebar is-clean">
                            <p className="admin-clean">Projekt je uložený a bez lokálních změn.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {section === "employees" ? (
          <section className="admin-section admin-section-employees">
            <div className="admin-section-head">
              <div>
                <h2>Zaměstnanci a kontakty</h2>
                <p>Upravuješ zde kontaktní osoby, které se zobrazují ve veřejné kontaktní sekci.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => {
                const newEditor: EmployeeEditor = { editorId: createEditorId(), savedEmail: null, member: createEmptyEmployee() };
                setEmployeeEditors((cur) => [newEditor, ...cur]);
                setOpenEmployeeId(newEditor.editorId);
              }}>
                Přidat zaměstnance
              </button>
            </div>

            <div className="admin-stack">
              {employeeEditors.map((editor, employeeIndex) => {
                const member = editor.member;
                const isOpen = openEmployeeId === editor.editorId;
                const isDirty = isEmployeeDirty(editor);
                const isSaving = savingEmployeeIds.includes(editor.editorId);

                return (
                  <article className="admin-card" key={editor.editorId}>
                    <div className="admin-card-head">
                      <button type="button" className="admin-card-toggle"
                        onClick={() => setOpenEmployeeId((cur) => cur === editor.editorId ? null : editor.editorId)}>
                        <div>
                          <h3>{member.name || `Zaměstnanec ${employeeIndex + 1}`}</h3>
                          <p className="admin-card-meta">
                            {member.role || "Bez pozice"} • {member.email || "bez emailu"} • {member.phone || "bez telefonu"}
                          </p>
                        </div>
                        <span className={`admin-chevron ${isOpen ? "open" : ""}`}>
                          <Icon name="chevron-right" size={18} />
                        </span>
                      </button>
                      <button type="button" className="admin-remove"
                        onClick={() => requestConfirm({
                          title: "Odstranit zaměstnance?",
                          message: `Kontakt "${member.name || "Bez názvu"}" bude odstraněn z administrace i z databáze.`,
                          confirmLabel: "Ano, odstranit", tone: "danger",
                          onConfirm: () => deleteEmployee(editor),
                        })}>
                        Odstranit
                      </button>
                    </div>

                    <div className={`admin-card-body ${isOpen ? "open" : ""}`}>
                      <div className="admin-card-body-inner">
                        <div className="admin-grid">
                          <label>Jméno a příjmení<input type="text" value={member.name}
                            onChange={(e) => updateEmployeeEditor(editor.editorId, (m) => ({ ...m, name: e.target.value }))} /></label>
                          <label>Iniciály<input type="text" value={member.initials}
                            onChange={(e) => updateEmployeeEditor(editor.editorId, (m) => ({
                              ...m, initials: e.target.value.slice(0, 3).toUpperCase(),
                            }))} /></label>
                          <label>Pozice<input type="text" value={member.role}
                            onChange={(e) => updateEmployeeEditor(editor.editorId, (m) => ({ ...m, role: e.target.value }))} /></label>
                          <label>Telefon<input type="text" value={member.phone}
                            onChange={(e) => updateEmployeeEditor(editor.editorId, (m) => ({ ...m, phone: e.target.value }))} /></label>
                          <label className="admin-field-wide">Email<input type="email" value={member.email}
                            onChange={(e) => updateEmployeeEditor(editor.editorId, (m) => ({ ...m, email: e.target.value }))} /></label>
                        </div>

                        {isDirty ? (
                          <div className="admin-project-savebar">
                            <p className="admin-dirty">U tohoto zaměstnance máš neuložené změny.</p>
                            <div className="admin-project-save-actions">
                              <button type="button" className="btn btn-secondary"
                                onClick={() => requestConfirm({
                                  title: "Zrušit změny?",
                                  message: "Vrátí se poslední uložený stav kontaktu a zahodí se lokální úpravy.",
                                  confirmLabel: "Ano, zrušit změny", tone: "danger",
                                  onConfirm: () => cancelEmployee(editor),
                                })}>
                                Zrušit změny
                              </button>
                              <button type="button" className="btn btn-primary" disabled={isSaving}
                                onClick={() => requestConfirm({
                                  title: "Uložit zaměstnance?",
                                  message: "Tímto uložíš kontaktní údaje zaměstnance do Firebase databáze.",
                                  confirmLabel: isSaving ? "Ukládám..." : "Ano, uložit", tone: "primary",
                                  onConfirm: () => saveEmployee(editor),
                                })}>
                                {isSaving ? "Ukládám..." : "Uložit zaměstnance"}
                                <Icon name="send" size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-project-savebar is-clean">
                            <p className="admin-clean">Kontakt je uložený a bez lokálních změn.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {section === "promotions" ? (
          <section className="admin-section admin-section-promotions">
            <div className="admin-section-head">
              <div>
                <h2>Promo akce a události</h2>
                <p>Zde nastavíš popup akce. Zobrazí se první aktivní akce v seznamu, která spadá do aktuálního období.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => {
                const newEditor: PromotionEditor = { editorId: createEditorId(), savedId: null, promotion: createEmptyPromotion() };
                setPromotionEditors((cur) => [newEditor, ...cur]);
                setOpenPromotionId(newEditor.editorId);
              }}>
                Přidat akci
              </button>
            </div>

            <div className="admin-stack">
              {promotionEditors.map((editor, promotionIndex) => {
                const promotion = editor.promotion;
                const isOpen = openPromotionId === editor.editorId;
                const isDirty = isPromotionDirty(editor);
                const isSaving = savingPromotionIds.includes(editor.editorId);

                return (
                  <article className="admin-card" key={editor.editorId}>
                    <div className="admin-card-head">
                      <button type="button" className="admin-card-toggle"
                        onClick={() => setOpenPromotionId((cur) => cur === editor.editorId ? null : editor.editorId)}>
                        <div>
                          <h3>{promotion.title || `Akce ${promotionIndex + 1}`}</h3>
                          <p className="admin-card-meta">
                            {promotion.enabled ? "Aktivní" : "Neaktivní"} • {promotion.startsAt || "bez začátku"} až {promotion.endsAt || "bez konce"}
                          </p>
                        </div>
                        <span className={`admin-chevron ${isOpen ? "open" : ""}`}>
                          <Icon name="chevron-right" size={18} />
                        </span>
                      </button>
                      <button type="button" className="admin-remove"
                        onClick={() => requestConfirm({
                          title: "Odstranit akci?",
                          message: `Akce "${promotion.title || "Bez názvu"}" bude odstraněna z administrace i z databáze.`,
                          confirmLabel: "Ano, odstranit", tone: "danger",
                          onConfirm: () => deletePromotion(editor),
                        })}>
                        Odstranit
                      </button>
                    </div>

                    <div className={`admin-card-body ${isOpen ? "open" : ""}`}>
                      <div className="admin-card-body-inner">
                        <div className="admin-grid">
                          <label>ID akce<input type="text" value={promotion.id}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, id: e.target.value }))} /></label>
                          <label className="admin-checkbox">
                            <span>Akce je aktivní</span>
                            <input type="checkbox" checked={promotion.enabled}
                              onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, enabled: e.target.checked }))} />
                          </label>
                          <label>Badge<input type="text" value={promotion.badge}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, badge: e.target.value }))} /></label>
                          <label className="admin-field-wide">Nadpis akce<input type="text" value={promotion.title}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, title: e.target.value }))} /></label>
                          <label>Začátek<input type="date" value={promotion.startsAt ?? ""}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, startsAt: e.target.value }))} /></label>
                          <label>Konec<input type="date" value={promotion.endsAt ?? ""}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, endsAt: e.target.value }))} /></label>
                          <label className="admin-field-wide">Text popupu<textarea value={promotion.text}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, text: e.target.value }))} /></label>
                          <label>Text tlačítka<input type="text" value={promotion.ctaLabel}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, ctaLabel: e.target.value }))} /></label>
                          <label>Odkaz tlačítka<input type="text" value={promotion.ctaHref}
                            onChange={(e) => updatePromotionEditor(editor.editorId, (p) => ({ ...p, ctaHref: e.target.value }))} /></label>
                        </div>

                        {isDirty ? (
                          <div className="admin-project-savebar">
                            <p className="admin-dirty">V téhle akci máš neuložené změny.</p>
                            <div className="admin-project-save-actions">
                              <button type="button" className="btn btn-secondary"
                                onClick={() => requestConfirm({
                                  title: "Zrušit změny?",
                                  message: "Vrátí se poslední uložený stav akce a zahodí se lokální úpravy.",
                                  confirmLabel: "Ano, zrušit změny", tone: "danger",
                                  onConfirm: () => cancelPromotion(editor),
                                })}>
                                Zrušit změny
                              </button>
                              <button type="button" className="btn btn-primary" disabled={isSaving}
                                onClick={() => requestConfirm({
                                  title: "Uložit akci?",
                                  message: "Tímto uložíš tuto promo akci do Firebase databáze.",
                                  confirmLabel: isSaving ? "Ukládám..." : "Ano, uložit akci", tone: "primary",
                                  onConfirm: () => savePromotion(editor),
                                })}>
                                {isSaving ? "Ukládám..." : "Uložit akci"}
                                <Icon name="send" size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-project-savebar is-clean">
                            <p className="admin-clean">Akce je uložená a bez lokálních změn.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>

      {confirmState ? (
        <div className="admin-confirm-backdrop" onClick={() => setConfirmState(null)}>
          <div className="admin-confirm-dialog" onClick={(event) => event.stopPropagation()}>
            <span className="section-label">Potvrzení akce</span>
            <h2>{confirmState.title}</h2>
            <p>{confirmState.message}</p>
            <div className="admin-confirm-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmState(null)}>Zrušit</button>
              <button
                type="button"
                className={`btn ${confirmState.tone === "danger" ? "btn-danger" : "btn-primary"}`}
                onClick={async () => { const action = confirmState.onConfirm; setConfirmState(null); await action(); }}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

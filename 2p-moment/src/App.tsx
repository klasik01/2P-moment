import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { LoginPage } from "./components/LoginPage";
import { AppSelector } from "./components/AppSelector";
import { HiveHouseAdmin } from "./components/HiveHouseAdmin";
import { StavebniAdmin } from "./components/StavebniAdmin";
import type { AdminSection, AppId } from "./types";
import type { StavebniSection } from "./types/stavebni-routing";
import "./styles/main.css";

type AppState = "loading" | "login" | "selector" | AppId;

const DEFAULT_SECTION: AdminSection = "dashboard";
const DEFAULT_STAVEBNI_SECTION: StavebniSection = "projects";

const HIVE_SECTIONS: AdminSection[] = [
  "dashboard",
  "promotions",
  "room",
  "permits",
  "vouchers",
  "statistics",
];

const STAVEBNI_SECTIONS: StavebniSection[] = ["projects", "promotions", "employees"];

function parseHashRoute(): { app: AppId | null; section: string } {
  const rawHash = window.location.hash.replace(/^#\/?/, "");
  const parts = rawHash.split("/").filter(Boolean);
  const appPart = parts[0];

  const app: AppId | null =
    appPart === "hive-house" ? "hive-house" :
    appPart === "stavebni" ? "stavebni" :
    null;

  const section = parts[1] ?? "";
  return { app, section };
}

function setHashRoute(app: AppId | null, section?: string) {
  const nextHash = app ? `#/${app}/${section ?? ""}` : "#/";
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
  }
}

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppId | null>(() => parseHashRoute().app);
  const [hiveSection, setHiveSection] = useState<AdminSection>(() => {
    const { app, section } = parseHashRoute();
    return app === "hive-house" && HIVE_SECTIONS.includes(section as AdminSection)
      ? (section as AdminSection)
      : DEFAULT_SECTION;
  });
  const [stavebniSection, setStavebniSection] = useState<StavebniSection>(() => {
    const { app, section } = parseHashRoute();
    return app === "stavebni" && STAVEBNI_SECTIONS.includes(section as StavebniSection)
      ? (section as StavebniSection)
      : DEFAULT_STAVEBNI_SECTION;
  });

  useEffect(() => {
    const syncFromHash = () => {
      const { app, section } = parseHashRoute();
      setSelectedApp(app);
      if (app === "hive-house" && HIVE_SECTIONS.includes(section as AdminSection)) {
        setHiveSection(section as AdminSection);
      }
      if (app === "stavebni" && STAVEBNI_SECTIONS.includes(section as StavebniSection)) {
        setStavebniSection(section as StavebniSection);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setState(selectedApp ?? "selector");
      } else {
        setState("login");
        setSelectedApp(null);
      }
    });
    return () => unsub();
  }, [selectedApp]);

  const handleAppSelect = (app: AppId) => {
    setSelectedApp(app);
    setState(app);
    if (app === "hive-house") {
      setHiveSection(DEFAULT_SECTION);
      setHashRoute(app, DEFAULT_SECTION);
    } else if (app === "stavebni") {
      setStavebniSection(DEFAULT_STAVEBNI_SECTION);
      setHashRoute(app, DEFAULT_STAVEBNI_SECTION);
    }
  };

  const handleBack = () => {
    setSelectedApp(null);
    setState("selector");
    setHashRoute(null);
  };

  if (state === "loading") {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Načítám...</p>
      </div>
    );
  }

  if (state === "login") {
    return <LoginPage />;
  }

  if (state === "selector" || !selectedApp) {
    return <AppSelector onSelect={handleAppSelect} />;
  }

  if (state === "hive-house" && user) {
    return (
      <HiveHouseAdmin
        userEmail={user.email ?? ""}
        initialSection={hiveSection}
        onSectionChange={(section) => {
          setHiveSection(section);
          setHashRoute("hive-house", section);
        }}
        onBack={handleBack}
      />
    );
  }

  if (state === "stavebni" && user) {
    return (
      <StavebniAdmin
        userEmail={user.email ?? ""}
        initialSection={stavebniSection}
        onSectionChange={(section) => {
          setStavebniSection(section);
          setHashRoute("stavebni", section);
        }}
        onBack={handleBack}
      />
    );
  }

  return null;
}

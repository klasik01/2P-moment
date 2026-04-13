import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { LoginPage } from "./components/LoginPage";
import { AppSelector } from "./components/AppSelector";
import { HiveHouseAdmin } from "./components/HiveHouseAdmin";
import type { AdminSection, AppId } from "./types";
import "./styles/main.scss";

type AppState = "loading" | "login" | "selector" | "hive-house";

const DEFAULT_APP: AppId = "hive-house";
const DEFAULT_SECTION: AdminSection = "dashboard";
const ADMIN_SECTIONS: AdminSection[] = [
  "dashboard",
  "promotions",
  "surroundings",
  "room",
  "permits",
  "vouchers",
  "statistics",
];

function parseHashRoute(): { app: AppId | null; section: AdminSection } {
  const rawHash = window.location.hash.replace(/^#\/?/, "");
  const parts = rawHash.split("/").filter(Boolean);

  const app: AppId | null = parts[0] === "hive-house" ? "hive-house" : null;
  const section = parts[1] && ADMIN_SECTIONS.includes(parts[1] as AdminSection)
    ? (parts[1] as AdminSection)
    : DEFAULT_SECTION;

  return { app, section };
}

function setHashRoute(app: AppId | null, section?: AdminSection) {
  const nextHash = app ? `#/${app}/${section ?? DEFAULT_SECTION}` : "#/";
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
  }
}

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppId | null>(() => parseHashRoute().app);
  const [selectedSection, setSelectedSection] = useState<AdminSection>(() => parseHashRoute().section);

  useEffect(() => {
    const syncFromHash = () => {
      const { app, section } = parseHashRoute();
      setSelectedApp(app);
      setSelectedSection(section);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setState(selectedApp ? selectedApp : "selector");
      } else {
        setState("login");
        setSelectedApp(null);
      }
    });
    return () => unsub();
  }, [selectedApp]);

  const handleAppSelect = (app: AppId) => {
    setSelectedApp(app);
    setSelectedSection(DEFAULT_SECTION);
    setState(app);
    setHashRoute(app, DEFAULT_SECTION);
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
        initialSection={selectedSection}
        onSectionChange={(section) => {
          setSelectedSection(section);
          setHashRoute(DEFAULT_APP, section);
        }}
        onBack={() => {
          setSelectedApp(null);
          setState("selector");
          setHashRoute(null);
        }}
      />
    );
  }

  return null;
}

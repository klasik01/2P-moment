import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { LoginPage } from "./components/LoginPage";
import { AppSelector } from "./components/AppSelector";
import { HiveHouseAdmin } from "./components/HiveHouseAdmin";
import type { AppId } from "./types";
import "./styles/main.scss";

type AppState = "loading" | "login" | "selector" | "hive-house";

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppId | null>(null);

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
    setState(app);
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
        onBack={() => {
          setSelectedApp(null);
          setState("selector");
        }}
      />
    );
  }

  return null;
}

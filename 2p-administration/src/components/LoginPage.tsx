import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Nesprávný e-mail nebo heslo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-shell">
      <section className="admin-login">
        <div className="admin-login-card">
          <span className="section-label">Neveřejná správa</span>
          <h1>2P Administration</h1>
          <p>Administrační systém pro správu obsahu 2P Stavební a 2P Hive House.</p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@2pmoment.cz"
                required
                autoComplete="email"
              />
            </label>
            <label>
              Heslo
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Přihlašuji..." : "Přihlásit se"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

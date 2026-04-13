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
    <div className="moment-login">
      <div className="moment-login-card">
        <div className="brand">
          <span className="hex">⬡</span>
          2P Moment
        </div>
        <div className="brand-sub">Administrační systém</div>

        <h2>Přihlášení</h2>
        <p>Přihlaste se svým firemním účtem.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@2pmoment.cz"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="notice notice-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
            {loading ? "Přihlašuji..." : "Přihlásit se"}
          </button>
        </form>
      </div>
    </div>
  );
}

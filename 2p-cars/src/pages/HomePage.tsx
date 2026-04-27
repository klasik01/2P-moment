import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Načítání…</p>;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>2P Cars</h1>
      <p>Přihlášen jako: {user.email}</p>
      <button onClick={signOut}>Odhlásit se</button>
    </main>
  );
}

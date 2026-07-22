import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { media } from "./services/media";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

function render() {
  createRoot(root!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// Katalog fotek se načte před prvním renderem, aby komponenty mohly
// číst synchronně. Až data poputují z API, změní se jen implementace
// v services/media — tenhle blok zůstane.
//
// `.then()` místo top-level await schválně: TLA by si vynutilo zvednout
// build target a s ním i minimální verze prohlížečů.
media
  .loadCatalog()
  .catch((err) => {
    // Bez fotek je web pořád použitelný — texty a kontakty fungují.
    console.error("[media] Katalog se nepodařilo načíst:", err);
  })
  .finally(render);

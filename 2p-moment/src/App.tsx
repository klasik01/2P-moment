import { useEffect } from "react";
import { landing } from "./data/landing";
import { HeroSection, ProjectsSection, LegalFooter } from "./components/landing";

import "./styles/main.scss";

/**
 * Zastřešující rozcestník 2P Moment. Statický obsah, žádné čekání na
 * data — vykreslí se hned. Odkazuje na jednotlivé projekty.
 */
function App() {
  useEffect(() => {
    document.title = landing.seo.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", landing.seo.description);
  }, []);

  return (
    <div className="landing">
      <HeroSection data={landing.hero} />
      <main>
        <ProjectsSection projects={landing.projects} />
      </main>
      <LegalFooter data={landing.contact} />
    </div>
  );
}

export default App;

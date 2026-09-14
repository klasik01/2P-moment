# Instrukce pro práci v monorepu

- Před implementací si přečti `2p-hive-house/CLAUDE.md`. Je společnou architektonickou referencí pro všechny subprojekty; respektuj přitom existující strukturu konkrétní aplikace.
- Při změně aplikace zvyš její verzi v `package.json` a synchronizuj verzi kořenového balíčku v `package-lock.json`. Pro drobné opravy a obsahové změny zvyš patch verzi; jednou za ucelenou změnu.
- Před dokončením ověř build dotčené aplikace.
- Git eviduje stavební aplikaci jako `2p-Stavebni`, přestože adresář na tomto Macu je `2p-stavebni`. Pro gitové cesty používej `2p-Stavebni`.
- Publicita stavební aplikace používá samostatné PDF a JPG. Při výměně PDF přegeneruj náhled, aktualizuj oba odkazy v `src/data/pages/home/grants.ts` a použij nové názvy kvůli dlouhodobé cache.

Další lokální projektové poznámky od Clauda jsou v
`/Users/klasik/.claude/projects/-Users-klasik-Workspace-Vlastn--projekt-2P-Moment/memory/MEMORY.md`.
Pokud jsou dostupné, přečti index a poznámky relevantní k úkolu.

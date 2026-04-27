# public/ – statické soubory servírované na root

Vite kopíruje celý `public/` 1:1 do `dist/`. Nic tady neprochází bundlerem,
takže cesty jsou absolutní (`/favicon.ico`, `/assets/images/...`).

## Obsah

### Ikony & PWA

| Soubor | Účel |
|---|---|
| `favicon.ico` | Klasický favicon (16×16, multibrowser fallback) |
| `favicon.svg` | Vektorový favicon pro moderní prohlížeče |
| `favicon-16x16.png`, `favicon-32x32.png` | Malé rastrové favicon varianty |
| `apple-touch-icon.png` (180×180) | iOS home-screen |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | Android install / splash |
| `maskable-icon-512x512.png` | PWA maskable ikona (safe zone 20 %) |
| `mstile-150x150.png` | Windows tile |
| `safari-pinned-tab.svg` | Safari pinned tabs (monochromatic) |
| `site.webmanifest` | PWA manifest |
| `browserconfig.xml` | Windows Start menu tile config |

### SEO & meta

| Soubor | Účel |
|---|---|
| `robots.txt` | Crawl directives (povoleno GPTBot, ClaudeBot, Perplexity…) |
| `sitemap.xml` | XML sitemap s image extension |
| `humans.txt` | Team & tech credits |
| `security.txt`, `.well-known/security.txt` | RFC 9116 security kontakt |

### Hosting fallbacky

| Soubor | Účel |
|---|---|
| `_redirects` | Netlify SPA fallback |
| `404.html` | GitHub Pages SPA fallback |

### Brand assets

| Soubor | Účel |
|---|---|
| `assets/images/logo-01.png` | Světlá varianta loga (1205×657) |
| `assets/images/logo-02.png` | Barevná varianta loga (1193×629) |

## Jak regenerovat rastrové ikony

Pokud se změní zdrojové logo, přegeneruj ikony z `logo-02.png` pomocí ImageMagick:

```bash
cd public
LOGO=assets/images/logo-02.png

make_icon () {
  local size=$1 out=$2 pad_pct=$3
  local inner=$(awk -v s=$size -v p=$pad_pct 'BEGIN{ printf "%d", s*(1-2*p/100) }')
  convert -background white -gravity center \
    \( "$LOGO" -resize "${inner}x${inner}>" \) \
    -extent ${size}x${size} "$out"
}

make_icon 180 apple-touch-icon.png 10
make_icon 192 android-chrome-192x192.png 10
make_icon 512 android-chrome-512x512.png 10
make_icon 512 maskable-icon-512x512.png 20
make_icon 150 mstile-150x150.png 12
```

Pro `favicon.ico` nejsnazší cesta je https://realfavicongenerator.net/ – tam
nahraj čtvercovou výseč loga a stáhni multi-size ICO.

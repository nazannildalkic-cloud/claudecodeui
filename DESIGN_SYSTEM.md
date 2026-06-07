# Nanil — Visuelle Designsprache

> „Die Stimme zwischen den Sitzungen."
>
> Nanil ist keine Meditations-App, keine Therapie-App, keine Fitness-App und keine
> typische AI-App. Nanil ist ein **täglicher Begleiter** — eine ruhige Präsenz im
> Raum, keine Software, kein Dashboard, kein Startup.

**Gefühl:** „Da ist eine ruhige Präsenz." Nicht: „Da ist eine App."

**Prioritäten:** 1. Ruhe · 2. Vertrauen · 3. Wärme · 4. Tiefe · 5. Klarheit · 6. Hochwertigkeit

**Verboten:** Neon · Cyberpunk · Startup-Gradienten · bunte Effekte · Gaming-Look · Wellness-Kitsch · Glassmorphism-Explosion · harte Schatten · Neonränder.

Diese Designsprache ist **direkt im Code umgesetzt** — die Tokens leben in
`src/index.css`, sind in `tailwind.config.js` freigeschaltet und über
Utility-Klassen (`nanil-*`) nutzbar.

---

## 1. Farbdesign

Die kanonische Erfahrung ist **dunkel** (`.dark`). Alle Hex-Werte sind als
HSL-Tokens hinterlegt.

| Rolle | Hex | HSL-Token (`--…`) | Token-Name |
|---|---|---|---|
| Background Primary | `#0F1115` | `220 17% 7%` | `--background` |
| Background Secondary | `#171A21` | `222 18% 11%` | `--card` / `--muted` |
| Surface | `#1C212B` | `220 21% 14%` | `--popover` / `--secondary` |
| Primary Accent | `#7C5CFF` | `252 100% 68%` | `--primary` |
| Support Accent | `#7AC7A3` | `152 41% 63%` | `--support` |
| Warm Highlight | `#F2B84B` | `39 87% 62%` | `--warm` |
| Text Primary | `#F8F9FB` | `220 27% 98%` | `--foreground` |
| Text Secondary | `#A0A7B5` | `220 12% 67%` | `--muted-foreground` |

**Eine warme Sprache statt Chaos:** Sämtliche früher verstreuten
`amber`/`orange`/`yellow`-Töne (das „Kackbraun", *jede Seite eine andere Farbe*)
wurden auf den **einen** `--warm`-Token vereinheitlicht (262 Stellen, 22 Dateien).
Es gibt jetzt genau einen warmen Akzent — überall identisch.

Tailwind-Nutzung: `bg-primary`, `text-warm`, `border-warm/30`, `bg-support/10`,
`text-muted-foreground` …

---

## 2. Design-System

### Form & Radius
- `--radius: 1rem` (16px). Alles ist weich gerundet, nichts hat scharfe Kanten.
- Karten & Buttons: `1.25rem`. Großzügig, ruhig, greifbar.

### Licht statt Schatten
- Glows max. **5–10 %** Intensität (`--glow-primary/support/warm`).
- Utilities: `.nanil-glow`, `.nanil-glow-support`, `.nanil-glow-warm`, `.nanil-aura`.
- Keine harten Schatten, keine Neonränder. Die App wirkt wie **Licht im Raum**.

### Typografie
- `.nanil-display` — große, ruhige Überschriften (`clamp(2rem, 6vw, 3rem)`, `line-height 1.1`).
- `.nanil-title` — Abschnittstitel.
- `.nanil-body` — `line-height 1.7`, gedämpfte Sekundärfarbe.
- `.nanil-breathe` — erhöhtes `letter-spacing` für Atem.
- Viel Weißraum, ruhige Zeilenabstände, nichts gedrängt. Der Nutzer soll
  **langsamer werden**.

---

## 3. Dark Mode (kanonisch)

Der dunkle Modus **ist** Nanil. `<html class="dark">`.

```
background  #0F1115   foreground       #F8F9FB
card        #171A21   muted-foreground #A0A7B5
surface     #1C212B   primary          #7C5CFF
border      ~#23262E  support          #7AC7A3   warm #F2B84B
```

Der Hintergrund ist **nie flach**: `body` trägt eine spürbare, nicht sichtbare
Melierung (Default = Echo).

> Ein heller „Tag-Begleiter" existiert (`:root`) für Nutzer, die Light bevorzugen —
> weich, warm, niemals reines Weiß, niedriger Kontrast.

---

## Modi — Melierung

> Der Hintergrund darf niemals flach wirken. Extrem subtile Verläufe:
> **nicht sichtbar, nur spürbar.** Wirkung: Nebel · Abendhimmel · Nordlicht in
> der Ferne · tiefer Ozean. Nie wie Marketing-Gradienten.

Setze die Klasse auf den Seiten-Container (`.nanil-echo`, `.nanil-morning`,
`.nanil-rest`, `.nanil-sleep`).

### 4. Morning Mode — `.nanil-morning`
Etwas mehr Licht, Wärme, Energie. `#0F1115 → #2B2352 → #1A1F2B`
mit zarter Violett- und Warm-Aura oben. Für: *morgens im Bett, Tagesstart.*
Beispiel-CTA: **☀ Morgen starten** (`nanil-btn nanil-btn-warm`).

### 5. Echo Mode — `.nanil-echo` (Default)
Neutrale, ruhige Präsenz. `#0F1115 → #141824 → #171A21` mit leisem
Primär-/Support-Schimmer. Für: *Stress, Verlangen, Überforderung, „Ich brauche Echo".*
Beispiel-CTA: **🌊 Ich brauche Echo** (`nanil-btn nanil-btn-primary`).

### 6. Rest Mode — `.nanil-rest`
Stress-Reduktion: weniger Reize, mehr Dunkelheit. `#0F1115 → #111722 → #0D1016`,
nur ein Hauch Support-Grün. Für: *Überforderung, Runterkommen.*
Beispiel-CTA: **🎯 Fokus finden** (`nanil-btn nanil-btn-soft`).

### 7. Sleep Mode — `.nanil-sleep`
Mehr Tiefe, mehr Dunkelblau, weniger Kontrast. `#0B0E13 → #101521 → #0B0E13`.
Für: *Tagesabschluss, vor dem Einschlafen.*
Beispiel-CTA: **🌙 Tag abschließen** (`nanil-btn nanil-btn-ghost`).

**Emotionale Regel:** Stress → weniger Farbe, weniger Reize, mehr Dunkelheit.
Morgen → mehr Licht, Wärme, Energie. Schlaf → mehr Tiefe, Dunkelblau, weniger Kontrast.

---

## 8. Button-System

Groß. Weich. Ruhig. Gefühl: **„Drück mich."** — nicht „technisches Interface".
Mindesthöhe 56px, Radius 1.25rem, weiches Glühen statt harter Schatten, sanftes
`scale(0.985)` beim Drücken.

| Klasse | Einsatz |
|---|---|
| `nanil-btn nanil-btn-primary` | Hauptaktion (Echo, Primär-Accent + weiches Glühen) |
| `nanil-btn nanil-btn-warm` | Energie/Morgen (Warm Highlight, dunkler Text) |
| `nanil-btn nanil-btn-soft` | Sekundär, ruhige Surface-Fläche |
| `nanil-btn nanil-btn-ghost` | Maximale Ruhe, fast nur Text (z. B. Sleep) |

```html
<button class="nanil-btn nanil-btn-warm">☀ Morgen starten</button>
<button class="nanil-btn nanil-btn-primary">🌊 Ich brauche Echo</button>
<button class="nanil-btn nanil-btn-soft">🎯 Fokus finden</button>
<button class="nanil-btn nanil-btn-ghost">🌙 Tag abschließen</button>
```

---

## 9. Karten-System

Weiche Flächen, viel Atem, kein harter Rand — eine Karte ist eine ruhige
Geste, kein Container.

| Klasse | Einsatz |
|---|---|
| `nanil-card` | Standardkarte: `card`-Fläche, weicher 1px-Rand, sehr weiche Tiefe |
| `nanil-card-quiet` | Noch leiser: halbtransparentes `muted`, kaum Rand |
| `nanil-notice` | Hinweis/Warnung in **einer** warmen Sprache (`warm/10`, `warm/30`) |

```html
<section class="nanil-card nanil-glow">
  <h2 class="nanil-title">Wie fühlst du dich gerade?</h2>
  <p class="nanil-body">Nimm dir einen Moment. Es gibt nichts zu erledigen.</p>
</section>
```

---

## 10. UI-Beispiele (Mobile)

### Echo (Default) — Begleiter-Startbildschirm
```
┌──────────────────────────────┐  ← .nanil-echo (spürbarer Verlauf)
│                                │
│   Guten Abend.                 │  ← .nanil-display
│   Ich bin da.                  │
│                                │
│   ┌──────────────────────┐     │
│   │ 🌊 Ich brauche Echo  │     │  ← nanil-btn nanil-btn-primary (weiches Glühen)
│   └──────────────────────┘     │
│   ┌──────────────────────┐     │
│   │ 🎯 Fokus finden      │     │  ← nanil-btn nanil-btn-soft
│   └──────────────────────┘     │
│                                │
│   Tag abschließen 🌙            │  ← nanil-btn nanil-btn-ghost
└──────────────────────────────┘
```

### Morning — etwas mehr Licht & Wärme
```
┌──────────────────────────────┐  ← .nanil-morning (Violett→Warm Aura)
│   Guten Morgen ☀               │  ← .nanil-display
│   Lass uns ruhig beginnen.     │  ← .nanil-body (muted-foreground)
│                                │
│   ┌──────────────────────┐     │
│   │ ☀ Morgen starten     │     │  ← nanil-btn nanil-btn-warm
│   └──────────────────────┘     │
└──────────────────────────────┘
```

### Sleep — Tiefe, Dunkelblau, wenig Kontrast
```
┌──────────────────────────────┐  ← .nanil-sleep
│                                │
│   Der Tag darf enden.          │  ← .nanil-title (gedämpft)
│                                │
│   ┌──────────────────────┐     │
│   │ 🌙 Tag abschließen   │     │  ← nanil-btn nanil-btn-ghost
│   └──────────────────────┘     │
└──────────────────────────────┘
```

---

## Markenregel

Nanil wirkt wie **eine ruhige Person im Raum** — nicht wie Software, nicht wie
ein Dashboard, nicht wie ein Startup, nicht wie ChatGPT, Headspace, Calm oder
Replika. Sondern wie *die Stimme zwischen den Sitzungen.*

Ziel: die schönste, ruhigste und vertrauenswürdigste Begleiter-App der Welt.

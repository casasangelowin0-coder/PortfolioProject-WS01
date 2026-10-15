# PorfolioProject-WS01 — Personal Portfolio Website

> **Course Project** for the subject **WS01** — submitted in partial fulfillment of the course requirements.

**Student:** Angelo Win Casas
**Subject:** WS01
**Section:** [Your Section — e.g. BSIT 2-1]
**Professor:** [Professor Name]
**School:** [School Name]
**Semester:** [e.g. 1st Semester, A.Y. 2025–2026]

🔗 **Live Site:** https://casasangelowin0-coder.github.io/PortfolioProject-WS01/
💻 **Repository:** https://github.com/casasangelowin0-coder/PorfolioProject-WS01

---

## 1. Project Description

This repository contains my personal portfolio website, developed as my project for **WS01**. The site introduces who I am as a 2nd-year IT student, my interest in Operating Systems and systems programming, my academic journey, selected projects, and a working contact form.

The project demonstrates fundamental web development competencies required in WS01: semantic HTML5 structure, responsive CSS layout, vanilla JavaScript interactivity, form handling, accessibility, and deployment to GitHub Pages using GitHub Actions.

## 2. Objectives

- Build a responsive, multi-section portfolio using HTML, CSS, and JavaScript.
- Apply layout techniques (Flexbox, CSS Grid) and a consistent design system.
- Implement interactive features: dark/light theme, project filtering, detail modals, scroll animations, live world clock, and validated contact form.
- Practice version control with Git/GitHub and automated deployment with GitHub Actions.
- Follow accessibility (WCAG 2.1 AA) and performance best practices.

## 3. Features

- **Hero section** — animated name pop-in, waving emoji, and a **live world-time timer card** (Manila main clock with per-digit rolling animation + LA / New York / London / Paris times).
- **About section** — student bio and skill cards (Systems Programming, Backend & APIs, Learning & Tools).
- **Projects section** — systems-programming projects loaded from `projects.json`, with category filters and detail modals.
- **Journey section** — academic timeline (2nd year, 1st year, self-taught, SHS STEM).
- **Contact section** — validated form powered by Formspree, plus direct email link.
- **Theme toggle** — dark/light mode with `localStorage` persistence and OS preference detection.
- **Responsive + accessible** — mobile-first layout, semantic landmarks, skip link, focus states, `prefers-reduced-motion` support.

## 4. Technologies Used

- HTML5, CSS3 (custom properties, Flexbox, Grid, keyframe animations)
- Vanilla JavaScript (ES modules, `Intl.DateTimeFormat`, Web Animations API, `IntersectionObserver`)
- Formspree (contact form backend)
- GitHub Actions + GitHub Pages (CI/CD and free static hosting)
- Optional local tooling: Node.js + Vite (dev server only — production deploy is static, no build step)

## 5. Project Structure

```
PorfolioProject-WS01/
├── index.html                  # Main page (hero, about, projects, journey, contact, footer)
├── projects.json               # Project data rendered by assets/js/projects.js
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   │   ├── layout.css          # Grid, container, responsive utilities
│   │   ├── components.css      # Buttons, cards, chips, fields, nav, modal, toast
│   │   ├── motion.css          # Animations and transitions
│   │   └── main.css            # Page styles + hero timer card styles
│   ├── js/
│   │   ├── main.js             # Bootstrap entry point
│   │   ├── theme.js            # Dark/light theme
│   │   ├── navigation.js       # Navbar, drawer, smooth scroll, back-to-top
│   │   ├── projects.js         # Project grid, filters, modal
│   │   ├── contact.js          # Validation + Formspree submit + toasts
│   │   ├── motion.js           # Scroll-reveal animations
│   │   ├── hero-swipe.js       # Hero name pop animation
│   │   └── world-time.js       # Live clock + rolling digit animation
│   ├── fonts/                  # Optional self-hosted WOFF2 (system fallback included)
│   └── images/                 # Favicon, og-image, SVG placeholders, project thumbs
└── .github/workflows/
    └── deploy.yml              # Static deploy to GitHub Pages (no build)
```

## 6. How to Run Locally

No build is required. Pick either option:

**Option A — just open it:**
1. Download or clone this repository.
2. Open `index.html` in any modern browser.

**Option B — Live Server (recommended, for `fetch('projects.json')` to work):**
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server** (http://127.0.0.1:5500).

**Option C — Vite dev server (optional):**
```bash
npm install
npm run dev   # http://localhost:3000
```

## 7. Deployment

Hosting is **free via GitHub Pages**:

1. Push to the `main` branch.
2. The workflow in `.github/workflows/deploy.yml` uploads the repository as a static Pages artifact (no `npm build`).
3. In repo **Settings → Pages**, set **Source** to **GitHub Actions**.
4. The site goes live at `https://casasangelowin0-coder.github.io/PorfolioProject-WS01/` after the Actions run turns green.

## 8. Contact

- **Email:** casasangelowin2@gmail.com
- **Facebook:** https://www.facebook.com/Win.AWC?mibextid=rS40aB7S9Ucbxw6v
- **GitHub:** https://github.com/casasangelowin0-coder

Feel free to reach out about OS internals, systems programming, or internship opportunities.

## 9. Acknowledgments

- Course instructor and classmates in WS01 for guidance and feedback.
- Material Design 3 specification for the design language.
- Inter and Roboto Flex typefaces; icons adapted from Material Symbols.

# PortfolioProject-WS01 — Personal Portfolio Website

> **Course Project** for the subject **WS01** — submitted in partial fulfillment of the course requirements.

**Student:** Angelo Win Casas
**Subject:** WS01
**Section:** E053

🔗 **Live Site:** https://casasangelowin0-coder.github.io/PortfolioProject-WS01/
💻 **Repository:** https://github.com/casasangelowin0-coder/PortfolioProject-WS01

---

## 1. Project Description

This repository contains my personal portfolio website, developed as my project for **WS01**. The site introduces who I am as a 2nd-year IT student, my interest in Operating Systems and systems programming, my academic journey, and a working contact form.

The project demonstrates fundamental web development competencies required in WS01: semantic HTML5 structure, responsive CSS layout, vanilla JavaScript interactivity, form handling, accessibility, and deployment to GitHub Pages using GitHub Actions.

## 2. Objectives

- Build a responsive, multi-section portfolio using HTML, CSS, and JavaScript.
- Apply layout techniques (Flexbox, CSS Grid) and a consistent design system.
- Implement interactive features: dark/light theme, scroll animations, live Philippines clock, and a validated contact form.
- Practice version control with Git/GitHub and automated deployment with GitHub Actions.
- Follow accessibility (WCAG 2.1 AA) and performance best practices.

## 3. Features

- **Hero section** — profile avatar, animated name pop-in, waving emoji, and a **live Philippines time card** with per-digit rolling animation and the current date.
- **About section** — student bio and skill cards (Systems Programming, Backend & APIs, Learning & Tools).
- **Journey section** — academic timeline (2nd year, 1st year, SHS Industrial Arts – TVL).
- **Projects section** — showcased projects including this portfolio site, a mini shell in C, and Linux kernel module exploration, each with tech tags and live/repo links.
- **Contact section** — validated form powered by Formspree, plus direct email link.
- **Theme toggle** — dark/light mode with `localStorage` persistence and OS preference detection.
- **Responsive + accessible** — mobile-first layout, semantic landmarks, skip link, focus states, `prefers-reduced-motion` support.

## 4. Technologies Used

- HTML5, CSS3 (custom properties, Flexbox, Grid, keyframe animations)
- Vanilla JavaScript (ES modules, `Intl.DateTimeFormat`, Web Animations API, `IntersectionObserver`)
- Formspree (contact form backend)
- GitHub Actions + GitHub Pages (CI/CD and free static hosting)

## 5. Project Structure

```
PorfolioProject-WS01/
├── index.html                  # Main page (hero, about, journey, projects, contact, footer)
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   │   ├── layout.css          # Grid, container, responsive utilities
│   │   ├── components.css      # Buttons, cards, fields, nav, toast
│   │   ├── motion.css          # Animations and transitions
│   │   └── main.css            # Page styles + hero timer card styles
│   ├── js/
│   │   ├── main.js             # Bootstrap entry point
│   │   ├── theme.js            # Dark/light theme
│   │   ├── navigation.js       # Navbar, drawer, smooth scroll, back-to-top
│   │   ├── contact.js          # Validation + Formspree submit + toasts
│   │   ├── motion.js           # Scroll-reveal animations
│   │   ├── hero-swipe.js       # Hero name pop animation
│   │   └── world-time.js       # Live Philippines clock + rolling digit animation
│   └── images/                 # Favicon, og-image, profile photo
└── .github/workflows/
    └── deploy.yml              # Static deploy to GitHub Pages (no build)
```

## 6. How to Run Locally

No build is required. Pick either option (note: ES modules may need a server, so Live Server is safest):

**Option A — just open it:**
1. Download or clone this repository.
2. Open `index.html` in any modern browser.

**Option B — Live Server:**
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server** (http://127.0.0.1:5500).

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
- Icons adapted from Material Symbols.

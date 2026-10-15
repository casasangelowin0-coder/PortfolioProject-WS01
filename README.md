# Angelo Win Casas — IT Student Portfolio

Google-inspired portfolio website built with vanilla HTML, CSS, and JavaScript. Features Material Design 3 components, dark/light theme, project filtering, and smooth animations.

## About

This is the personal portfolio of **Angelo Win Casas**, a 2nd-year IT student passionate about Operating Systems, systems programming, and low-level development. The portfolio showcases academic journey, systems programming projects, and technical interests.

## Features

- **Material Design 3** component system (buttons, cards, chips, text fields, nav, modal, toast)
- **Dark/Light theme** with persistence and system preference detection
- **Responsive design** (mobile-first, breakpoints at 600/905/1240/1440px)
- **Project showcase** with category filtering and detail modals (systems programming focus)
- **Contact form** with validation (Formspree integration)
- **Smooth animations** with `prefers-reduced-motion` support
- **Accessibility** (WCAG 2.1 AA, semantic HTML, focus management, ARIA)
- **Performance optimized** (<150KB gzipped, 90+ Lighthouse)
- **Zero dependencies** (vanilla JS, no frameworks)
- **Hero name pop animation** with waving emoji

## Quick Start

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── projects.json           # Project data (systems programming projects)
├── package.json            # Build scripts
├── vite.config.js          # Vite configuration
├── .github/workflows/      # GitHub Actions deployment
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Design tokens (colors, spacing, typography)
│   │   ├── layout.css      # Grid, container, section spacing
│   │   ├── components.css  # Material Design components
│   │   ├── motion.css      # Animations & transitions
│   │   └── main.css        # Imports + page-specific styles
│   ├── js/
│   │   ├── theme.js        # Theme management
│   │   ├── navigation.js   # Navbar, mobile drawer, scroll
│   │   ├── projects.js     # Project rendering, filtering, modal
│   │   ├── contact.js      # Form validation, submission
│   │   ├── motion.js       # Scroll reveal animations
│   │   ├── hero-swipe.js   # Hero name pop animation
│   │   └── main.js         # Bootstrap entry point
│   ├── fonts/              # Self-hosted WOFF2 fonts (placeholders)
│   └── images/             # SVG placeholders + project thumbnails
└── dist/                   # Production build output (gitignored)
```

## Customization

### 1. Personal Information

Edit `index.html`:
- Name, title, bio in hero section
- About section content (your OS journey)
- Journey timeline entries (academic + self-taught)
- Contact form endpoint (Formspree)
- Social links in footer (GitHub, LinkedIn, email)

### 2. Projects

Edit `projects.json` with your systems programming projects:
```json
{
  "id": "mini-shell",
  "title": "Mini Shell (C)",
  "description": "A minimal Unix shell with job control and piping",
  "longDescription": "Built a fully functional shell in C...",
  "tags": ["C", "Linux", "POSIX", "Process Management"],
  "category": "backend",
  "thumbnail": "assets/images/projects/mini-shell-thumb.svg",
  "images": ["mini-shell-1.svg", "mini-shell-2.svg"],
  "links": {
    "github": "https://github.com/yourusername/mini-shell",
    "live": null,
    "caseStudy": null
  },
  "featured": true
}
```

Categories: `backend`, `frontend`, `fullstack` (filter chips in UI)

Add thumbnails to `assets/images/projects/` (recommended: 400×250px, SVG or WebP).

### 3. Colors & Theme

Edit `assets/css/tokens.css`:
- Change `--seed` color to generate new palette (default: Google Blue `#1a73e8`)
- Override individual color tokens
- Modify spacing, typography, border radius scales

### 4. Fonts

Replace placeholder files in `assets/fonts/`:
- `inter-var.woff2` (variable font, 100-900)
- `inter-italic-var.woff2`
- `robotoflex-var.woff2`

Download from:
- [Inter](https://github.com/rsms/inter/releases) → `InterVariable.woff2`
- [Roboto Flex](https://github.com/googlefonts/robotoflex/releases) → `RobotoFlex-VariableFont.woff2`

CSS has `local()` fallbacks so system fonts work without custom fonts.

### 5. Contact Form

1. Create free Formspree account at formspree.io
2. Create new form and get endpoint
3. Replace `FORMSPREE_ENDPOINT` in `assets/js/contact.js`

### 6. Social Links

Update footer in `index.html`:
- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourprofile`
- Email: `mailto:your.email@domain.com`

## Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. GitHub Actions builds and deploys to `gh-pages` branch
3. Enable GitHub Pages in repository settings (source: `gh-pages` branch)
4. Site available at `https://username.github.io/repository-name/`

### Custom Domain

1. Add `CNAME` file to `dist/` after build with your domain
2. Configure DNS (CNAME to `username.github.io` or A records to GitHub Pages IPs)
3. Enable "Enforce HTTPS" in GitHub Pages settings

### Other Platforms

The `dist/` folder contains static files deployable anywhere:
- Netlify, Vercel, Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting

## Performance

- **Total size**: ~120KB gzipped (HTML + CSS + JS)
- **Images**: Optimized SVG/WebP, lazy-loaded
- **Fonts**: Self-hosted variable fonts (WOFF2) with system fallbacks
- **CSS**: Minified, critical path optimized
- **JS**: Minified, code-split by module
- **Caching**: Long-term cache headers via Vite hashing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## Accessibility

- Semantic HTML5 landmarks
- ARIA labels and roles
- Focus visible states
- Color contrast 4.5:1 (AA)
- Keyboard navigation
- Screen reader support
- Reduced motion respect
- Skip links

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

## License

MIT License — feel free to use for your own portfolio.

## Credits

- Material Design 3 specifications
- Inter font by Rasmus Andersson
- Roboto Flex font by Google Fonts
- Icons adapted from Material Symbols
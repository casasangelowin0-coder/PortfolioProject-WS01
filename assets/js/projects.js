/**
 * Projects Module
 * Fetches project data, renders grid, handles filtering and modal detail view
 */

const PROJECTS_API = 'projects.json';
const GRID_SELECTOR = '#projects-grid';
const MODAL_SELECTOR = '#project-modal';
const MODAL_CONTENT_SELECTOR = '#modal-content';
const MODAL_TITLE_SELECTOR = '#modal-title';
const FILTER_SELECTOR = '.chip--filter';

let allProjects = [];
let currentFilter = 'all';

export async function initProjects() {
  try {
    const response = await fetch(PROJECTS_API);
    if (!response.ok) throw new Error('Failed to load projects');
    allProjects = await response.json();
    renderProjects();
    initFilters();
    initModal();
  } catch (error) {
    console.error('Projects init error:', error);
    renderErrorState();
  }
}

function renderProjects() {
  const grid = document.querySelector(GRID_SELECTOR);
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === currentFilter);

  grid.innerHTML = filtered.map((project, index) => `
    <article class="card card--elevated project-card reveal" style="animation-delay: ${index * 50}ms" data-project-id="${project.id}" role="listitem">
      <div class="project-card__media-wrapper">
        <img
          class="project-card__media"
          src="${project.thumbnail}"
          alt=""
          loading="lazy"
          width="400"
          height="250"
        >
      </div>
      <div class="project-card__content">
        <div class="project-card__meta">
          ${project.tags.slice(0, 3).map(tag => `<span class="project-card__tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
        <p class="project-card__desc">${escapeHtml(project.description)}</p>
        <div class="project-card__links">
          <button class="project-card__link project-card__link--details" data-project-id="${project.id}" type="button">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            Details
          </button>
          ${project.links.github ? `
            <a href="${project.links.github}" class="project-card__link" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.title)} on GitHub">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Code
            </a>
          ` : ''}
          ${project.links.live ? `
            <a href="${project.links.live}" class="project-card__link" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.title)} live demo">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Demo
            </a>
          ` : ''}
        </div>
      </div>
    </article>
  `).join('');

  // Trigger reveal animations
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--visible');
    });
  });

  // Add click handlers for detail buttons
  grid.querySelectorAll('.project-card__link--details').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.projectId;
      openProjectModal(projectId);
    });
  });
}

function initFilters() {
  const filters = document.querySelectorAll(FILTER_SELECTOR);
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const newFilter = filter.dataset.filter;
      if (newFilter === currentFilter) return;

      currentFilter = newFilter;

      // Update ARIA
      filters.forEach(f => {
        f.setAttribute('aria-selected', f.dataset.filter === newFilter);
      });

      // Re-render with animation
      const grid = document.querySelector(GRID_SELECTOR);
      if (grid) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';

        setTimeout(() => {
          renderProjects();
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });
}

function initModal() {
  const modal = document.querySelector(MODAL_SELECTOR);
  const closeBtn = document.getElementById('modal-close');
  const closeBtn2 = document.getElementById('modal-close-btn');
  const backdrop = modal?.querySelector('.modal__backdrop');

  const closeModal = () => {
    modal?.classList.remove('modal--open');
    modal?.setAttribute('hidden', '');
    document.body.style.overflow = '';
    history.pushState(null, '', window.location.pathname);
  };

  closeBtn?.addEventListener('click', closeModal);
  closeBtn2?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // Handle hash changes for deep linking
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('project-')) {
      openProjectModal(hash.replace('project-', ''));
    } else {
      closeModal();
    }
  });

  // Check initial hash
  if (window.location.hash.startsWith('#project-')) {
    openProjectModal(window.location.hash.replace('#project-', ''));
  }
}

function openProjectModal(projectId) {
  const project = allProjects.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.querySelector(MODAL_SELECTOR);
  const titleEl = document.querySelector(MODAL_TITLE_SELECTOR);
  const contentEl = document.querySelector(MODAL_CONTENT_SELECTOR);

  if (!modal || !titleEl || !contentEl) return;

  titleEl.textContent = project.title;
  contentEl.innerHTML = `
    <div class="project-detail">
      <img
        class="project-detail__media"
        src="${project.thumbnail}"
        alt="${escapeHtml(project.title)} screenshot"
        loading="eager"
        width="720"
        height="405"
      >
      <div class="project-detail__meta">
        ${project.tags.map(tag => `<span class="project-detail__tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p class="project-detail__desc">${escapeHtml(project.longDescription)}</p>
      <div class="project-detail__links">
        ${project.links.github ? `
          <a href="${project.links.github}" class="btn btn--outlined" target="_blank" rel="noopener">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            View Code
          </a>
        ` : ''}
        ${project.links.live ? `
          <a href="${project.links.live}" class="btn btn--filled" target="_blank" rel="noopener">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>
        ` : ''}
        ${project.links.caseStudy ? `
          <a href="${project.links.caseStudy}" class="btn btn--text" target="_blank" rel="noopener">
            Case Study
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ` : ''}
      </div>
    </div>
  `;

  modal.classList.add('modal--open');
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // Update URL for deep linking
  history.pushState(null, '', `#project-${projectId}`);

  // Focus management
  setTimeout(() => {
    const closeBtn = document.getElementById('modal-close');
    closeBtn?.focus();
  }, 100);
}

function renderErrorState() {
  const grid = document.querySelector(GRID_SELECTOR);
  if (grid) {
    grid.innerHTML = `
      <div class="card card--outlined" style="grid-column: 1 / -1; text-align: center; padding: var(--space-12);">
        <p style="color: var(--color-on-surface-variant);">Unable to load projects. Please try again later.</p>
      </div>
    `;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
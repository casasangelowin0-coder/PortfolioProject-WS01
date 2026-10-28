const NAVBAR_SCROLLED_CLASS = 'navbar--scrolled';
const DRAWER_OPEN_CLASS = 'drawer--open';
const BACKDROP_VISIBLE_CLASS = 'drawer__backdrop--visible';
export function initNavigation() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbar-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerItems = drawer?.querySelectorAll('.drawer__item');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"], .drawer__item[data-target]');
  const backToTop = document.getElementById('back-to-top');
  const handleScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle(NAVBAR_SCROLLED_CLASS, y > 10);
    backToTop?.classList.toggle('back-to-top--visible', y > 300);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  if (toggle && drawer && backdrop) {
    const openDrawer = () => {
      drawer.classList.add(DRAWER_OPEN_CLASS);
      backdrop.classList.add(BACKDROP_VISIBLE_CLASS);
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstItem = drawer.querySelector('.drawer__item');
      if (firstItem) firstItem.focus();
    };
    const closeDrawer = () => {
      drawer.classList.remove(DRAWER_OPEN_CLASS);
      backdrop.classList.remove(BACKDROP_VISIBLE_CLASS);
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      if (drawer.classList.contains(DRAWER_OPEN_CLASS)) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
    backdrop.addEventListener('click', closeDrawer);
    drawerItems?.forEach(item => {
      item.addEventListener('click', () => {
        closeDrawer();
        const target = item.dataset.target;
        if (target) {
          smoothScrollTo(target);
        }
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains(DRAWER_OPEN_CLASS)) {
        closeDrawer();
        toggle.focus();
      }
    });
  }
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || `#${link.dataset.target}`;
      if (href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href.slice(1));
      }
    });
  });
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        updateActiveLink(id);
      }
    });
  }, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));
  function updateActiveLink(activeId) {
    document.querySelectorAll('.navbar__link, .drawer__item').forEach(link => {
      const href = link.getAttribute('href') || `#${link.dataset.target}`;
      if (href === `#${activeId}`) {
        link.classList.add('navbar__link--active');
        link.classList.add('drawer__item--active');
      } else {
        link.classList.remove('navbar__link--active');
        link.classList.remove('drawer__item--active');
      }
    });
  }
}
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar?.offsetHeight || 64;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  history.pushState(null, '', `#${targetId}`);
}
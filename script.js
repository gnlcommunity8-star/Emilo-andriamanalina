/* =========================================================
   Portfolio — scripts
   1. Menu mobile accessible
   2. Barres de compétences animées au défilement
   3. Lien actif dans la navigation
   4. Photo de secours si emilo.jpeg est introuvable
   5. Année automatique dans le pied de page
   ========================================================= */
(function () {
  'use strict';

  const MOBILE_QUERY = window.matchMedia('(max-width: 900px)');

  /* ---------- 1. Menu mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-principal');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Fermer après le choix d'un lien
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && MOBILE_QUERY.matches) setMenu(false);
    });

    // Fermer avec Échap et rendre le focus au bouton
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // Fermer en cliquant en dehors
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' &&
          !menu.contains(e.target) && !toggle.contains(e.target)) {
        setMenu(false);
      }
    });

    // Réinitialiser si on repasse en affichage bureau
    MOBILE_QUERY.addEventListener('change', function (e) {
      if (!e.matches) setMenu(false);
    });
  }

  /* ---------- 2. Barres de compétences ---------- */
  const skillCards = document.querySelectorAll('.skill-card');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillCards.forEach(function (card) { skillObserver.observe(card); });
  } else {
    // Navigateur ancien : afficher directement les valeurs
    skillCards.forEach(function (card) { card.classList.add('is-visible'); });
  }

  /* ---------- 3. Lien actif dans la navigation ---------- */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- 4. Photo de secours ---------- */
  const photo = document.querySelector('.photo');
  if (photo) {
    const showFallback = function () {
      const frame = photo.closest('.photo-frame');
      if (frame) frame.classList.add('is-missing');
    };
    // L'image a pu échouer avant l'exécution du script
    if (photo.complete && photo.naturalWidth === 0) showFallback();
    photo.addEventListener('error', showFallback);
  }

  /* ---------- 5. Année du pied de page ---------- */
  const year = document.getElementById('annee');
  if (year) year.textContent = String(new Date().getFullYear());
})();

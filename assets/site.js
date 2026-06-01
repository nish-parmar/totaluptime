/* ---------------------------------------------------------------------
 * Total Uptime — shared Alpine.js components.
 *  - megaNav     : desktop products/solutions hover/click mega menus
 *  - mobileNav   : right-side drawer with expandable groups, pinned CTA
 *  - onThisPage  : the new in-page nav. Mobile = floating "On this page"
 *                  pill that opens a full sheet (replaces the broken
 *                  horizontal-scroll sticky bar). Desktop = sticky pill row.
 * ------------------------------------------------------------------ */

document.addEventListener('alpine:init', () => {
  Alpine.data('megaNav', () => ({
    active: null,
    open(key)   { this.active = key; },
    close(key)  { if (this.active === key) this.active = null; },
    toggle(key) { this.active = this.active === key ? null : key; },
    closeAll()  { this.active = null; },
  }));

  Alpine.data('mobileNav', () => ({
    open: false,
    expanded: {},
    toggle() {
      this.open = !this.open;
      document.documentElement.style.overflow = this.open ? 'hidden' : '';
    },
    close() {
      this.open = false;
      document.documentElement.style.overflow = '';
    },
    expand(key) { this.expanded[key] = !this.expanded[key]; },
  }));

  Alpine.data('onThisPage', (sectionIds = []) => ({
    sections: sectionIds,
    active: sectionIds[0] || '',
    sheetOpen: false,
    observer: null,
    init() {
      // Scrollspy via IntersectionObserver — keeps the active pill in sync
      // with whatever's roughly at the top of the viewport.
      const opts = { rootMargin: '-30% 0px -60% 0px', threshold: 0 };
      this.observer = new IntersectionObserver((entries) => {
        // Pick the entry closest to the top that's intersecting.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
        if (hit) this.active = hit.target.id;
      }, opts);
      this.sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) this.observer.observe(el);
      });
    },
    destroy() { this.observer?.disconnect(); },
    openSheet()  { this.sheetOpen = true;  document.documentElement.style.overflow = 'hidden'; },
    closeSheet() { this.sheetOpen = false; document.documentElement.style.overflow = ''; },
    goTo(id, e) {
      e?.preventDefault();
      this.active = id;
      this.closeSheet();
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    },
  }));
});

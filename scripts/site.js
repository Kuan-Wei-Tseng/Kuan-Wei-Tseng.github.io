// A single navigation list stays usable without JavaScript. Older browsers
// without Popover show the links in flow instead of needing a dependency.
const header = document.querySelector('.site-header');
const inner = header.querySelector('.header-inner');
const menu = document.getElementById('navDemo');
const button = header.querySelector('.menu-button');
const nativePopover = Object.hasOwn(HTMLElement.prototype, 'popover');
let lastWidth = 0;
let frame;

function updateNavigation() {
  const width = inner.clientWidth;
  const wide = header.classList.contains('is-wide');
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  if (!nativePopover) {
    menu.removeAttribute('popover');
    button.hidden = true;
    return;
  }
  // Remeasure a collapsed menu only when more space becomes available.
  if (!wide && width <= lastWidth) return;
  lastWidth = width;
  const wasOpen = menu.matches(':popover-open');
  header.classList.add('is-measuring', 'is-wide');
  menu.removeAttribute('popover');
  const fits = inner.scrollWidth <= inner.clientWidth;
  header.classList.toggle('is-wide', fits);
  if (!fits) {
    menu.setAttribute('popover', 'auto');
    if (wasOpen) menu.showPopover();
  }
  requestAnimationFrame(() => {
    header.classList.remove('is-measuring');
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  });
}

function scheduleNavigation() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateNavigation);
}

if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(scheduleNavigation);
  observer.observe(inner);
  observer.observe(menu);
} else {
  window.addEventListener('resize', scheduleNavigation);
}
updateNavigation();

menu.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a');
  if (link && nativePopover && menu.matches(':popover-open')) {
    event.preventDefault();
    menu.hidePopover();
    // Keep keyboard focus on the destination, rather than on a now-hidden link.
    const target = document.querySelector(link.hash);
    const heading = target?.querySelector('h2');
    if (target) {
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      target.scrollIntoView({ block: 'start' });
    }
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    } else {
      button.focus({ preventScroll: true });
    }
  }
});

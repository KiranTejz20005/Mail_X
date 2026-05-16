import type { NavigateFunction } from 'react-router-dom';

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function navigateToSection(
  pathname: string,
  navigate: NavigateFunction,
  sectionId: string
) {
  const hash = sectionId.startsWith('#') ? sectionId : `#${sectionId}`;

  if (pathname === '/') {
    scrollToSection(sectionId.replace(/^#/, ''));
    return;
  }

  navigate({ pathname: '/', hash });
}

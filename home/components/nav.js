import {a, tag} from '../scripts/grecha.js';

import {socialSection} from './socialButtons.js';

export function navSection() {
  const saved = localStorage.getItem('theme');
  const fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ?
      'dark' :
      'light';
  document.documentElement.dataset.theme = saved || fallback;
  const currentHash = window.location.hash.replace(/^#/, '');
  const currentRoute = currentHash || '/';
  const isHomeRoute = currentRoute === '/';

  const isDark = document.documentElement.dataset.theme === 'dark';
  const toggleInput = tag('input')
                          .att$('type', 'checkbox')
                          .att$('id', 'theme-toggle')
                          .att$('checked', isDark ? '' : null);

  const toggleSwitch =
      tag('label', toggleInput, tag('span')).att$('class', 'theme-switch');

  const centerContent = isHomeRoute ?
      tag('div').att$('class', 'nav-center') :
      tag('div', a('Back to Home')
                      .att$('href', '#/')
                      .att$('class', 'back-home-link'))
          .att$('class', 'nav-center');

  const navEl = tag(
                   'nav',
                   tag('div', toggleSwitch).att$('class', 'nav-left'),
                   centerContent,
                   tag('div', socialSection()).att$('class', 'nav-right'))
                    .att$('class', 'navbar');

  navEl.querySelector('#theme-toggle').addEventListener('change', (e) => {
    const next = e.target.checked ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    const githubIcon = navEl.querySelector('#github-icon');
    if (githubIcon) {
      githubIcon.setAttribute(
          'src',
          next === 'dark' ? 'images/github-dark.png' :
                            'images/github-light.png');
    }
  });

  //   const projectsLink = navEl.querySelector('#projects-link');
  //   if (projectsLink) {
  //     projectsLink.addEventListener('click', (e) => {
  //       e.preventDefault();
  //       const projectsSection = document.querySelector('#projects');
  //       if (projectsSection) {
  //         projectsSection.scrollIntoView({behavior: 'smooth', block:
  //         'start'});
  //       }
  //     });
  //   }
  return navEl;
}

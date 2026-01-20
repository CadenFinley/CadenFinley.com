import {a, tag} from '../scripts/grecha.js';

import {socialSection} from './socialButtons.js';

export function navSection() {
  const saved = localStorage.getItem('theme');
  const fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ?
      'dark' :
      'light';
  document.documentElement.dataset.theme = saved || fallback;

  const isDark = document.documentElement.dataset.theme === 'dark';
  const toggleInput = tag('input')
                          .att$('type', 'checkbox')
                          .att$('id', 'theme-toggle')
                          .att$('checked', isDark ? '' : null);

  const toggleSwitch =
      tag('label', toggleInput, tag('span')).att$('class', 'theme-switch');

  const navEl = tag('nav',
                    /*a('Resume')
                      .att$('href', 'images/Caden_Finley_resume.pdf')
                      .att$('target', '_blank'),*/
                    /*a('Projects').att$('href', '#projects').att$('id',
                       'projects-link'),*/
                    toggleSwitch)
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

  navEl.querySelector('#projects-link').addEventListener('click', (e) => {
    e.preventDefault();
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });

  navEl.appendChild(socialSection());

  return navEl;
}

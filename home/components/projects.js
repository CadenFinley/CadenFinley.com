import {a, h2, p, tag} from '../scripts/grecha.js';

const PROJECT_CONFIG = {
  'CadenFinley.com': {
    title: 'CadenFinley.com — My personal website & resume',
    description: 'My personal dev portfolio',
    order: 2
  },
  'CJsShell': {
    title:
        'CJ\'s Shell (cjsh) — POSIX shell scripting meets modern shell features ',
    description: [
      'Built in are a POSIX shell interpreter with bash extensions, customizable keybindings, syntax highlighting, fuzzy completions, smart directory navigation, advanced history search, multiline editing, spell corrections, typeahead, and rich prompts. Everything ships in one binary with a single vendored dependency, so cjsh works out of the box on all *nix-like systems and Windows via WSL. cjsh delivers a POSIX+ experience, standard scripting semantics with an enhanced interactive layer that you can fully customize. cjsh has been in development for over 1 full year now and is now my default login shell for my MacOS and Linux work stations with no fallbacks built in onto other shells.',
      'In cjsh lies another one of my long term projects, isolcine. isocline was originally a project started by Daan Leijan ( https://github.com/daanx/isocline ) which I have now HEAVILY adapted to work within cjsh to give it its super rich interactions. cjsh is about ~50k lines of code all in, ~15k of which is now c code in the form of isocline. While I am planning on having a traditional fork of this version of isocline that I package with cjsh, at the moment this does not exist.',
      'This project as an accompaning CI suite that covers ~1600 tests for cjsh that cover an immense multitude of things. cjsh is also packed on AUR and on homebrew for ease of installation and use. Additionally, cjsh uses CMake so it is pretty much universally buildable on all *nix systems. cjsh is also heavily documented via github pages which is accessable here: https://cadenfinley.github.io/CJsShell/',
      'I love talking about this project and answering any and all questions about this project as it is single handedly the poject I have learned the most from and it has been my brain child for quite some time now and has taken a majority of my focus at times. So please, reach out and ask me literally anything about this project, I would love to talk about it.'
    ],
    order: 1
  },
  'ASCII-Adventurer': {
    title: 'ASCII Adventurer — CLI Text Adventure Game',
    description:
        'Built a text-based adventure game with randomized world generation, AI-generated storylines, and encrypted save states. Strengthened skills in data structures, file serialization, and user input parsing.',
    order: 3
  }
};

export function projectsSection() {
  const section =
      tag('section', h2('Notable Projects'),
          tag('div', p('Loading projects...').att$('class', 'loading-message'))
              .att$('class', 'projects-container'))
          .att$('class', 'section')
          .att$('id', 'projects');

  setTimeout(() => loadProjects(), 0);

  return section;
}

async function loadProjects() {
  const projectsContainer =
      document.querySelector('#projects .projects-container');
  const loadingMessage = projectsContainer.querySelector('.loading-message');

  try {
    const response =
        await fetch('https://api.github.com/users/CadenFinley/repos');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const repos = await response.json();

    const featuredRepos = repos.filter(repo => PROJECT_CONFIG[repo.name])
                              .sort(
                                  (a, b) => PROJECT_CONFIG[a.name].order -
                                      PROJECT_CONFIG[b.name].order);

    if (loadingMessage) {
      loadingMessage.remove();
    }

    if (featuredRepos.length === 0) {
      projectsContainer.innerHTML =
          '<p>No featured repositories found. Please visit my <a href="https://github.com/CadenFinley" target="_blank">GitHub profile</a> directly.</p>';
      return;
    }

    for (const repo of featuredRepos) {
      const config = PROJECT_CONFIG[repo.name];
      const projectBox = createProjectElement(repo, config);
      projectsContainer.appendChild(projectBox);

      await loadProjectLanguages(repo, projectBox);
    }

  } catch (error) {
    console.error('Error fetching repositories:', error);
    if (loadingMessage) {
      loadingMessage.remove();
    }
    projectsContainer.innerHTML = `
      <p class="error-message">
        Failed to load GitHub projects. Please visit my 
        <a href="https://github.com/CadenFinley" target="_blank">GitHub profile</a> directly.
        <br><small>Error: ${error.message}</small>
      </p>
    `;
  }
}

function createProjectElement(repo, config) {
  const projectBox = document.createElement('div');
  projectBox.className = 'project-box';

  let projectContent = `
    <h3><a href="${repo.html_url}" target="_blank">${config.title}</a></h3>
    <p class="project-languages">Languages: <span class="loading">Loading...</span></p>
    <div class="project-description-group"></div>
  `;

  projectContent += `
    <div class="project-meta">
      <span class="project-stars">⭐ ${repo.stargazers_count}</span>
      <span class="project-updated">Updated: ${
      new Date(repo.updated_at).toLocaleDateString()}</span>
    </div>
  `;

  projectBox.innerHTML = projectContent;

  const descriptionGroup =
      projectBox.querySelector('.project-description-group');
  const descriptionParagraphs = Array.isArray(config.description) ?
      config.description :
      [config.description];

  if (descriptionGroup) {
    descriptionParagraphs.filter(Boolean).forEach((text) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'project-description';
      appendTextWithLinks(paragraph, text);
      descriptionGroup.appendChild(paragraph);
    });
  }

  projectBox.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      window.open(repo.html_url, '_blank');
    }
  });

  return projectBox;
}

function appendTextWithLinks(element, text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const precedingText = text.slice(lastIndex, match.index);

    if (precedingText) {
      element.appendChild(document.createTextNode(precedingText));
    }

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.textContent = url;
    element.appendChild(linkElement);

    lastIndex = match.index + url.length;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    element.appendChild(document.createTextNode(remainingText));
  }
}

async function loadProjectLanguages(repo, projectElement) {
  try {
    const response = await fetch(repo.languages_url);
    const languages = await response.json();

    const languagesText = Object.keys(languages).join(', ') || 'Not specified';
    const languagesElement =
        projectElement.querySelector('.project-languages span');

    if (languagesElement) {
      languagesElement.textContent = languagesText;
      languagesElement.classList.remove('loading');
    }
  } catch (error) {
    console.error(`Error fetching languages for ${repo.name}:`, error);
    const languagesElement =
        projectElement.querySelector('.project-languages span');
    if (languagesElement) {
      languagesElement.textContent = 'Unable to load';
      languagesElement.classList.remove('loading');
    }
  }
}

import {a, h2, p, tag} from '../scripts/grecha.js';

const PROJECT_CONFIG = {
  'CadenFinley.com': {
    title: 'CadenFinley.com - My personal website & resume',
    description: 'My personal dev portfolio. Previously this was a well featured very fancy looking webpage with a websocket based, databased, JWT secured web chat service. I have since removed all of this and opted for a much simpler webpage as I feel that reflects more of who I am.',
    order: 3
  },
  'CJsShell': {
    title:
        'CJ\'s Shell (cjsh) - POSIX shell scripting meets modern shell features ',
    description: [
      'Built in are a POSIX shell interpreter with bash extensions, customizable keybindings, syntax highlighting, fuzzy completions, smart directory navigation, advanced history search, multiline editing, spell corrections, typeahead, and rich prompts. Everything ships in one binary with a single vendored dependency, so cjsh works out of the box on all *nix-like systems and Windows via WSL. cjsh delivers a POSIX+ experience, standard scripting semantics with an enhanced interactive layer that you can fully customize. cjsh has been in development for over 1 full year now and is now my default login shell for my MacOS and Linux work stations with no fallbacks built in onto other shells.',
      'In cjsh lies another one of my long term projects, isocline. isocline was originally a project started by Daan Leijan ( https://github.com/daanx/isocline ) which I have now HEAVILY adapted to work within cjsh to give it its super rich interactions which is found here: https://github.com/CadenFinley/isocline cjsh is about ~50k lines of code all in, ~15k of which is now c code in the form of isocline. This fork of isocline now exists and is displayed below.',
      'This project as an accompaning CI suite that covers ~1600 tests for cjsh that cover an immense multitude of things. cjsh is also packed on AUR and on homebrew for ease of installation and use. Additionally, cjsh uses CMake so it is pretty much universally buildable on all *nix systems. cjsh is also heavily documented via github pages which is accessable here: https://cadenfinley.github.io/CJsShell/',
      'I love talking about this project and answering any and all questions about this project as it is single handedly the poject I have learned the most from and it has been my brain child for quite some time now and has taken a majority of my focus at times. So please, reach out and ask me literally anything about this project, I would love to talk about it.'
    ],
    order: 1
  },
  'isocline': {
    title:
      'isocline - Modern alternative to GNU readline',
      description: [
        'When I first started looking for a line editor for cjsh I was 100% convinced I was going to create my own as alll other options I found just didnt have what I was looking for. I got pretty for in this project but I realized that it was taking a lot of development time away from cjsh. That was when I found isocline. isocline was a game changer. It, out of the box, had most of the features I was looking for as I was looking for something that would be similar to reedline from nushell or the line editor from fish. While isocline was not as advanced as these products, it had what was important to use as a base to build off of. It had \'matured\' or I guess in other ways was depreciated, but it was no long recieving many updates. So I did not have to worry about upstream changes breaking all of my changes. It was also MIT licensed which was great as cjsh is MIT licensed and I would be able to make all of my changes without violating any copyrights. It also had some of the basics of every feature that I wanted. And lastly, the actual code inside was concise and clean ( well as much as C code can be ) and it was really easy to see what everything should be doing.',
        'Some of the features that I was looking for, isocline had it all, mostly. Syntax highlighting, multiline editing, completions, history controls and searching, and a well documented api. Since starting working with isocline basically every feature has been touched. Every feature has been expanded upon and is much more powerful, and every feature can be dialed up or down. All of this is accessable though the isocline api and allows me to have feature toggles via \'cjshopt\' in cjsh. One main feature that I had to build from the ground up was the status underline, and the live updating completions menu. Both of these features are found in IDE\'s and in other more modern shells like fish and nushell, and even smaller shells like elvish and murex. Once these features were in place the shells line editing functionality was vastly improved. Another feature I introduced was logical vs physical lines and line numbers. This allowed native multiline script writing which is just flat out missing from other shells.',
        'This \'micro\' project is one of the things that truly brought my vision of cjsh to life and It really ties it all together and makes the terminal really intuitive to use. This project can be found here: https://github.com/CadenFinley/isocline and I try to keep this fork as updated as possible, but the src/isocline directory in cjsh is always up to date.'
      ],
      order: 2
},
  'ASCII-Adventurer': {
    title: 'ASCII Adventurer - CLI Text Adventure Game',
    description:
        'Built a text-based adventure game with randomized dungeon generation, AI-generated storylines, and encrypted save states. Strengthened skills in data structures, file serialization, and user input parsing.',
    order: 4
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
    const isInteractive = e.target.closest('a, button');
    const isDescription = e.target.closest('.project-description-group');

    if (!isInteractive && !isDescription) {
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

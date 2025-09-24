import { tag, a, h2, p } from "../grecha.js";

const PROJECT_CONFIG = {
  'CadenFinley.com': {
    title: 'CadenFinley.com — Personal Website & AI Chatbot',
    description: 'Developed a full-stack website acting as an interactive online resume with user authentication, real-time messaging system, and a built-in AI chatbot. Utilized web sockets, database management, secure login protocols, and frontend/backend integration.',
    order: 2
  },
  'CJsShell': {
    title: 'CJ\'s Shell (cjsh) — Custom Developer-Focused Login Shell',
    description: 'Designed and implemented a 90% POSIX-compatible login shell with a built-in AI assistant, plugin engine, and theme system. Developed in C++, integrated external libraries, and created automated install scripts for macOS/Linux.',
    order: 1
  },
  'ASCII-Adventurer': {
    title: 'ASCII Adventurer — CLI Text Adventure Game',
    description: 'Built a text-based adventure game with randomized world generation, AI-generated storylines, and encrypted save states. Strengthened skills in data structures, file serialization, and user input parsing.',
    order: 3
  }
};

export function projectsSection() {
  const section = tag("section",
    h2("Notable Projects"),
    tag("div", 
      p("Loading projects...").att$("class", "loading-message")
    ).att$("class", "projects-container")
  ).att$("class", "section").att$("id", "projects");
  
  setTimeout(() => loadProjects(), 0);
  
  return section;
}

async function loadProjects() {
  const projectsContainer = document.querySelector('#projects .projects-container');
  const loadingMessage = projectsContainer.querySelector('.loading-message');
  
  try {
    const response = await fetch('https://api.github.com/users/CadenFinley/repos');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const repos = await response.json();
    
    const featuredRepos = repos
      .filter(repo => PROJECT_CONFIG[repo.name])
      .sort((a, b) => PROJECT_CONFIG[a.name].order - PROJECT_CONFIG[b.name].order);
    
    if (loadingMessage) {
      loadingMessage.remove();
    }
    
    if (featuredRepos.length === 0) {
      projectsContainer.innerHTML = '<p>No featured repositories found. Please visit my <a href="https://github.com/CadenFinley" target="_blank">GitHub profile</a> directly.</p>';
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
  
  // Base content for all projects
  let projectContent = `
    <h3><a href="${repo.html_url}" target="_blank">${config.title}</a></h3>
    <p class="project-languages">Languages: <span class="loading">Loading...</span></p>
    <p class="project-description">${config.description}</p>
  `;
  
  // Add special buttons for CadenFinley.com project
  if (repo.name === 'CadenFinley.com') {
    projectContent += `
      <div class="project-buttons">
        <button class="project-button chat-button" onclick="window.open('/chat_frontend/login.html', '_blank')">
          Try my web chat app!
        </button>
        <button class="project-button old-site-button" onclick="window.open('/chat_frontend/old_home.html', '_blank')">
          Visit old website
        </button>
      </div>
    `;
  }
  
  projectContent += `
    <div class="project-meta">
      <span class="project-stars">⭐ ${repo.stargazers_count}</span>
      <span class="project-updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
    </div>
  `;
  
  projectBox.innerHTML = projectContent;
  
  projectBox.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      window.open(repo.html_url, '_blank');
    }
  });
  
  return projectBox;
}

async function loadProjectLanguages(repo, projectElement) {
  try {
    const response = await fetch(repo.languages_url);
    const languages = await response.json();
    
    const languagesText = Object.keys(languages).join(', ') || 'Not specified';
    const languagesElement = projectElement.querySelector('.project-languages span');
    
    if (languagesElement) {
      languagesElement.textContent = languagesText;
      languagesElement.classList.remove('loading');
    }
  } catch (error) {
    console.error(`Error fetching languages for ${repo.name}:`, error);
    const languagesElement = projectElement.querySelector('.project-languages span');
    if (languagesElement) {
      languagesElement.textContent = 'Unable to load';
      languagesElement.classList.remove('loading');
    }
  }
}
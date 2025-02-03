document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready');

    const links = [
        { url: 'https://www.instagram.com/cadenfinley/', img: 'images/instagram.png', text: 'Instagram' },
        { url: 'https://github.com/CadenFinley', img: 'images/github-dark.png', text: 'Github', imgLight: 'images/github-light.png' },
        { url: 'https://www.linkedin.com/in/cadenjfinley/', img: 'images/linkedin.png', text: 'LinkedIn' }
    ];

    const linksContainer = document.querySelector('header .link-items');
    linksContainer.style.flexWrap = 'wrap';
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.text}" data-light="${link.imgLight || link.img}"></a>`;
        linksContainer.appendChild(linkItem);
    });

    const footerLinksContainer = document.querySelector('footer .about .link-items');
    footerLinksContainer.style.flexWrap = 'wrap';
    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `<a href="${link.url}" target="_blank">${link.text}</a>`;
        footerLinksContainer.appendChild(linkItem);
    });


    const projectBoxes = document.querySelectorAll('.project-box');
    projectBoxes.forEach(box => {
        const link = box.querySelector('h2 a').href;
        box.addEventListener('click', () => {
            window.open(link, '_blank');
        });
        box.style.cursor = 'pointer';
    });

    fetch('https://api.github.com/users/CadenFinley/repos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(repos => {
            const projectsContainer = document.querySelector('#projects .container');
            repos
                .filter(repo => repo.stargazers_count > 0)
                .forEach(repo => {
                    const projectBox = document.createElement('div');
                    projectBox.className = 'project-box';
                    projectBox.innerHTML = `
                        <h2>${repo.name}</h2>
                        <p class="project-languages">Languages: Loading...</p>
                        <p class="project-date" style="display: none;">${new Date(repo.updated_at).toLocaleDateString()}</p>
                        <p>${repo.description || 'No description available'}</p>
                    `;
                    projectBox.addEventListener('click', () => {
                        window.open(repo.html_url, '_blank');
                    });
                    projectsContainer.appendChild(projectBox);

                    fetch(repo.languages_url)
                        .then(response => response.json())
                        .then(languages => {
                            const languagesText = Object.keys(languages).join(', ');
                            projectBox.querySelector('.project-languages').textContent = `Languages: ${languagesText}`;
                        })
                        .catch(error => console.error('Error fetching languages:', error));
                });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            const projectsContainer = document.querySelector('#projects .container');
            const errorMessage = document.createElement('p');
            errorMessage.innerHTML = 'Failed to load GitHub projects. Please visit my GitHub profile directly: <a href="https://github.com/CadenFinley" target="_blank">Caden Finley on GitHub</a>';
            projectsContainer.appendChild(errorMessage);
        });

    // Increment visits count
    fetch('increment_visits.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error incrementing visits:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));

    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '↑';
    document.body.appendChild(scrollToTopButton);

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const scrollToTopRightButton = document.createElement('button');
    scrollToTopRightButton.className = 'scroll-to-top-right';
    scrollToTopRightButton.innerHTML = '☰';
    document.body.appendChild(scrollToTopRightButton);

    const pullOutMenu = document.createElement('div');
    pullOutMenu.className = 'pull-out-menu';
    document.body.appendChild(pullOutMenu);

    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.text}" data-light="${link.imgLight || link.img}"></a>`;
        pullOutMenu.appendChild(linkItem);
    });

    const toggleSwitchContainer = document.createElement('div');
    toggleSwitchContainer.className = 'toggle-switch-container';
    const toggleSwitchLabel = document.createElement('span');
    toggleSwitchLabel.className = 'toggle-switch-label';
    toggleSwitchLabel.textContent = 'Dark Mode';
    const toggleSwitch = document.createElement('label');
    toggleSwitch.className = 'toggle-switch';
    toggleSwitch.innerHTML = `
        <input type="checkbox">
        <span class="slider"></span>
    `;
    toggleSwitch.querySelector('input').addEventListener('change', () => {
        document.body.classList.toggle('light-mode');
        document.querySelectorAll('header, main, section, footer, .project-box, .contact-form, .contact-popup .form-container, .nav-menu-dropdown, .pull-out-menu').forEach(element => {
            element.classList.toggle('light-mode');
        });
        if (document.body.classList.contains('light-mode')) {
            toggleSwitchLabel.textContent = 'Light Mode';
            toggleSwitchLabel.style.color = '#000000';
            document.querySelectorAll('header .link-item img, .pull-out-menu .link-item img').forEach(img => {
                img.src = img.getAttribute('data-light');
            });
        } else {
            toggleSwitchLabel.textContent = 'Dark Mode';
            toggleSwitchLabel.style.color = '#e0e0e0';
            document.querySelectorAll('header .link-item img, .pull-out-menu .link-item img').forEach(img => {
                img.src = img.src.replace('light', 'dark');
            });
        }
    });

    toggleSwitchContainer.appendChild(toggleSwitchLabel);
    toggleSwitchContainer.appendChild(toggleSwitch);
    pullOutMenu.appendChild(toggleSwitchContainer);

    scrollToTopRightButton.addEventListener('click', () => {
        if (pullOutMenu.style.transform === 'translateY(0%)') {
            pullOutMenu.style.transform = 'translateY(-100%)';
            scrollToTopRightButton.style.display = 'block';
        } else {
            pullOutMenu.style.transform = 'translateY(0%)';
            scrollToTopRightButton.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!pullOutMenu.contains(event.target) && !scrollToTopRightButton.contains(event.target)) {
            pullOutMenu.style.transform = 'translateY(-100%)';
            scrollToTopRightButton.style.display = 'block';
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            scrollToTopButton.classList.add('show');
            scrollToTopRightButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
            scrollToTopRightButton.classList.remove('show');
            pullOutMenu.style.transform = 'translateY(-100%)';
            scrollToTopRightButton.style.display = 'block';
        }
    });

    const contactButton = document.querySelector('.form-group button');
    const contactPopup = document.getElementById('contact-popup');
    contactButton.addEventListener('click', (event) => {
        event.preventDefault();
        contactPopup.style.display = 'flex';
        contactPopup.classList.add('slide-up');
        contactPopup.classList.remove('hide');
    });

    contactPopup.addEventListener('click', (event) => {
        if (event.target === contactPopup) {
            contactPopup.classList.add('hide');
            setTimeout(() => {
                contactPopup.style.display = 'none';
                contactPopup.classList.remove('slide-up');
            }, 500);
        }
    });

    document.addEventListener('scroll', () => {
        if (contactPopup.style.display === 'flex') {
            contactPopup.classList.add('hide');
            setTimeout(() => {
                contactPopup.style.display = 'none';
                contactPopup.classList.remove('slide-up');
            }, 500);
        }
    });

    const sectionbuttons = [
        { id: 'connect-button', section: '#connect', text: 'Connect' },
        { id: 'projects-button', section: '#projects', text: 'Projects' }
    ];

    const navMenuButton = document.querySelector('.nav-menu');
    const navMenu = document.querySelector('.nav-menu-dropdown');

    sectionbuttons.forEach(button => {
        const sectionButton = document.createElement('button');
        sectionButton.className = 'section-button';
        sectionButton.id = button.id;
        sectionButton.innerHTML = button.text;
        sectionButton.addEventListener('click', () => {
            document.querySelector(button.section).scrollIntoView({ behavior: 'smooth' });
        });
        navMenu.appendChild(sectionButton);
    });
    navMenu.appendChild(toggleSwitchContainer);

    navMenuButton.addEventListener('click', () => {
        navMenuButton.classList.toggle('show');
        navMenu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !navMenuButton.contains(event.target)) {
            navMenuButton.classList.remove('show');
            navMenu.classList.remove('show');
        }
    });

    window.addEventListener('scroll', () => {
        navMenuButton.classList.remove('show');
        navMenu.classList.remove('show');
    });
});

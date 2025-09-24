document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready');

    document.querySelectorAll('.hero-nav-btn').forEach(btn => {
        btn.style.borderRadius = '30px';
        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        btn.style.border = '2px solid rgba(255, 255, 255, 0.7)';
        btn.style.color = 'white';
        btn.style.overflow = 'hidden';
    });
    
    function setHeroHeight() {
        const hero = document.getElementById('hero');
        if (hero) {
            const viewportHeight = window.innerHeight;
            hero.style.height = viewportHeight + 'px';
            hero.style.minHeight = viewportHeight + 'px';
            hero.style.width = '100%';
            hero.style.margin = '0';
            hero.style.borderRadius = '0 0 30px 30px';
            hero.style.position = 'relative';
            hero.style.transform = 'translateZ(0)';
            
            const scrollDownArrow = document.querySelector('.scroll-down-arrow');
            if (scrollDownArrow) {
                scrollDownArrow.style.position = 'absolute';
                scrollDownArrow.style.bottom = '30px';
                scrollDownArrow.style.left = '50%';
                scrollDownArrow.style.transform = 'translateX(-50%)';
                scrollDownArrow.style.zIndex = '10';
                scrollDownArrow.style.display = 'flex';
                scrollDownArrow.style.justifyContent = 'center';
                scrollDownArrow.style.alignItems = 'center';
                scrollDownArrow.style.pointerEvents = 'auto';
                const arrowSpan = scrollDownArrow.querySelector('span');
                if (arrowSpan) {
                    arrowSpan.addEventListener('mouseenter', () => {
                        arrowSpan.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        arrowSpan.style.transform = 'scale(1.1)';
                    });
                    
                    arrowSpan.addEventListener('mouseleave', () => {
                        arrowSpan.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        arrowSpan.style.transform = 'scale(1)';
                    });
                }
            }
            
            document.body.style.padding = '0';
            document.body.style.margin = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'auto';
        }
    }
    
    setHeroHeight();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setHeroHeight, 100);
    });

    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (scrollDownArrow) {
        scrollDownArrow.style.visibility = 'visible';
        scrollDownArrow.style.opacity = '0.9';
        scrollDownArrow.style.position = 'absolute';
        scrollDownArrow.style.bottom = '30px';
        scrollDownArrow.style.left = '50%';
        scrollDownArrow.style.transform = 'translateX(-50%)';
        scrollDownArrow.style.display = 'flex';
        scrollDownArrow.style.justifyContent = 'center';
        scrollDownArrow.style.alignItems = 'center';
        
        let lastScrollTime = 0;
        const scrollThreshold = 50;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime < scrollThreshold) return;
            lastScrollTime = now;
            
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero').offsetHeight;
            
            if (scrollY > 50) {
                const newOpacity = Math.max(1 - (scrollY / 200), 0);
                scrollDownArrow.style.opacity = newOpacity;
            } else {
                scrollDownArrow.style.opacity = 0.9;
            }
            
            if (scrollY > heroHeight / 2) {
                if (scrollDownArrow.style.visibility !== 'hidden') {
                    scrollDownArrow.style.visibility = 'hidden';
                }
            } else {
                if (scrollDownArrow.style.visibility !== 'visible') {
                    scrollDownArrow.style.visibility = 'visible';
                }
            }
        }, { passive: true });
        
        scrollDownArrow.addEventListener('click', () => {
            document.getElementById('about-me').scrollIntoView({behavior: 'smooth'});
        });
    }

    const links = [
        { url: 'https://www.instagram.com/cadenfinley/', img: 'images/instagram.png', text: 'Instagram' },
        { url: 'https://github.com/CadenFinley', img: 'images/github-dark.png', text: 'Github', imgLight: 'images/github-light.png' },
        { url: 'https://www.linkedin.com/in/cadenjfinley/', img: 'images/linkedin.png', text: 'LinkedIn' }
    ];

    const isHomePage = () => {
        const path = window.location.pathname;
        return path === '/' || path === '/home' || path === '/home.html' || path.endsWith('/priv-CadenFinley.com/') || path.endsWith('/priv-CadenFinley.com/home') || path.endsWith('/priv-CadenFinley.com/home.html');
    };

    const header = document.querySelector('header');
    if (isHomePage() && document.getElementById('hero')) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
        header.classList.add('header-visible');
    }
    
    function handleScroll() {
        const heroSection = document.getElementById('hero');
        if (isHomePage() && heroSection) {
            const triggerPoint = heroSection.offsetHeight / 3;
            
            if (window.scrollY > triggerPoint) {
                header.style.display = 'flex';
                header.classList.add('header-visible');
            } else {
                header.classList.remove('header-visible');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    handleScroll();

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

    function createToggleSwitchContainer() {
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
        
        toggleSwitchContainer.appendChild(toggleSwitchLabel);
        toggleSwitchContainer.appendChild(toggleSwitch);
        
        return { toggleSwitchContainer, toggleSwitchLabel, toggleSwitch };
    }
    
    function handleThemeToggle(isChecked, toggleSwitchLabel) {
        document.body.classList.toggle('light-mode', isChecked);
        document.querySelectorAll('header, main, section, footer, .project-box, .contact-form, .contact-popup .form-container, .nav-menu-dropdown, .pull-out-menu').forEach(element => {
            element.classList.toggle('light-mode', isChecked);
        });
        
        if (isChecked) {
            toggleSwitchLabel.textContent = 'Light Mode';
            toggleSwitchLabel.style.color = '#000000';
            document.querySelectorAll('header .link-item img, .pull-out-menu .link-item img, #connect .social-link img').forEach(img => {
                if (img.getAttribute('data-light')) {
                    img.src = img.getAttribute('data-light');
                }
            });
        } else {
            toggleSwitchLabel.textContent = 'Dark Mode';
            toggleSwitchLabel.style.color = '#e0e0e0';
            document.querySelectorAll('header .link-item img, .pull-out-menu .link-item img, #connect .social-link img').forEach(img => {
                if (img.src.includes('light')) {
                    img.src = img.src.replace('light', 'dark');
                }
            });
        }
        
        document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }

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
            
            const pinnedRepoNames = [
                'CJsShell',
                'CadenFinley.com',
                'ASCII-Adventurer'
            ];
            
            // Filter to only include pinned repositories
            const pinnedRepos = repos.filter(repo => pinnedRepoNames.includes(repo.name));
            
            // Sort repos to maintain the order of pinnedRepoNames
            const sortedRepos = pinnedRepos.sort((a, b) => {
                return pinnedRepoNames.indexOf(a.name) - pinnedRepoNames.indexOf(b.name);
            });
            
            if (sortedRepos.length === 0) {
                const noReposMessage = document.createElement('p');
                noReposMessage.textContent = 'No pinned repositories found. Please visit my GitHub profile directly.';
                projectsContainer.appendChild(noReposMessage);
                return;
            }
            
            sortedRepos.forEach(repo => {
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

    fetch('../chat_backend/php/increment_visits.php', {
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
    scrollToTopRightButton.style.backgroundColor = '#ff6f61';
    scrollToTopRightButton.style.color = '#ffffff';
    scrollToTopRightButton.style.borderRadius = '5px';
    document.body.appendChild(scrollToTopRightButton);

    const pullOutMenu = document.createElement('div');
    pullOutMenu.className = 'pull-out-menu';
    document.body.appendChild(pullOutMenu);

    const socialLinksContainer = document.createElement('div');
    socialLinksContainer.className = 'social-links-container';
    socialLinksContainer.style.display = 'flex';
    socialLinksContainer.style.justifyContent = 'center';
    socialLinksContainer.style.gap = '1rem';
    socialLinksContainer.style.marginBottom = '1rem';
    socialLinksContainer.style.flexWrap = 'wrap';
    pullOutMenu.appendChild(socialLinksContainer);

    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.text}" data-light="${link.imgLight || link.img}"></a>`;
        socialLinksContainer.appendChild(linkItem);
    });

    const { toggleSwitchContainer, toggleSwitchLabel, toggleSwitch } = createToggleSwitchContainer();
    
    toggleSwitch.querySelector('input').addEventListener('change', (e) => {
        handleThemeToggle(e.target.checked, toggleSwitchLabel);
    });

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
            
            if (document.body.classList.contains('light-mode')) {
                scrollToTopRightButton.style.backgroundColor = '#ff6f61';
                scrollToTopRightButton.style.color = '#000000';
            } else {
                scrollToTopRightButton.style.backgroundColor = '#ff6f61';
                scrollToTopRightButton.style.color = '#ffffff';
            }
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
    
    const navSocialLinksContainer = document.createElement('div');
    navSocialLinksContainer.className = 'social-links-container';
    navSocialLinksContainer.style.display = 'flex';
    navSocialLinksContainer.style.justifyContent = 'center';
    navSocialLinksContainer.style.gap = '1rem';
    navSocialLinksContainer.style.margin = '1rem 0';
    navSocialLinksContainer.style.flexWrap = 'wrap';
    navMenu.appendChild(navSocialLinksContainer);

    links.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.text}" data-light="${link.imgLight || link.img}"></a>`;
        navSocialLinksContainer.appendChild(linkItem);
    });
    
    const navMenuToggle = createToggleSwitchContainer();
    
    navMenuToggle.toggleSwitch.querySelector('input').addEventListener('change', (e) => {
        handleThemeToggle(e.target.checked, navMenuToggle.toggleSwitchLabel);
    });
    
    navMenu.appendChild(navMenuToggle.toggleSwitchContainer);

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

    const connectSection = document.getElementById('connect');
    if (connectSection) {
        const connectTitle = connectSection.querySelector('h2');
        const socialLinks = document.createElement('div');
        socialLinks.className = 'social-links';
        
        links.forEach(link => {
            const socialLink = document.createElement('a');
            socialLink.className = 'social-link';
            socialLink.href = link.url;
            socialLink.target = '_blank';
            socialLink.innerHTML = `<img src="${link.img}" alt="${link.text}" data-light="${link.imgLight || link.img}">`;
            socialLinks.appendChild(socialLink);
        });
        
        connectTitle.appendChild(socialLinks);
    }
});

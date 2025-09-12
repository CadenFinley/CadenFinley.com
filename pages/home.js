import { socialSection } from "../components/socialButtons.js";
import { tag, a, h1, h2, h3, p } from "../grecha.js";
import { navSection } from "../components/nav.js";
import { footerSection } from "../components/footer.js";

export function homePage() {
  return tag("div",
    // top nav
    navSection(),
    // header section
    tag("section",
      h1("Caden Finley"),
      h2("Software Engineer"),
      p("Full-stack developer passionate about building scalable applications and developer tools")
    ).att$("class", "hero"),
    // about section
    tag("section",
      h2("About"),
      p("Experienced software engineer with expertise in modern web technologies, system design, and developer tooling. Proven track record of delivering high-quality software solutions and leading technical projects from conception to deployment.")
    ).att$("class", "section"),
    // skills section
    tag("section",
      h2("Technical Skills"),
      tag("div",
        tag("div",
          h3("Languages"),
          p("JavaScript, TypeScript, Python, Java, C++, Go, Rust")
        ).att$("class", "skill-category"),
        tag("div",
          h3("Frontend"),
          p("React, Vue.js, HTML5, CSS3, Sass, Webpack, Vite")
        ).att$("class", "skill-category"),
        tag("div",
          h3("Backend"),
          p("Node.js, Express, Django, FastAPI, PostgreSQL, MongoDB")
        ).att$("class", "skill-category"),
        tag("div",
          h3("DevOps & Tools"),
          p("Docker, Kubernetes, AWS, Git, CI/CD, Linux, Bash")
        ).att$("class", "skill-category")
      ).att$("class", "skills-grid")
    ).att$("class", "section"),
    // experience section
    tag("section",
      h2("Experience"),
      tag("div",
        h3("Senior Software Engineer"),
        tag("div",
          tag("strong", "Tech Company"),
          tag("span", " • 2022 - Present")
        ).att$("class", "job-header"),
        tag("ul",
          tag("li", "Led development of microservices architecture serving 1M+ users"),
          tag("li", "Improved system performance by 40% through optimization and caching"),
          tag("li", "Mentored junior developers and established coding standards")
        )
      ).att$("class", "experience-item"),
      tag("div",
        h3("Software Engineer"),
        tag("div",
          tag("strong", "Previous Company"),
          tag("span", " • 2020 - 2022")
        ).att$("class", "job-header"),
        tag("ul",
          tag("li", "Built responsive web applications using React and TypeScript"),
          tag("li", "Designed and implemented RESTful APIs and GraphQL endpoints"),
          tag("li", "Collaborated with cross-functional teams in agile environment")
        )
      ).att$("class", "experience-item")
    ).att$("class", "section"),
    // projects section
    tag("section",
      h2("Notable Projects"),
      tag("div",
        h3("CJ's Shell"),
        p("Custom login shell with AI assistant, plugin API, and customizable themes. Built with modern C++ and cross-platform compatibility."),
        p(a("View on GitHub").att$("href", "https://github.com/CadenFinley/CJsShell"))
      ).att$("class", "project-item"),
      tag("div",
        h3("Personal Website"),
        p("Modern, responsive portfolio website built with vanilla JavaScript and a custom DOM manipulation framework."),
        p(a("View Project").att$("href", "#"))
      ).att$("class", "project-item")
    ).att$("class", "section"),
    // education section
    tag("section",
      h2("Education"),
      tag("div",
        h3("Bachelor of Science in Computer Science"),
        p("University Name • 2016 - 2020"),
        p("Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems")
      ).att$("class", "education-item")
    ).att$("class", "section"),
    // footer
    footerSection()
  ).att$("class", "container");
}

import { tag, a, h1, h2, h3, p, img } from "../grecha.js";
import { navSection } from "../components/nav.js";
import { footerSection } from "../components/footer.js";

export function homePage() {
  return tag("div",
    // top nav
    navSection(),
    // header section
    tag("section",
      img("images/cadenfinley.jpeg").att$("class", "profile-picture"),
      h1("Caden Finley"),
      h2("Software Engineering and Computer Science Student"),
      p("📍 Rowlett, TX | caden.finley0789@gmail.com"),
      p("Software Engineering student with a love for back-end and low level systems. I have hands-on hardware/software experience, and proven leadership skills. Skilled in CLI troubleshooting, system setup, structured problem-solving, and documentation.")
    ).att$("class", "hero"),
    // skills section
    tag("section",
      h2("Technical Skills"),
      tag("div",
        tag("div",
          h3("Technologies & Languages"),
          p("Python, C, C++, PHP, Java, JavaScript, Shell Scripting, HTml, CSS, SQL,Rust")
        ).att$("class", "skill-category"),
        tag("div",
          h3("Software & Tools"),
          p("Spring Boot, Mvn, Git, Docker")
        ).att$("class", "skill-category"),
        tag("div",
          h3("Professional Skills"),
          p("Inventory Management, SOP Documentation, Troubleshooting under SLAs, Leadership, Team Collaboration")
        ).att$("class", "skill-category")
      ).att$("class", "skills-grid")
    ).att$("class", "section"),
    // experience section
    tag("section",
      h2("Professional Experience"),
      tag("div",
        h3("Assistant Director & Counselor"),
        tag("div",
          tag("strong", "Abilene Christian University Leadership Camps"),
          tag("span", " • March 2023 - Present")
        ).att$("class", "job-header"),
        tag("ul",
          tag("li", "Led groups of 10-20 campers daily, ensuring safety, engagement, and adherence to schedule"),
          tag("li", "Promoted to Assistant Director, overseeing camp logistics, Volunteer Organization, and Counselor training"),
          tag("li", "Managed inventory of camp materials, maintained detailed documentation, and enforced safety protocols"),
          tag("li", "Developed strong time management skills while working nights and weekends in a high-responsibility role")
        )
      ).att$("class", "experience-item"),
      tag("div",
        h3("Server, Trainer & Caterer"),
        tag("div",
          tag("strong", "Babes Chicken Dinnerhouse"),
          tag("span", " • April 2021 - January 2025")
        ).att$("class", "job-header"),
        tag("ul",
          tag("li", "Consistently delivered excellent customer service in a fast-paced environment"),
          tag("li", "Trained and onboarded new employees, ensuring adherence to SOPs and service standards"),
          tag("li", "Managed supplies and inventory organization for catering events"),
          tag("li", "Maintained punctual attendance and reliability — traits critical for a 24/7 environment")
        )
      ).att$("class", "experience-item")
    ).att$("class", "section"),
    // projects section
    tag("section",
      h2("Notable Projects"),
      tag("div",
        tag("h3", a("CadenFinley.com — Personal Website & AI Chatbot").att$("href", "https://github.com/CadenFinley/CadenFinley.com")),
        p("Developed a full-stack website acting as an interactive online resume with user authentication, real-time messaging system, and a built-in AI chatbot. Utilized web sockets, database management, secure login protocols, and frontend/backend integration.")
      ).att$("class", "project-item"),
      tag("div",
        tag("h3", a("CJ's Shell (cjsh) — Custom Developer-Focused Login Shell").att$("href", "https://github.com/CadenFinley/CJsShell")),
        p("Designed and implemented a POSIX-compatible login shell with a built-in AI assistant, plugin engine, and theme system. Developed in C++, integrated external libraries, and created automated install scripts for macOS/Linux.")
      ).att$("class", "project-item"),
      tag("div",
        tag("h3", a("ASCII Adventurer — CLI Text Adventure Game").att$("href", "https://github.com/CadenFinley/ASCII-Adventurer")),
        p("Built a text-based adventure game with randomized world generation, AI-generated storylines, and encrypted save states. Strengthened skills in data structures, file serialization, and user input parsing.")
      ).att$("class", "project-item")
    ).att$("class", "section").att$("id", "projects"),
    // education section
    tag("section",
      h2("Education"),
      tag("div",
        h3("Bachelor of Science in Computer Science, Software Engineering"),
        p("Abilene Christian University • August 2023 - May 2026 (Expected)"),
        p("Currently pursuing degree with focus on software engineering and system design")
      ).att$("class", "education-item"),
      tag("div",
        h3("Associate of Science in Computer Science"),
        p("Dallas College • August 2019 - May 2023"),
        p("Earned 3 certifications: CIT Software Programmer/Developer Assistant, Programmer Lvl. 1, Technology Support")
      ).att$("class", "education-item")
    ).att$("class", "section"),
    // footer
    footerSection()
  ).att$("class", "container");
}

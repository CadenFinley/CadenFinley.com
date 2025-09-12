import { tag, h2, h3, p } from "../grecha.js";

export function skillsSection() {
  return tag("section",
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
  ).att$("class", "section");
}
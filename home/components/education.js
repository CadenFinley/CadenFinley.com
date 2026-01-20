import { tag, h2, h3, p } from "../scripts/grecha.js";

export function educationSection() {
  return tag("section",
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
  ).att$("class", "section");
}
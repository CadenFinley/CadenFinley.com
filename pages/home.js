import { tag } from "../grecha.js";
import { navSection } from "../components/nav.js";
import { footerSection } from "../components/footer.js";
import { heroSection } from "../components/hero.js";
import { skillsSection } from "../components/skills.js";
import { experienceSection } from "../components/experience.js";
import { projectsSection } from "../components/projects.js";
import { educationSection } from "../components/education.js";

export function homePage() {
  return tag("div",
    // top nav
    navSection(),
    // header section
    heroSection(),
    // skills section
    skillsSection(),
    // experience section
    experienceSection(),
    // projects section
    projectsSection(),
    // education section
    educationSection(),
    // footer
    footerSection()
  ).att$("class", "container");
}

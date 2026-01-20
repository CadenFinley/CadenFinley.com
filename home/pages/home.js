import {educationSection} from '../components/education.js';
// import { skillsSection } from "../components/skills.js";
import {experienceSection} from '../components/experience.js';
import {footerSection} from '../components/footer.js';
import {heroSection} from '../components/hero.js';
import {navSection} from '../components/nav.js';
import {projectsSection} from '../components/projects.js';
import {tag} from '../scripts/grecha.js';

export function homePage() {
  return tag('div', navSection(), heroSection(),
             // skillsSection(),
             projectsSection(), experienceSection(), educationSection(),
             footerSection())
      .att$('class', 'container');
}

import {educationSection} from '../components/education.js';
import {experienceSection} from '../components/experience.js';
import {footerSection} from '../components/footer.js';
import {heroSection} from '../components/hero.js';
import {navSection} from '../components/nav.js';
import {projectsSection} from '../components/projects.js';
import {reflectionLinksSection} from '../components/reflectionLinks.js';
import {sectionDivider} from '../components/sectionDivider.js';
import {skillsSection} from '../components/skills.js';
import {tag} from '../scripts/grecha.js';

export function homePage() {
  return tag('div', navSection(), heroSection(), sectionDivider(),
             projectsSection(), sectionDivider(), reflectionLinksSection(),
             sectionDivider(), experienceSection(), sectionDivider(),
             educationSection(), sectionDivider(),
              //  skillsSection(),
              footerSection())
      .att$('class', 'container');
}

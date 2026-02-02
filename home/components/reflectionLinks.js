import {a, h2, p, tag} from '../scripts/grecha.js';

function buildButton(label, href, priority = 'primary') {
  return a(label)
      .att$('href', href)
      .att$('class', `btn ${priority}`)
      .att$('data-role', 'reflection-link');
}

export function reflectionLinksSection() {
  const buttonRow = tag('div',
                       buildButton('Co-curricular & Other Reflections',
                                   '#/co-curricular'),
                       buildButton('Academic & Spiritual Reflections',
                                   '#/acu-journey'))
                         .att$('class', 'reflection-links-buttons');

  return tag('section', h2('Reflections & Community'),
             buttonRow)
      .att$('class', 'section reflection-links');
}

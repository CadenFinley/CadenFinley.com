import {footerSection} from '../components/footer.js';
import {navSection} from '../components/nav.js';
import {div, h2, h3, p, tag} from '../scripts/grecha.js';

const CO_CURRICULAR = [
  {
    title: 'Church of Christ Research Involvement',
    paragraphs: [
      'Over the course of the Fall 2025 semester of my senior year, I was recruited to write some automated scraping and processing scripts for a series of Church of Christ hymnals for Dr. Lynn. This involved many web scraping techniques, data cleaning, data processing, and data representation.',
      'This project taught me some more professional researching practices and techniques. It also taught me some more in depth DOM manipulation practices.'
    ]
  },
  {
    title: 'Custom Java Library for OpenAI for SE2',
    paragraphs: [
      'During the Spring 2025 semester of my junior year, Dr. Reeves entrusted me to write and create two custom Java libraries for Open AI API access for use in the SE2 course for my fellow classmates. This involved doing the research and actually writing the libraries for the class, as well as also teaching and providing tutoring and support for my classmates over the course of the semester.',
      'This project taught me more in depth about API\u2019s and library structures to make libraries as accessible as possible and as easy to use as possible. It taught me more about non-traditional UI\u2019s in the sense that this \u201cUI\u201d would be used by other code and libraries. This also taught me how to be a better teacher and tutor as my classmates were coming to me for help and advice on their final project for SE2.'
    ]
  }
];

const LEADERSHIP_BALANCE = [
  {
    title: 'ACU Leadership Camps',
    paragraphs: [
      'Growing up I spent 1 week out of all of my summers here in Abilene attending ACU Leadership camps. I spent 13 years coming to camps as a camper from before kindergarten all the way through my senior year of high school. These weeks are some of my lost fondest and most cherished memories I have. Coming to ACU I knew I would have the opportunity to be a counselor for these camps and I knew I was going to do it. Over the last 3 years I have spent my time being thoroughly involved in Camps here at ACU. I was a counselor for a year and I have now spent the last 2 years being the Assistant Director.',
      'Over the last 16 years ACU Leadership Camps has been the single most impactful thing in my life, and I credit it for shaping me into who I am today. ACU Leadership camps have allowed me to express my leadership qualities and have challenged me in ways I have never been challenged before.'
    ]
  },
  {
    title: 'Opening the new Chuy\'s in Abilene',
    paragraphs: [
      'Come October I was made aware that the new Chuy\'s opening here in Abilene was looking for experienced servers to help open the restaurant. I immediately was curious as I have been a server in the restaurant industry since I was 16. At my last restaurant I had worked by way up to being a Server lead and trainer and keyholder for the restaurant. I have missed working as a server over the last few months leading up to October and I knew this was my key back in. I have opened restaurants before, but this was a whole new challenge.',
      'These last few months working as a server, bartender, and trainer at Chuy\u2019s has challenged me greatly especially in terms of workload and time management as it added a whole other thing I had to balance and schedule my time around. While I have greatly enjoyed my time working at Chuy\u2019s it has hindered my academic work and body recovery, and I know that my time at Chuy\u2019s is coming to a close as I know that this work amount is not sustainable.'
    ]
  }
];

function buildCard({title, paragraphs}) {
  const content = paragraphs.map(text => p(text));
  return tag('article', h3(title), ...content)
      .att$('class', 'reflection-card');
}

function buildSection(title, entries) {
  const cards = entries.map(buildCard);
  return tag('section', h2(title),
             div(...cards).att$('class', 'reflection-grid'));
}

export function communityPage() {
  return tag('div', navSection(),
              tag('main',
                    buildSection('Co-curricular Activities', CO_CURRICULAR),
                    buildSection('Other Involvments', LEADERSHIP_BALANCE))
                   .att$('class', 'reflection-page'),
              footerSection())
      .att$('class', 'container');
}

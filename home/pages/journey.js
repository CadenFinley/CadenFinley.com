import { footerSection } from '../components/footer.js';
import { navSection } from '../components/nav.js';
import { div, h1, h2, p, tag } from '../scripts/grecha.js';

const REFLECTIONS = [
	{
		title: 'Academic Reflection',
		intro:
			"I always knew I was coming to ACU. Whether I liked it or not. It is a good thing I loved it. My entire family has been here to ACU stretching all the way back to my great-great grandmother and grandfather. ACU is in my blood. I also knew that from ACU Leadership Camps that I loved the campus and the Abilene area as a whole so I was very familiar with this place and it felt like home away from home every time I was here.",
		paragraphs: [
			'I came out of high school with an Associate\'s degree in the sciences with some credits in a specific major class in Computer Science. I have always loved computer programming since I was little and since ACU had a Software Engineering path I knew that was what I was going to take. While getting all 72 credits to transfer, ACU was very reluctant to take any of them, and had postponed telling me right up until just a week before I moved in for my first semester. So I spent the whole week before and Wildcat Week emailing back and forth with the ACU provost trying to argue my position. In the end I was able to transfer about 40 credits of my 72.',
			'I have never been that good of a student. This has been the case throughout my whole life. I often struggle finding the motivation to do the extra work and it has always reflected in my grades. Nevertheless, ACU has brought the best out of me. I have been able to test my limits and to stretch and grow my knowledge base to heights I never would have imagined. I have worked on some solo projects that I am exceedingly proud of and that have actual users. I also have been involved in research projects where the results and findings of that project have been truly outstanding. As much as I regret that my GPA may not be as high as my friends or peers, or maybe I didn\'t get as good of a scholarship as others, I know that I have put the knowledge I have gained here into something much more impactful in my life than just my GPA.',
			'ACU has given me the tools and outlets where I can use the skills I gained here for the betterment of the world and myself. Without ACU I have no idea where I would be right now. I am so grateful for the experience and opportunity I was given here, and for the professors, role models, mentors, and friends I have met along the way here during my time at ACU.'
		]
	},
	{
		title: 'Spiritual Reflection',
		intro:
			"Coming into ACU I was carrying some hurt. My parents have both been ministers in the Church for a very long time. My dad held many titles at several different churches for over a decade before being laid off in 2009 and calling it quits there while still being involved in the church, just without a title this time. My mom on the other hand became a children's minister in 2014 and was up until December of 2022. It is an incredibly long and drawn out story, but in short my mom was burnt out and my church was in a really unhealthy state. It caused a lot of issues and was so bad that now my parents do not consider themselves Christians anymore. While this has not at all changed the way I think about my parents, I would be lying if I said that this has not played a significant role in how my spiritual life is now.",
		paragraphs: [
			"While I do miss the church life, I just cannot bring myself to become a long-term member of any church group no matter how much I like the church. While this does have many downsides, it also has many upsides as well. For one, it has helped me root my spirituality not just in a building or within an hour timeframe two times a week. It has helped me root my spirituality into healthier, firmer foundations, for example by putting it into practice throughout my daily life. ACU has greatly helped this, especially in ACU Leadership Camps. Camps helped me fall back in love with my creator and have been an outlet for me to express my spirituality and enthusiasm for Jesus.",
			"While ACU has greatly helped with this healing, I would be missing a big feature about ACU that I find extremely lacking: the chapel experience. I find that it is now just a to-do list or a checkmark that needs to be completed, which I am pretty sure that Jesus would not like very much. This is exemplified by using it as a means to justify completing credits or satisfying a scholarship requirement. This has been disappointing to me as I would love a space to do life with other Jesus-loving people and a space to act on this, but Chapel simply is not that at ACU. Leadership Camps is a far better example of this than Chapel.",
			"So for now I hold both the grief of unmet expectations and, all the while, gratitude for the spaces that do bring life for me. I may not have a permanent church home yet, but I continue to follow Jesus alongside the friends and mentors who meet me in the everyday moments, trusting that this slower healing is still holy. And who knows, I may not ever find a permanent church home, and that is okay too."
		]
	}
];

function buildReflection({ title, intro, paragraphs }) {
	const body = paragraphs.map(text => p(text));
	return tag('article', h2(title), p(intro), ...body)
		.att$('class', 'reflection-card reflection-longform');
}

export function journeyPage() {
	const articles = REFLECTIONS.map(buildReflection);

	return tag('div', navSection(),
		tag('main', ...articles).att$('class', 'reflection-page reflection-stack'),
		footerSection())
		.att$('class', 'container');
}

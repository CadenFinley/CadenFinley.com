import {footerSection} from '../components/footer.js';
import {navSection} from '../components/nav.js';
import {a, div, h1, h2, p, tag} from '../scripts/grecha.js';

function buildErrorPage({
  code,
  title,
  description,
  actionLabel = 'Return Home',
  actionHref = '#/'
}) {
  return tag('div', navSection(),
             div(h1(code), h2(title), p(description),
                 a(actionLabel)
                     .att$('href', actionHref)
                     .att$('class', 'btn primary'))
                 .att$('class', 'error-page'),
             footerSection())
      .att$('class', 'container');
}

export const errorRoutes = {
  '/400': () => buildErrorPage({
    code: '400',
    title: 'Bad Request',
    description:
        'Your browser sent a request we couldn\'t understand. Please verify the link and try again.'
  }),
  '/401': () => buildErrorPage({
    code: '401',
    title: 'Unauthorized',
    description:
        'This page needs authentication before you can view it. Sign in and give it another go.'
  }),
  '/403': () => buildErrorPage({
    code: '403',
    title: 'Forbidden',
    description:
        'You don\'t have permission to access this resource. If you think this is a mistake, reach out.'
  }),
  '/404': () => buildErrorPage({
    code: '404',
    title: 'Page Not Found',
    description:
        'Sorry, the page you are looking for doesn\'t exist or may have been moved.'
  }),
  '/500': () => buildErrorPage({
    code: '500',
    title: 'Server Error',
    description:
        'Something went wrong on our end. We\'ll look into it right away.'
  })
};

export const badRequestPage = errorRoutes['/400'];
export const unauthorizedPage = errorRoutes['/401'];
export const forbiddenPage = errorRoutes['/403'];
export const notFoundPage = errorRoutes['/404'];
export const serverErrorPage = errorRoutes['/500'];
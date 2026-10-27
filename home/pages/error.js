import {footerSection} from '../components/footer.js';
import {navSection} from '../components/nav.js';
import {a, div, h1, h2, p, tag} from '../scripts/grecha.js';

function buildErrorPage({
  code,
  title,
  description,
  actionLabel = 'Return Home',
  actionHref = '/'
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
        'The server could not understand this request. Check the address, then try again.'
  }),
  '/401': () => buildErrorPage({
    code: '401',
    title: 'Unauthorized',
    description:
        'This page requires authentication. Return to the homepage or contact me if you need access.'
  }),
  '/403': () => buildErrorPage({
    code: '403',
    title: 'Forbidden',
    description:
        'You do not have permission to access this page. Return to the homepage or contact me if you need access.'
  }),
  '/404': () => buildErrorPage({
    code: '404',
    title: 'Page Not Found',
    description:
        'The address may be incorrect, or the page may have moved. Check the URL or return to the homepage.'
  }),
  '/500': () => buildErrorPage({
    code: '500',
    title: 'Server Error',
    description:
        'The server could not complete this request. Try again later or return to the homepage.'
  })
};

export const badRequestPage = errorRoutes['/400'];
export const unauthorizedPage = errorRoutes['/401'];
export const forbiddenPage = errorRoutes['/403'];
export const notFoundPage = errorRoutes['/404'];
export const serverErrorPage = errorRoutes['/500'];

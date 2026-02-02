import {communityPage} from './pages/community.js';
import {errorRoutes} from './pages/error.js';
import {homePage} from './pages/home.js';
import {journeyPage} from './pages/journey.js';
import {router} from './scripts/grecha.js';

const routes = {
  '/': homePage,
  '/co-curricular': communityPage,
  '/acu-journey': journeyPage,
  ...errorRoutes
};

syncHashFromQuery(routes);

const r = router(routes);
entry.appendChild(r);

function syncHashFromQuery(routeTable) {
  const url = new URL(window.location.href);
  const errorParam = (url.searchParams.get('error') || '').trim();
  if (!errorParam) {
    return;
  }

  const normalizedRoute = `/${errorParam}`;
  if (!(normalizedRoute in routeTable)) {
    return;
  }

  window.location.hash = normalizedRoute;
  url.searchParams.delete('error');
  const nextSearch = url.searchParams.toString();
  const searchSuffix = nextSearch ? `?${nextSearch}` : '';
  history.replaceState(
      {}, '', `${url.pathname}${searchSuffix}${window.location.hash}`);
}

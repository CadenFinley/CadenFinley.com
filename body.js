import { router,} from "./grecha.js";
import { homePage } from "./pages/home.js";
import { notFoundPage } from "./pages/404.js";

const r = router({
  "/": homePage,
  "/404": notFoundPage
});
entry.appendChild(r);
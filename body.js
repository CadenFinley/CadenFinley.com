import { router,} from "./grecha.js";
import { homePage } from "./pages/home.js";

const r = router({
  "/": homePage
});
entry.appendChild(r);
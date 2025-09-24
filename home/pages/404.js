import { tag, h1, h2, p, a, div } from "../grecha.js";
import { navSection } from "../components/nav.js";
import { footerSection } from "../components/footer.js";

export function notFoundPage() {
  return tag("div",
    // top nav
    navSection(),
    // 404 content
    div(
      h1("404"),
      h2("Page Not Found"),
      p("Sorry, the page you are looking for doesn't exist."),
      a("Go back to Home")
        .att$("href", "#/")
        .att$("class", "btn-primary")
    ).att$("class", "not-found-content"),
    // footer
    footerSection()
  ).att$("class", "container");
}
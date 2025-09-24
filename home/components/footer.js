import { tag, p } from "../grecha.js";

export function footerSection() {
  return tag("footer",
    p("© " + new Date().getFullYear() + " Caden Finley")
  ).att$("class", "footer");
}

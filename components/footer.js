import { tag, p } from "../grecha.js";

export function footerSection() {
  return tag("footer",
    p("© " + new Date().getFullYear() + " CJ's Shell")
  ).att$("class", "footer");
}

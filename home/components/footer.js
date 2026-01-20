import { tag, p } from "../scripts/grecha.js";

export function footerSection() {
  return tag("footer",
    p("© " + new Date().getFullYear() + " Caden Finley")
  ).att$("class", "footer");
}

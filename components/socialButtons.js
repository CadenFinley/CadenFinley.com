import { a, img, div } from "../grecha.js";

export function socialSection() {
  const githubIcon =
    document.documentElement.dataset.theme === "dark"
      ? "images/github-dark.png"
      : "images/github-light.png";
  return div(
    a(img(githubIcon).att$("id", "github-icon"))
      .att$("href", "https://github.com/cadenfinley")
      .att$("target", "_blank"),
    a(img("images/instagram.png"))
      .att$("href", "https://instagram.com/cadenfinley")
      .att$("target", "_blank"),
    a(img("images/linkedin.png"))
      .att$("href", "https://linkedin.com/in/cadenjfinley")
      .att$("target", "_blank")
  ).att$("class", "social-buttons");
}

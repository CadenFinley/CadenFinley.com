import { tag, h1, h2, p, img } from "../grecha.js";

export function heroSection() {
  return tag("section",
    img("/images/cadenfinley.jpeg").att$("class", "profile-picture"),
    h1("Caden Finley"),
    h2("Software Engineering and Computer Science Student"),
    p("📍 Rowlett, TX | caden.finley0789@gmail.com"),
    p("Software Engineering student with a love for back-end and low level systems. I have hands-on hardware/software experience, and proven leadership skills. Skilled in CLI troubleshooting, system setup, structured problem-solving, and documentation.")
  ).att$("class", "hero");
}
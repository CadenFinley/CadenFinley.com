import { tag, a, h2, p } from "../grecha.js";

export function projectsSection() {
  return tag("section",
    h2("Notable Projects"),
    tag("div",
      tag("h3", a("CadenFinley.com — Personal Website & AI Chatbot").att$("href", "https://github.com/CadenFinley/CadenFinley.com")),
      p("Developed a full-stack website acting as an interactive online resume with user authentication, real-time messaging system, and a built-in AI chatbot. Utilized web sockets, database management, secure login protocols, and frontend/backend integration.")
    ).att$("class", "project-item"),
    tag("div",
      tag("h3", a("CJ's Shell (cjsh) — Custom Developer-Focused Login Shell").att$("href", "https://github.com/CadenFinley/CJsShell")),
      p("Designed and implemented a 90% POSIX-compatible login shell with a built-in AI assistant, plugin engine, and theme system. Developed in C++, integrated external libraries, and created automated install scripts for macOS/Linux.")
    ).att$("class", "project-item"),
    tag("div",
      tag("h3", a("ASCII Adventurer — CLI Text Adventure Game").att$("href", "https://github.com/CadenFinley/ASCII-Adventurer")),
      p("Built a text-based adventure game with randomized world generation, AI-generated storylines, and encrypted save states. Strengthened skills in data structures, file serialization, and user input parsing.")
    ).att$("class", "project-item")
  ).att$("class", "section").att$("id", "projects");
}
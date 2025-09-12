import { tag, h2, h3 } from "../grecha.js";

export function experienceSection() {
  return tag("section",
    h2("Professional Experience"),
    tag("div",
      h3("Assistant Director & Counselor"),
      tag("div",
        tag("strong", "Abilene Christian University Leadership Camps"),
        tag("span", " • March 2023 - Present")
      ).att$("class", "job-header"),
      tag("ul",
        tag("li", "Led groups of 10-20 campers daily, ensuring safety, engagement, and adherence to schedule"),
        tag("li", "Promoted to Assistant Director, overseeing camp logistics, Volunteer Organization, and Counselor training"),
        tag("li", "Managed inventory of camp materials, maintained detailed documentation, and enforced safety protocols"),
        tag("li", "Developed strong time management skills while working nights and weekends in a high-responsibility role")
      )
    ).att$("class", "experience-item"),
    tag("div",
      h3("Server, Trainer & Caterer"),
      tag("div",
        tag("strong", "Babes Chicken Dinnerhouse"),
        tag("span", " • April 2021 - January 2025")
      ).att$("class", "job-header"),
      tag("ul",
        tag("li", "Consistently delivered excellent customer service in a fast-paced environment"),
        tag("li", "Trained and onboarded new employees, ensuring adherence to SOPs and service standards"),
        tag("li", "Managed supplies and inventory organization for catering events"),
        tag("li", "Maintained punctual attendance and reliability — traits critical for a 24/7 environment")
      )
    ).att$("class", "experience-item")
  ).att$("class", "section");
}
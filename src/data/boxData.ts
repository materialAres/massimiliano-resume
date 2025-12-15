import type { BoxData } from "../types/types";

export const boxData: BoxData = {
  work: {
    title: "Work Experience",
    items: [
      {
        title: "Front-End Developer - EY",
        subtitle: "Apr 2024 - Present",
        location: "Cagliari, Italy",
      },
      {
        title: "Full-Stack Developer - Clariter",
        subtitle: "Feb 2023 - Feb 2024",
        location: "Remote, Italy",
      },
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        title: "Bachelor Degree in Languages and Mediation",
        location: "Cagliari, Italy",
      },
      {
        title: "Django for Everybody, Python Course",
        location: "Coursera.org",
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        title: "The Tempest",
        description:
          "An adventure game made with RPG Maker MV based on Shakespeare's play The Tempest",
      },
      {
        title: "Portfolio page",
        description: "Gamified portfolio page built with React and Kaplay",
      },
    ],
  },
};

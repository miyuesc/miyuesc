export interface TechItem {
  name: string;
  icon: string; // URL to SVG
  color: string; // Hex color
}

const colors = [
  "#00f3ff", // Neon Cyan
  "#bc13fe", // Neon Purple
  "#ff0055", // Neon Red/Pink
  "#faff00", // Neon Yellow
  "#00ff9f", // Neon Green
  "#ff9500", // Neon Orange
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Using Devicon CDN
const baseUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const techStack: TechItem[] = [
  {
    name: "Webpack",
    icon: `${baseUrl}/webpack/webpack-original.svg`,
    color: getRandomColor(),
  },
  {
    name: "TypeScript",
    icon: `${baseUrl}/typescript/typescript-plain.svg`,
    color: getRandomColor(), // TS Blue: #007acc
  },
  {
    name: "Sass",
    icon: `${baseUrl}/sass/sass-original.svg`,
    color: getRandomColor(), // Sass Pink: #cc6699
  },
  {
    name: "Less",
    icon: `${baseUrl}/less/less-plain-wordmark.svg`,
    color: getRandomColor(), // Less Navy
  },
  {
    name: "NPM",
    icon: `${baseUrl}/npm/npm-original-wordmark.svg`,
    color: getRandomColor(), // NPM Red
  },
  {
    name: "HTML5",
    icon: `${baseUrl}/html5/html5-plain.svg`,
    color: getRandomColor(), // HTML Orange
  },
  {
    name: "Node.js",
    icon: `${baseUrl}/nodejs/nodejs-plain.svg`,
    color: getRandomColor(), // Node Green
  },
  {
    name: "Vue.js",
    icon: `${baseUrl}/vuejs/vuejs-plain.svg`,
    color: getRandomColor(), // Vue Green
  },
  {
    name: "Docker",
    icon: `${baseUrl}/docker/docker-plain.svg`,
    color: getRandomColor(), // Docker Blue
  },
  {
    name: "GitHub Actions",
    icon: `${baseUrl}/githubactions/githubactions-original.svg`,
    color: getRandomColor(),
  },
  {
    name: "Git",
    icon: `${baseUrl}/git/git-plain.svg`,
    color: getRandomColor(), // Git Red
  },
  {
    name: "WebStorm",
    icon: `${baseUrl}/jetbrains/jetbrains-original.svg`, // Webstorm often falls back to Jetbrains or specific
    color: getRandomColor(),
  },
  {
    name: "Markdown",
    icon: `${baseUrl}/markdown/markdown-original.svg`,
    color: getRandomColor(),
  },
];

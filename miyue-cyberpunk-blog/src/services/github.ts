export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionYear {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  };
}

export interface ContributionData {
  total: {
    [year: string]: number;
  };
  contributions: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
}

const USER_NAME = "miyuesc";
const BLOG_REPO = "blog";

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export interface PostMeta {
  title: string;
  date: string;
  path: string;
  sha: string;
}

export const githubService = {
  async getUserProfile(): Promise<GitHubUser> {
    const response = await fetch(`https://api.github.com/users/${USER_NAME}`);
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  },

  async getUserRepos(): Promise<GitHubRepo[]> {
    const response = await fetch(
      `https://api.github.com/users/${USER_NAME}/repos?sort=updated&per_page=100`,
    );
    if (!response.ok) throw new Error("Failed to fetch user repos");
    const repos: GitHubRepo[] = await response.json();
    // Filter out forks if desired, or keep them.
    // Sorting by stars:
    return repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  },

  async getPosts(): Promise<PostMeta[]> {
    // 使用 Trees API 递归获取所有文件 (默认针对 main 分支)
    const response = await fetch(
      `https://api.github.com/repos/${USER_NAME}/${BLOG_REPO}/git/trees/main?recursive=1`,
    );
    if (!response.ok) {
      // 如果 main 失败尝试 master
      const fallback = await fetch(
        `https://api.github.com/repos/${USER_NAME}/${BLOG_REPO}/git/trees/master?recursive=1`,
      );
      if (!fallback.ok) throw new Error("Failed to fetch blog tree");
      return this.processTreeResponse(await fallback.json());
    }
    return this.processTreeResponse(await response.json());
  },

  processTreeResponse(data: { tree: any[] }): PostMeta[] {
    return data.tree
      .filter(
        (item) =>
          item.type === "blob" &&
          item.path.endsWith(".md") &&
          item.path.toLowerCase().split("/").pop() !== "readme.md",
      )
      .map((item) => ({
        title: item.path.split("/").pop().replace(".md", ""),
        date: "2024-01-01", // 日期逻辑维持原样，由于 Git API 不直接提供文件日期
        path: item.path,
        sha: item.sha,
      }))
      .reverse(); // 最新的（按路径排序的倒序，通常能模拟新内容在前的感觉）
  },

  async getPostContent(path: string): Promise<string> {
    const response = await fetch(
      `https://api.github.com/repos/${USER_NAME}/${BLOG_REPO}/contents/${path}`,
      {
        headers: { accept: "application/vnd.github.v3.raw" },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch post content");
    return response.text();
  },

  async getContributions(): Promise<ContributionData> {
    // using third-party API for contributions
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${USER_NAME}?y=last`,
      );
      if (!response.ok) throw new Error("Failed to fetch contributions");
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Fallback to mock data for contributions", e);
      // Fallback mock
      return {
        total: { "2023": 1000 },
        contributions: Array.from({ length: 365 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 5) as any,
        })).reverse(),
      };
    }
  },
};

import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "contents");

export type PostContent = {
  readonly date: string;
  readonly title: string;
  readonly slug: string;
};

let postCache: PostContent[];

export function fetchPostContent(): PostContent[] {
  if (postCache) {
    return postCache;
  }

  const filesNames = fs.readdirSync(postsDirectory);

  const allPostsData = filesNames
    .filter(fileName => fileName.endsWith(".md"))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      const rawContent = fs.readFileSync(fullPath, {
        encoding: "utf-8"
      });
      const matterResult = matter(rawContent);

      const matterData = matterResult.data as {
        date: string;
        title: string;
        slug: string;
      };

      return matterData;
    });

  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  return postCache;
}

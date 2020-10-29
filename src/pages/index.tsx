import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";

import { fetchPostContent } from "../lib/posts";

interface IPost {
  title: string;
  slug: string;
}

interface PageProps {
  blogs: IPost[];
}

export default function Home({ blogs }: PageProps) {
  return (
    <>
      <h1>Blog list</h1>
      <Image src="/perfil.jpg" width="100" height="100" />
      <ul>
        {blogs.map(blog => (
          <li key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  // const fs = require("fs");
  // const matter = require("gray-matter");

  // const files = fs.readdirSync(`${process.cwd()}/contents`, "utf-8");

  // const blogs = files
  //   .filter(fn => fn.endsWith(".md"))
  //   .map(fn => {
  //     const path = `${process.cwd()}/contents/${fn}`;
  //     const rawContent = fs.readFileSync(path, {
  //       encoding: "utf-8"
  //     });
  //     const { data } = matter(rawContent);

  //     return { ...data };
  //   });

  const blogs = fetchPostContent();

  return {
    props: { blogs }
  };
};

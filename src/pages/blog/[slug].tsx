import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

interface IPost {
  title: string;
  content: string;
}

interface PageProps {
  blog: IPost;
}

export default function BlogPostPage({ blog }: PageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando</p>;
  }

  return (
    <article>
      <h1>{blog.title}</h1>

      <section dangerouslySetInnerHTML={{ __html: blog.content }}></section>
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = require("fs");

  const files = fs.readdirSync(`${process.cwd()}/contents`, "utf-8");

  const markdownFileNames = files
    .filter(fn => fn.endsWith(".md"))
    .map(fn => fn.replace(".md", ""));

  return {
    paths: markdownFileNames.map(fileName => {
      return {
        params: {
          slug: fileName
        }
      };
    }),
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async context => {
  const fs = require("fs");
  const unified = require("unified");
  const html = require("remark-html");
  const markdown = require("remark-parse");
  const matter = require("gray-matter");

  const { slug } = context.params;

  const rawContent = fs.readFileSync(
    `${process.cwd()}/contents/${slug}.md`,
    "utf-8"
  );

  const { data, content } = matter(rawContent);

  const result = await unified()
    .use(markdown)
    .use(html)
    .process(content);

  return {
    props: {
      blog: {
        ...data,
        content: result.toString()
      }
    },
    revalidate: 60
  };
};

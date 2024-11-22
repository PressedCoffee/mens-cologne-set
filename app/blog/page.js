import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/utils/dates";

export default async function BlogPage() {
  console.log("Rendering blog page");
  const posts = await getAllPosts();
  console.log("Found posts:", posts);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-white mb-8">
        Fragrance Guide & Tips
      </h1>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl text-white mb-2 hover:text-gold-400">
                {post.title}
              </h2>
              <div className="flex items-center gap-4 text-gray-400 mb-4">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>by {post.author}</span>
              </div>
              <p className="text-gray-300 mb-4">{post.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

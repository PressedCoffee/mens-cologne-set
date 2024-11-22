import { getPostBySlug, getAllPosts } from "@/lib/blog";
import SchemaManager from "@/components/schema/SchemaManager";
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);

  return (
    <>
      <SchemaManager
        type="article"
        data={{
          title: post.title,
          date: post.date,
          author: post.author,
          excerpt: post.excerpt,
        }}
      />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Add Back Button */}
        <Link 
          href="/blog"
          className="text-gray-400 hover:text-gold-400 mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-serif text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString()}
            </time>
            <span>by {post.author}</span>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none
            prose-headings:text-white
            prose-a:text-gold-400 hover:prose-a:text-gold-300
            prose-strong:text-white
            prose-code:text-gold-300
            prose-blockquote:border-gold-400"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Add Tags Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-xl text-white mb-4">Tags</h2>
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
        </div>
      </article>
    </>
  );
}
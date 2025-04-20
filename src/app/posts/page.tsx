import Link from 'next/link';
import { getPosts } from '@/lib/api';

export default async function PostsPage() {
  const { posts } = await getPosts();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link 
          href="/posts/create" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>
      
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-3">
                By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3 mb-3">{post.content}</p>
              <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
                Read more →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No posts found. Create your first post!</p>
        )}
      </div>
    </div>
  );
}
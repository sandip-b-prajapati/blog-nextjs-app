'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaComment } from 'react-icons/fa';

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  comments: Comment[];
}

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId: Number(id),
          authorId: 1, // TODO: Replace with actual user ID from auth
        }),
      });

      if (response.ok) {
        setComment('');
        fetchPost(); // Refresh post to show new comment
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-blue-600 text-xl font-semibold">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h2>
        <p className="text-gray-600">The post you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
          <div className="flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            <span className="font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center">
            <FaComment className="mr-2 text-blue-600" />
            <span>{post.comments.length} comments</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-xl shadow-sm p-8 mb-10 border border-gray-100">
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaComment className="mr-3 text-blue-600" />
          Comments ({post.comments.length})
        </h2>
        
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-10">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-gray-800"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 px-6 py-3 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition duration-200"
          >
            {submitting ? 'Posting comment...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {post.comments.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg">
              <FaComment className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800">{comment.author.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <p className="text-gray-700 pl-13">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
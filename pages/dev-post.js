import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import {
  fetchPosts,
  createPost,
  generateAiPost,
  addReaction,
  searchPosts,
  fetchComments,
  createComment,
  deleteComment,
} from '@/lib/api';
import { useRouter } from 'next/router';

export default function DevPost() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState({}); // map of postId -> comments array
  const [commentInputs, setCommentInputs] = useState({}); // map of postId -> input text

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    async function load() {
      const data = await fetchPosts(token);
      if (Array.isArray(data)) setPosts(data);
      else setError(data.message || 'Failed to load posts');
    }
    load();
  }, [user, token]);

  // Fetch comments whenever posts change
  useEffect(() => {
    async function loadComments() {
      const newComments = {};
      for (const post of posts) {
        try {
          const data = await fetchComments(post.id);
          if (Array.isArray(data)) {
            newComments[post.id] = data;
          }
        } catch (err) {
          console.error(err);
        }
      }
      setComments(newComments);
    }
    if (posts.length > 0) {
      loadComments();
    }
  }, [posts]);

  // Handle search submit or input change
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // reload all posts
      const data = await fetchPosts(token);
      if (Array.isArray(data)) setPosts(data);
      return;
    }
    const data = await searchPosts(token, searchTerm.trim());
    if (Array.isArray(data)) setPosts(data);
  };

  // Handle submitting a new post from regular users. Uses the first 50 characters as the title.
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setPosting(true);
    const res = await createPost(token, {
      title: newContent.slice(0, 50),
      content: newContent,
    });
    setPosting(false);
    if (res.id) {
      // Prepend new post to the list
      setPosts([res, ...posts]);
      setNewContent('');
    } else {
      alert(res.message || 'Failed to create post');
    }
  };

  // Handle generating AI content
  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const data = await generateAiPost(token);
      if (data && data.content) {
        setNewContent(data.content);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingAI(false);
  };

  // Handle reacting to a post
  const handleReact = async (postId, type) => {
    try {
      await addReaction(token, postId, type);
      // Optionally, you could fetch reactions or update UI here
    } catch (err) {
      console.error(err);
    }
  };

  // Handle submitting a comment on a post
  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const content = (commentInputs[postId] || '').trim();
    if (!content) return;
    try {
      const res = await createComment(token, postId, content);
      if (res.id) {
        // Append new comment to list
        setComments({
          ...comments,
          [postId]: [...(comments[postId] || []), res],
        });
        setCommentInputs({ ...commentInputs, [postId]: '' });
      } else {
        alert(res.message || 'Failed to add comment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle deleting a comment
  const handleCommentDelete = async (commentId, postId) => {
    try {
      const res = await deleteComment(token, commentId);
      if (res && res.message) {
        setComments({
          ...comments,
          [postId]: (comments[postId] || []).filter((c) => c.id !== commentId),
        });
      } else {
        alert(res.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Dev-post</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Dev‑post</h2>
        <p className="section-subtitle">Recent writings and experiments</p>
        {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
          />
          <button type="submit" className="btn primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
        </form>
        {/* Facebook‑style post creation box for logged in users */}
        {user && (
          <form onSubmit={handlePostSubmit} style={{ marginBottom: '2rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <textarea
                id="newPost"
                rows="4"
                placeholder="What's on your mind?"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: 'var(--card-bg)', border: '2px solid rgba(0, 179, 255, 0.4)', borderRadius: 'var(--border-radius)', color: 'var(--text-color)', resize: 'vertical' }}
                required
                maxLength={20000}
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn primary" disabled={posting || loadingAI}>
                {posting ? 'Posting...' : 'Post'}
              </button>
              <button
                type="button"
                className="btn"
                disabled={loadingAI}
                onClick={handleGenerateAI}
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                {loadingAI ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
          </form>
        )}
        <div className="cards-grid">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h3 className="card-title">{post.title}</h3>
              <p className="card-desc">
                {post.content.slice(0, 120)}...{/* preview */}
              </p>
              <span className="card-link">by {post.author?.name || 'Unknown'}</span>
              {/* Reaction bar */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <i className="fas fa-thumbs-up" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => handleReact(post.id, 'like')}></i>
                <i className="fas fa-heart" style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => handleReact(post.id, 'love')}></i>
                <i className="fas fa-face-laugh" style={{ cursor: 'pointer', color: 'yellow' }} onClick={() => handleReact(post.id, 'haha')}></i>
                <i className="fas fa-face-surprise" style={{ cursor: 'pointer', color: 'orange' }} onClick={() => handleReact(post.id, 'wow')}></i>
                <i className="fas fa-face-sad-tear" style={{ cursor: 'pointer', color: 'lightblue' }} onClick={() => handleReact(post.id, 'sad')}></i>
                <i className="fas fa-face-angry" style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleReact(post.id, 'angry')}></i>
              </div>

              {/* Comments section */}
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>Comments</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(comments[post.id] || []).map((c) => (
                    <li key={c.id} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{c.author?.name || 'Unknown'}</span>
                        {user && (user.role === 'admin' || c.author?.id === user.id) && (
                          <button
                            onClick={() => handleCommentDelete(c.id, post.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p style={{ margin: '0.25rem 0' }}>{c.content}</p>
                    </li>
                  ))}
                  {(comments[post.id] || []).length === 0 && <li>No comments yet.</li>}
                </ul>
                {/* Add comment form */}
                {user && (
                  <form onSubmit={(e) => handleCommentSubmit(e, post.id)} style={{ marginTop: '0.5rem' }}>
                    <textarea
                      rows="2"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write a comment..."
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid rgba(0,179,255,0.4)', borderRadius: 'var(--border-radius)', background: 'var(--card-bg)', color: 'var(--text-color)', resize: 'vertical' }}
                      required
                      maxLength={1000}
                    ></textarea>
                    <button type="submit" className="btn primary" style={{ marginTop: '0.5rem' }}>
                      Comment
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
          {posts.length === 0 && !error && <p>No posts yet.</p>}
        </div>
      </div>
    </>
  );
}
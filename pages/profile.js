import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchMe, fetchPosts, createPost, generateAiPost } from '@/lib/api';
import { useRouter } from 'next/router';

// Profile page: shows user info and a feed similar to dev‑post, with ability to create posts.
export default function Profile() {
  const { user: authUser, token } = useContext(AuthContext);
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authUser) {
      router.push('/login');
      return;
    }
    async function load() {
      const me = await fetchMe(token);
      setProfile(me);
      const data = await fetchPosts(token);
      if (Array.isArray(data)) setPosts(data);
    }
    load();
  }, [authUser]);

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
      setPosts([res, ...posts]);
      setNewContent('');
    } else {
      alert(res.message || 'Failed to create post');
    }
  };

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

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="section">
        <h2 className="section-title">My Profile</h2>
        {profile && (
          <div
            style={{
              background: 'var(--card-bg)',
              padding: '1.5rem',
              borderRadius: 'var(--border-radius)',
              boxShadow: '0 0 10px rgba(0, 179, 255, 0.2)',
              marginBottom: '2rem',
            }}
          >
            {/* Placeholder avatar using font awesome user icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-user-circle" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{profile.name}</h3>
                <p style={{ color: 'var(--muted-color)' }}>{profile.email}</p>
                <p style={{ color: 'var(--muted-color)', fontSize: '0.8rem' }}>Role: {profile.role}</p>
              </div>
            </div>
          </div>
        )}
        {/* Post creation form */}
        <form onSubmit={handlePostSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <textarea
              id="profilePost"
              rows="10"
              placeholder="Share your coding knowledge..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--card-bg)',
                border: '2px solid rgba(0, 179, 255, 0.4)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--text-color)',
                resize: 'vertical',
              }}
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
        {/* Feed */}
        <div className="cards-grid">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h3 className="card-title">{post.title}</h3>
              <p className="card-desc" style={{ whiteSpace: 'pre-wrap' }}>
                {post.content.length > 500 ? `${post.content.slice(0, 500)}...` : post.content}
              </p>
              <span className="card-link">by {post.author?.name || 'Unknown'}</span>
            </article>
          ))}
          {posts.length === 0 && <p>No posts yet.</p>}
        </div>
      </div>
    </>
  );
}
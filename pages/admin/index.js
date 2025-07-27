import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchPosts, deletePost, fetchStats } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ userCount: 0, postCount: 0 });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dev-post');
      return;
    }
    async function load() {
      // Fetch posts and stats in parallel
      const [postsData, statsData] = await Promise.all([
        fetchPosts(token),
        fetchStats(token),
      ]);
      if (Array.isArray(postsData)) setPosts(postsData);
      else setError(postsData.message || 'Failed to load posts');
      if (statsData && typeof statsData.userCount === 'number') {
        setStats(statsData);
      }
    }
    load();
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    const res = await deletePost(token, id);
    if (res.message === 'Post deleted') {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      alert(res.message || 'Delete failed');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <AdminLayout>
        <h2 className="section-title">Admin Dashboard</h2>
        <p className="section-subtitle">Overview &amp; Management</p>
        {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
        {/* Stats cards */}
        <div className="stats-cards">
          <div className="stats-card">
            <h4>Total Users</h4>
            <p>{stats.userCount}</p>
          </div>
          <div className="stats-card">
            <h4>Total Posts</h4>
            <p>{stats.postCount}</p>
          </div>
        </div>
        {/* Create button */}
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/admin/posts/create" className="btn primary">
            Create New Post
          </Link>
        </div>
        {/* Posts list */}
        <div className="cards-grid">
          {posts.map((post) => (
            <div key={post.id} className="project-card">
              <h3>{post.title}</h3>
              <p>{post.content.slice(0, 120)}...</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link href={`/admin/posts/${post.id}`} className="project-link">
                  Edit
                </Link>
                <span
                  className="project-link"
                  style={{ cursor: 'pointer', color: 'var(--accent)' }}
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </span>
              </div>
            </div>
          ))}
          {posts.length === 0 && !error && <p>No posts found.</p>}
        </div>
      </AdminLayout>
    </>
  );
}
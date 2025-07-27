import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchPosts } from '@/lib/api';
import { useRouter } from 'next/router';

// Dashboard page for regular users. Displays a welcome message and a list of posts authored by the current user.
export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if no user is logged in
    if (!user) {
      router.push('/login');
      return;
    }
    async function load() {
      const data = await fetchPosts(token);
      if (Array.isArray(data)) {
        // Filter posts authored by the current user (id stored in user.id)
        const filtered = data.filter((post) => post.author && post.author.id === user.id);
        setMyPosts(filtered);
      }
      setLoading(false);
    }
    load();
  }, [user, token]);

  return (
    <>
      <Head>
        <title>User Dashboard</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Dashboard</h2>
        <p className="section-subtitle">Welcome back{user ? `, ${user.name}` : ''}</p>
        {/* List of the user's posts */}
        <h3 style={{ marginBottom: '1rem' }}>My Posts</h3>
        {loading && <p>Loading...</p>}
        {!loading && (
          <div className="cards-grid">
            {myPosts.map((post) => (
              <article key={post.id} className="card">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-desc">{post.content.slice(0, 120)}...</p>
              </article>
            ))}
            {myPosts.length === 0 && <p>You haven't authored any posts yet.</p>}
          </div>
        )}
      </div>
    </>
  );
}
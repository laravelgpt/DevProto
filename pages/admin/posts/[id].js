import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { getPost, updatePost } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

// Edit post page for admins. Fetches the post by ID and allows updating its title and content.
export default function EditPost() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dev-post');
      return;
    }
    // Load post data when id is available
    async function load() {
      if (!id) return;
      const data = await getPost(token, id);
      if (data.id) {
        setTitle(data.title);
        setContent(data.content);
      } else {
        setError(data.message || 'Failed to load post');
      }
      setLoading(false);
    }
    load();
  }, [user, token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updatePost(token, id, { title, content });
    if (res.id) {
      router.push('/admin');
    } else {
      setError(res.message || 'Update failed');
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post</title>
      </Head>
      <AdminLayout>
        <div style={{ maxWidth: '600px' }}>
          <h2 className="section-title">Edit Post</h2>
          {loading && <p>Loading...</p>}
          {!loading && (
            <>
              {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    id="editTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="editTitle">Title</label>
                </div>
                <div className="form-group">
                  <textarea
                    id="editContent"
                    rows="6"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder=" "
                    required
                  ></textarea>
                  <label htmlFor="editContent">Content</label>
                </div>
                <button type="submit" className="btn primary">
                  Update
                </button>
              </form>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
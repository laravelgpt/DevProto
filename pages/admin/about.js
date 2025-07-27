import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchAbout, updateAbout } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/router';

// Admin page to edit the About section content
export default function AdminAbout() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
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
    async function load() {
      const data = await fetchAbout();
      if (data && data.content) setContent(data.content);
    }
    load();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const res = await updateAbout(token, { content });
    if (res && res.id) {
      setStatus('Updated successfully!');
    } else {
      setStatus(res.message || 'Update failed');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – About</title>
      </Head>
      <AdminLayout>
        <h2 className="section-title">Edit About</h2>
        {status && (
          <p style={{ color: status.includes('success') ? 'var(--primary)' : 'var(--accent)', marginBottom: '1rem' }}>
            {status}
          </p>
        )}
        <form onSubmit={handleSubmit} className="contact-form" style={{ maxWidth: '800px' }}>
          <div className="form-group">
            <textarea
              id="aboutContent"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder=" "
              required
            ></textarea>
            <label htmlFor="aboutContent">Content (HTML allowed)</label>
          </div>
          <button type="submit" className="btn primary">
            Save
          </button>
        </form>
      </AdminLayout>
    </>
  );
}
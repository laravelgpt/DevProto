import { useContext, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { createPost } from '@/lib/api';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

export default function CreatePost() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    const res = await createPost(token, { title, content });
    if (res.id) {
      router.push('/admin');
    } else {
      setError(res.message || 'Failed to create post');
    }
  };

  return (
    <>
      <Head>
        <title>Create Post</title>
      </Head>
      <AdminLayout>
        <div style={{ maxWidth: '600px' }}>
          <h2 className="section-title">Create Post</h2>
          {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                id="postTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="postTitle">Title</label>
            </div>
            <div className="form-group">
              <textarea
                id="postContent"
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder=" "
                required
              ></textarea>
              <label htmlFor="postContent">Content</label>
            </div>
            <button type="submit" className="btn primary">
              Create
            </button>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
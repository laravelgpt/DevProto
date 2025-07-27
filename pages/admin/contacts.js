import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchContactMessages, deleteContactMessage } from '@/lib/api';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

// Admin page to view and delete contact messages
export default function AdminContacts() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');

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
      const data = await fetchContactMessages(token);
      if (Array.isArray(data)) setMessages(data);
    }
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    const res = await deleteContactMessage(token, id);
    if (res.message === 'Message deleted') {
      setMessages(messages.filter((m) => m.id !== id));
      setStatus('Deleted');
    } else {
      setStatus(res.message || 'Delete failed');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Contacts</title>
      </Head>
      <AdminLayout>
        <h2 className="section-title">Contact Messages</h2>
        {status && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{status}</p>}
        <div className="cards-grid">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="project-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Email:</strong> {msg.email}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-color)' }}>
                {new Date(msg.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(msg.id)}
                className="btn"
                style={{ background: 'var(--accent)', alignSelf: 'flex-start' }}
              >
                Delete
              </button>
            </div>
          ))}
          {messages.length === 0 && <p>No contact messages.</p>}
        </div>
      </AdminLayout>
    </>
  );
}
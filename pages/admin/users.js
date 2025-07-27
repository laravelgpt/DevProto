import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchUsersList } from '@/lib/api';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

// Admin page to view the list of all registered users
export default function AdminUsers() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

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
      const data = await fetchUsersList(token);
      if (Array.isArray(data)) setUsers(data);
      else setError(data.message || 'Failed to load users');
    }
    load();
  }, [user]);

  return (
    <>
      <Head>
        <title>Admin – Users</title>
      </Head>
      <AdminLayout>
        <h2 className="section-title">Users</h2>
        {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
        <div className="cards-grid">
          {users.map((u) => (
            <div key={u.id} className="project-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>
                <strong>Name:</strong> {u.name}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Role:</strong> {u.role}
              </p>
            </div>
          ))}
          {users.length === 0 && !error && <p>No users found.</p>}
        </div>
      </AdminLayout>
    </>
  );
}
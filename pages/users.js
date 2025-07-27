import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import {
  fetchUsersList,
  sendFriendRequest,
  fetchPendingRequests,
  acceptFriendRequest,
} from '@/lib/api';
import { useRouter } from 'next/router';

// Users page: lists other users, allows sending friend requests and viewing pending requests
export default function Users() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    async function load() {
      const allUsers = await fetchUsersList(token);
      if (Array.isArray(allUsers)) {
        // Exclude current user
        setUsers(allUsers.filter((u) => u.id !== user.id));
      }
      const pendingReq = await fetchPendingRequests(token);
      if (Array.isArray(pendingReq)) setPending(pendingReq);
    }
    load();
  }, [user]);

  const handleSendRequest = async (id) => {
    setStatus('');
    const res = await sendFriendRequest(token, id);
    if (res.message === 'Friend request sent') {
      setStatus('Friend request sent');
    } else {
      setStatus(res.message || 'Failed');
    }
  };

  const handleAccept = async (id) => {
    setStatus('');
    const res = await acceptFriendRequest(token, id);
    if (res.message === 'Friend request accepted') {
      setStatus('Friend request accepted');
      // Remove from pending list
      setPending(pending.filter((p) => p.id !== id));
    } else {
      setStatus(res.message || 'Failed to accept');
    }
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Users</h2>
        {status && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{status}</p>}
        {/* Pending requests to current user */}
        <h3 style={{ marginBottom: '0.5rem' }}>Friend Requests</h3>
        <div className="cards-grid" style={{ marginBottom: '2rem' }}>
          {pending.map((p) => (
            <div key={p.id} className="project-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>{p.name} ({p.email})</p>
              <button
                className="btn primary"
                onClick={() => handleAccept(p.id)}
              >
                Accept
              </button>
            </div>
          ))}
          {pending.length === 0 && <p>No pending requests.</p>}
        </div>
        {/* List all other users with Add Friend button */}
        <h3 style={{ marginBottom: '0.5rem' }}>All Users</h3>
        <div className="cards-grid">
          {users.map((u) => (
            <div key={u.id} className="project-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>{u.name} ({u.email})</p>
              <button
                className="btn primary"
                onClick={() => handleSendRequest(u.id)}
              >
                Add Friend
              </button>
            </div>
          ))}
          {users.length === 0 && <p>No other users found.</p>}
        </div>
      </div>
    </>
  );
}
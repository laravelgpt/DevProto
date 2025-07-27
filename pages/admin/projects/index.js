import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import {
  fetchProjectsList,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/api';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

// Admin page to manage portfolio projects (CRUD)
export default function AdminProjects() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLink, setNewLink] = useState('');
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
      const data = await fetchProjectsList();
      if (Array.isArray(data)) setProjects(data);
    }
    load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;
    const res = await createProject(token, {
      title: newTitle,
      description: newDescription,
      link: newLink,
    });
    if (res && res.id) {
      setProjects([res, ...projects]);
      setNewTitle('');
      setNewDescription('');
      setNewLink('');
      setStatus('Project created successfully');
    } else {
      setStatus(res.message || 'Create failed');
    }
  };

  const handleUpdate = async (id, title, description, link) => {
    const res = await updateProject(token, id, { title, description, link });
    if (res && res.id) {
      setProjects(projects.map((p) => (p.id === id ? res : p)));
      setStatus('Updated');
    } else {
      setStatus(res.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    const res = await deleteProject(token, id);
    if (res.message === 'Project deleted') {
      setProjects(projects.filter((p) => p.id !== id));
      setStatus('Deleted');
    } else {
      setStatus(res.message || 'Delete failed');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Projects</title>
      </Head>
      {/* Wrap page content in AdminLayout to provide sidebar navigation */}
      <AdminLayout>
        <h2 className="section-title">Manage Projects</h2>
        {status && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{status}</p>}
        {/* Form to create new project */}
        <form
          onSubmit={handleCreate}
          style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>Description</label>
            <textarea
              rows="4"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
              required
            ></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>Link (optional)</label>
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
            />
          </div>
          <button type="submit" className="btn primary">Add Project</button>
        </form>
        {/* Projects list */}
        <div className="cards-grid">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="project-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div>
                <label
                  style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p) => (p.id === proj.id ? { ...p, title: e.target.value } : p))
                    )
                  }
                  style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label
                  style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}
                >
                  Description
                </label>
                <textarea
                  rows="3"
                  value={proj.description}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p) => (p.id === proj.id ? { ...p, description: e.target.value } : p))
                    )
                  }
                  style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                ></textarea>
              </div>
              <div>
                <label
                  style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}
                >
                  Link
                </label>
                <input
                  type="url"
                  value={proj.link || ''}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p) => (p.id === proj.id ? { ...p, link: e.target.value } : p))
                    )
                  }
                  style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                onClick={() => handleUpdate(proj.id, proj.title, proj.description, proj.link)}
                  className="btn primary"
                  style={{ flex: 1 }}
                >
                  Save
                </button>
                <button
                onClick={() => handleDelete(proj.id)}
                  className="btn"
                  style={{ background: 'var(--accent)', flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p>No projects yet.</p>}
        </div>
      </AdminLayout>
    </>
  );
}
import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchSkillsList, createSkill, updateSkill, deleteSkill } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/router';

// Admin page to manage Skills (CRUD)
export default function AdminSkills() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState('');
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
      const data = await fetchSkillsList();
      if (Array.isArray(data)) setSkills(data);
    }
    load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName || !newLevel) return;
    const res = await createSkill(token, { name: newName, level: parseInt(newLevel) });
    if (res && res.id) {
      setSkills([res, ...skills]);
      setNewName('');
      setNewLevel('');
      setStatus('Skill created successfully');
    } else {
      setStatus(res.message || 'Create failed');
    }
  };

  const handleUpdate = async (id, name, level) => {
    const res = await updateSkill(token, id, { name, level });
    if (res && res.id) {
      setSkills(skills.map((s) => (s.id === id ? res : s)));
      setStatus('Updated');
    } else {
      setStatus(res.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteSkill(token, id);
    if (res.message === 'Skill deleted') {
      setSkills(skills.filter((s) => s.id !== id));
      setStatus('Deleted');
    } else {
      setStatus(res.message || 'Delete failed');
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Skills</title>
      </Head>
      <AdminLayout>
        <h2 className="section-title">Manage Skills</h2>
        {status && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{status}</p>}
        {/* Form to create new skill */}
        <form
          onSubmit={handleCreate}
          style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem' }}>Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
              required
            />
          </div>
          <button type="submit" className="btn primary">Add Skill</button>
        </form>
        {/* List of skills */}
        <div className="cards-grid">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="project-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}>Name</label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    setSkills(skills.map((s) => (s.id === skill.id ? { ...s, name: e.target.value } : s)))
                  }
                  style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}>Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) =>
                    setSkills(skills.map((s) => (s.id === skill.id ? { ...s, level: e.target.value } : s)))
                  }
                  style={{ width: '100%', padding: '0.4rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(0,179,255,0.4)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleUpdate(skill.id, skill.name, parseInt(skill.level))}
                  className="btn primary"
                  style={{ flex: 1 }}
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="btn"
                  style={{ background: 'var(--accent)', flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p>No skills yet.</p>}
        </div>
      </AdminLayout>
    </>
  );
}
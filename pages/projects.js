import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProjectsList } from '@/lib/api';

// Projects page presents portfolio projects fetched from the database
export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    async function load() {
      const data = await fetchProjectsList();
      if (Array.isArray(data)) setProjects(data);
    }
    load();
  }, []);
  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Things I’ve built</p>
        <div className="projects-grid">
          {projects.map((proj) => (
            <div className="project-card" key={proj.id}>
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              {proj.link && (
                <Link href={proj.link} className="project-link">
                  View details
                </Link>
              )}
            </div>
          ))}
          {projects.length === 0 && <p>No projects added yet.</p>}
        </div>
      </div>
    </>
  );
}
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { fetchSkillsList } from '@/lib/api';

// Skills page showcasing proficiency levels using progress bars and icons fetched from the database
export default function Skills() {
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    async function load() {
      const data = await fetchSkillsList();
      if (Array.isArray(data)) setSkills(data);
    }
    load();
  }, []);
  return (
    <>
      <Head>
        <title>Skills</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">What I bring to the table</p>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill" key={skill.id}>
              <div className="skill-icon">
                {/* Try to derive an icon class from the skill name (fall back to code icon) */}
                <i className={`fas fa-code`}></i>
              </div>
              <h3>{skill.name}</h3>
              <div className="progress-bar">
                <span style={{ width: `${skill.level}%` }}></span>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p>No skills added yet.</p>}
        </div>
      </div>
    </>
  );
}
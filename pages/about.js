import Head from 'next/head';

// About page describing the developer. This page reuses the section styling from the global CSS.
import { useEffect, useState } from 'react';
import { fetchAbout } from '@/lib/api';

export default function About() {
  const [content, setContent] = useState('');
  useEffect(() => {
    async function load() {
      const data = await fetchAbout();
      if (data && data.content) setContent(data.content);
    }
    load();
  }, []);
  return (
    <>
      <Head>
        <title>About Me</title>
      </Head>
      <div className="section">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Learn more about my journey</p>
        <div
          style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--muted-color)' }}
          dangerouslySetInnerHTML={{ __html: content || `<p>I’m a passionate front‑end developer with a love for futuristic designs.</p>` }}
        ></div>
      </div>
    </>
  );
}
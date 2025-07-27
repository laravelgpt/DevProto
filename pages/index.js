import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Developer Portfolio</title>
      </Head>
      <section className="hero">
        <div className="hero-bg"></div>
        <h1>
          Hi, I’m <span className="accent">Your&nbsp;Name</span>
        </h1>
        <p className="subtitle">Front‑End Developer &amp; Designer</p>
        <p className="description">
          I craft immersive web experiences with modern technologies, blending
          performance and aesthetics. Explore my work and let’s build something
          futuristic together.
        </p>
        <Link href="/projects" className="btn primary">
          View Projects
        </Link>
      </section>
    </>
  );
}
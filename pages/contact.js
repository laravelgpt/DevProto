import { useState } from 'react';
import Head from 'next/head';
import { createContact } from '@/lib/api';

// Contact page with a form that submits messages to the database
export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await createContact({ name, email, message });
    setLoading(false);
    if (res.message === 'Message received') {
      setSuccess('Thank you for reaching out! I will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      setError(res.message || 'Failed to send message');
    }
  };

  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
      <div className="section">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Let’s build something together</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {success && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{success}</p>}
          {error && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{error}</p>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder=" "
                required
              ></textarea>
              <label htmlFor="message">Message</label>
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
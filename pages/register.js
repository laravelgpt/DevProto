import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Head from 'next/head';
import { registerUser } from '@/lib/api';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const res = await registerUser({ name, email, password });
    if (res.message === 'User registered successfully') {
      setMessage('Registration successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirm('');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="section" style={{ maxWidth: '400px' }}>
        <h2 className="section-title">Register</h2>
        {error && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{error}</p>}
        {message && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{message}</p>}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              id="regName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="regName">Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="regEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="regEmail">Email</label>
          </div>
          <div className="form-group relative">
            <input
              type={showPassword ? "text" : "password"}
              id="regPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="pr-10 w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <label htmlFor="regPassword" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-1 peer-focus:text-sm peer-focus:top-2 peer-focus:-translate-y-1/2 peer-focus:px-0 peer-focus:text-blue-500">Password</label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <span className="text-lg">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </button>
          </div>
          <div className="form-group relative">
            <input
              type={showConfirm ? "text" : "password"}
              id="regConfirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder=" "
              required
              className="pr-10 w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <label htmlFor="regConfirm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-1 peer-focus:text-sm peer-focus:top-2 peer-focus:-translate-y-1/2 peer-focus:px-0 peer-focus:text-blue-500">Confirm Password</label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label="Toggle confirm password visibility"
            >
              <span className="text-lg">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            </button>
          </div>
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
import { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Head from 'next/head';
import { AuthContext } from '@/contexts/AuthContext';
import { loginUser } from '@/lib/api';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = await loginUser({ email, password });
    if (data.token) {
      login({ token: data.token, user: data.user });
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="section" style={{ maxWidth: '400px' }}>
        <h2 className="section-title">Login</h2>
        {error && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="loginEmail">Email</label>
          </div>
          <div className="form-group relative">
            <input
              type={showPassword ? "text" : "password"}
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="pr-10 w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <label htmlFor="loginPassword" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:px-1 peer-focus:text-sm peer-focus:top-2 peer-focus:-translate-y-1/2 peer-focus:px-0 peer-focus:text-blue-500">Password</label>
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
          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
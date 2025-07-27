import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  // Mobile navigation state
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <span>Dev<span className="accent">Proto</span></span>
        </Link>
      </div>
      {/* Mobile nav toggle */}
      <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="fas fa-bars"></i>
      </div>
      <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
        <li>
          <Link href="/">
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/dev-post">
            <span>Dev-post</span>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <span>About</span>
          </Link>
        </li>
        <li>
          <Link href="/skills">
            <span>Skills</span>
          </Link>
        </li>
        <li>
          <Link href="/projects">
            <span>Projects</span>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <span>Contact</span>
          </Link>
        </li>
        {user ? (
          <>
            {/* Show admin or user dashboard link based on role */}
            {/* Common Users page for all logged-in users */}
            <li>
              <Link href="/users">
                <span>Users</span>
              </Link>
            </li>
            {user.role === 'admin' ? (
              <li>
                <Link href="/admin">
                  <span>Admin</span>
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/dashboard">
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            <li className="auth-link" onClick={logout}>
              <span>Logout ({user.name})</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link href="/register">
                <span>Register</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
import Link from 'next/link';

// A layout component for admin pages that includes the sidebar navigation
export default function AdminLayout({ children }) {
  return (
    <div className="section" style={{ maxWidth: '100%' }}>
      <div className="admin-container">
        <aside className="admin-sidebar">
          <ul>
            <li>
              <Link href="/admin">
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/posts/create">
                <span>Create Post</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/about">
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/skills">
                <span>Skills</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/projects">
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/contacts">
                <span>Contacts</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
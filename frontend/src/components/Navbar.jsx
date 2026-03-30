import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const linkClassName = ({ isActive }) =>
  `nav-chip rounded-full px-4 py-2 text-sm font-medium ${
    isActive ? 'nav-chip-active' : ''
  }`;

const Navbar = () => {
  const { logout, theme, toggleTheme, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur-xl"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="hero-badge text-xs">
            Health Tracker
          </p>
          <h1 className="text-lg font-semibold text-main">
            Welcome back, {user?.fullName?.split(' ')[0] || 'there'}
          </h1>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink className={linkClassName} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={linkClassName} to="/logs">
            Add Health Data
          </NavLink>
          <NavLink className={linkClassName} to="/profile">
            Profile
          </NavLink>
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            <span className="theme-toggle-thumb">{theme === 'dark' ? 'L' : 'D'}</span>
            <span className="text-sm font-semibold">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
          <button
            className="btn-danger rounded-full px-4 py-2 text-sm font-semibold"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

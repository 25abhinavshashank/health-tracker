import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: 'demo@healthtracker.com',
    password: 'Password123!'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-panel grid w-full max-w-6xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex">
          <div>
            <p className="hero-badge text-sm">Health Tracker</p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-tight text-main">
              Build better habits with one place for nutrition, movement, and sleep.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted">
              A cleaner wellness cockpit with daily tracking, goals, and charts that feel calm instead of cluttered.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl p-5" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
              <p className="text-3xl font-semibold text-main">7d</p>
              <p className="mt-2 text-sm text-muted">Trend dashboards and quick insights.</p>
            </div>
            <div className="rounded-3xl p-5" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
              <p className="text-3xl font-semibold text-main">JWT</p>
              <p className="mt-2 text-sm text-muted">Secure access with refresh tokens.</p>
            </div>
            <div className="rounded-3xl p-5" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
              <p className="text-3xl font-semibold text-main">Goals</p>
              <p className="mt-2 text-sm text-muted">Stay focused on real outcomes.</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <p className="hero-badge text-sm lg:hidden">Health Tracker</p>
            <h2 className="mt-4 text-3xl font-semibold text-main">Sign in</h2>
            <p className="mt-2 text-sm text-muted">
              Use the seeded demo account or your own credentials.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <InputField
                label="Email"
                name="email"
                onChange={handleChange}
                placeholder="demo@healthtracker.com"
                required
                type="email"
                value={formData.email}
              />
              <InputField
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                required
                type="password"
                value={formData.password}
              />
              {error ? (
                <div className="rounded-2xl px-4 py-3 text-sm" style={{ border: '1px solid rgba(248, 113, 113, 0.35)', background: 'rgba(248, 113, 113, 0.12)', color: '#fecaca' }}>
                  {error}
                </div>
              ) : null}
              <button
                className="btn-primary w-full rounded-2xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
                type="submit"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-sm text-muted">
              New here?{' '}
              <Link className="font-semibold" style={{ color: 'var(--primary)' }} to="/register">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;

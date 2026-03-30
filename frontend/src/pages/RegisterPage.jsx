import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../components/InputField';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    goalSummary: ''
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
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        profile: {
          age: formData.age ? Number(formData.age) : null,
          weight: formData.weight ? Number(formData.weight) : null,
          height: formData.height ? Number(formData.height) : null,
          goalSummary: formData.goalSummary
        }
      });
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-panel w-full max-w-3xl rounded-[2rem] p-6 sm:p-10">
        <div className="mb-8">
          <p className="hero-badge text-sm">Create Account</p>
          <h1 className="mt-4 text-3xl font-semibold text-main">
            Start building a healthier routine
          </h1>
          <p className="mt-2 text-sm text-muted">
            Create your profile once, then log progress daily.
          </p>
        </div>

        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <InputField
            label="Full name"
            name="fullName"
            onChange={handleChange}
            placeholder="Avery Jordan"
            required
            value={formData.fullName}
          />
          <InputField
            label="Email"
            name="email"
            onChange={handleChange}
            placeholder="avery@example.com"
            required
            type="email"
            value={formData.email}
          />
          <InputField
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            required
            type="password"
            value={formData.password}
          />
          <InputField
            label="Age"
            min="0"
            name="age"
            onChange={handleChange}
            placeholder="29"
            type="number"
            value={formData.age}
          />
          <InputField
            label="Weight (kg)"
            min="0"
            name="weight"
            onChange={handleChange}
            placeholder="74"
            step="0.1"
            type="number"
            value={formData.weight}
          />
          <InputField
            label="Height (cm)"
            min="0"
            name="height"
            onChange={handleChange}
            placeholder="173"
            type="number"
            value={formData.height}
          />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-main">Goal summary</span>
            <textarea
              className="input-shell min-h-28 w-full rounded-2xl px-4 py-3"
              name="goalSummary"
              onChange={handleChange}
              placeholder="Improve energy, maintain a calorie deficit, and sleep at least 7.5 hours."
              value={formData.goalSummary}
            />
          </label>

          {error ? (
            <div className="rounded-2xl px-4 py-3 text-sm md:col-span-2" style={{ border: '1px solid rgba(248, 113, 113, 0.35)', background: 'rgba(248, 113, 113, 0.12)', color: '#fecaca' }}>
              {error}
            </div>
          ) : null}

          <button
            className="btn-primary rounded-2xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link className="font-semibold" style={{ color: 'var(--primary)' }} to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;

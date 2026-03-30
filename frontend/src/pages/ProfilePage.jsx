import { useEffect, useState } from 'react';

import InputField from '../components/InputField';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile } from '../services/profileService';

const ProfilePage = () => {
  const { refreshUser, user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    weight: '',
    height: '',
    goalSummary: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        setFormData({
          fullName: response.user.fullName || '',
          age: response.user.profile?.age ?? '',
          weight: response.user.profile?.weight ?? '',
          height: response.user.profile?.height ?? '',
          goalSummary: response.user.profile?.goalSummary || ''
        });
      } catch (_error) {
        setError('Unable to load profile.');
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await updateProfile({
        fullName: formData.fullName,
        profile: {
          age: formData.age ? Number(formData.age) : null,
          weight: formData.weight ? Number(formData.weight) : null,
          height: formData.height ? Number(formData.height) : null,
          goalSummary: formData.goalSummary
        }
      });
      await refreshUser();
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 pb-12">
      <SectionCard subtitle="Keep your core metrics and goals current." title="Profile">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <InputField
            label="Full name"
            name="fullName"
            onChange={handleChange}
            required
            value={formData.fullName}
          />
          <div className="rounded-2xl p-4" style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
            <p className="text-sm text-muted">Email</p>
            <p className="mt-2 font-medium text-main">{user?.email}</p>
          </div>
          <InputField
            label="Age"
            min="0"
            name="age"
            onChange={handleChange}
            type="number"
            value={formData.age}
          />
          <InputField
            label="Weight (kg)"
            min="0"
            name="weight"
            onChange={handleChange}
            step="0.1"
            type="number"
            value={formData.weight}
          />
          <InputField
            label="Height (cm)"
            min="0"
            name="height"
            onChange={handleChange}
            type="number"
            value={formData.height}
          />
          <div className="rounded-2xl p-4" style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}>
            <p className="text-sm text-muted">Last login</p>
            <p className="mt-2 font-medium text-main">
              {user?.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : 'Available after your next login'}
            </p>
          </div>
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-main">Goal summary</span>
            <textarea
              className="input-shell min-h-28 w-full rounded-2xl px-4 py-3"
              name="goalSummary"
              onChange={handleChange}
              placeholder="Describe the routine or outcomes you are aiming for."
              value={formData.goalSummary}
            />
          </label>

          {message ? (
            <div className="rounded-2xl px-4 py-3 text-sm md:col-span-2" style={{ border: '1px solid rgba(45, 212, 191, 0.35)', background: 'rgba(45, 212, 191, 0.12)', color: 'var(--text)' }}>
              {message}
            </div>
          ) : null}
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
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </SectionCard>
    </main>
  );
};

export default ProfilePage;

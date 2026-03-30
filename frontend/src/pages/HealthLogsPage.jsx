import { useEffect, useState } from 'react';

import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import SectionCard from '../components/SectionCard';
import {
  createLog,
  deleteLog,
  getLogs,
  updateLog
} from '../services/logService';
import { formatDate } from '../utils/appFormatters';

const initialLogState = {
  date: '',
  caloriesIntake: '',
  waterIntakeLiters: '',
  steps: '',
  exerciseMinutes: '',
  sleepHours: '',
  notes: ''
};

const HealthLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState(initialLogState);
  const [editingLogId, setEditingLogId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);

    try {
      const response = await getLogs();
      setLogs(response.logs);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetForm = () => {
    setFormData(initialLogState);
    setEditingLogId(null);
  };

  const buildPayload = () => ({
    date: formData.date,
    caloriesIntake: Number(formData.caloriesIntake),
    waterIntakeLiters: Number(formData.waterIntakeLiters),
    steps: Number(formData.steps || 0),
    exerciseMinutes: Number(formData.exerciseMinutes || 0),
    sleepHours: Number(formData.sleepHours),
    notes: formData.notes
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingLogId) {
        await updateLog(editingLogId, buildPayload());
      } else {
        await createLog(buildPayload());
      }

      resetForm();
      await loadLogs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save log.');
    }
  };

  const handleEdit = (log) => {
    setEditingLogId(log._id);
    setFormData({
      date: log.date.slice(0, 10),
      caloriesIntake: log.caloriesIntake,
      waterIntakeLiters: log.waterIntakeLiters,
      steps: log.steps,
      exerciseMinutes: log.exerciseMinutes,
      sleepHours: log.sleepHours,
      notes: log.notes || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteLog(id);
      await loadLogs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete log.');
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 pb-12">
      <SectionCard
        subtitle="Create and maintain one entry per day."
        title={editingLogId ? 'Update Health Log' : 'Add Daily Health Data'}
      >
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
          <InputField
            label="Date"
            name="date"
            onChange={handleChange}
            required
            type="date"
            value={formData.date}
          />
          <InputField
            label="Calories intake"
            min="0"
            name="caloriesIntake"
            onChange={handleChange}
            required
            type="number"
            value={formData.caloriesIntake}
          />
          <InputField
            label="Water intake (liters)"
            min="0"
            name="waterIntakeLiters"
            onChange={handleChange}
            required
            step="0.1"
            type="number"
            value={formData.waterIntakeLiters}
          />
          <InputField
            label="Steps"
            min="0"
            name="steps"
            onChange={handleChange}
            type="number"
            value={formData.steps}
          />
          <InputField
            label="Exercise duration (minutes)"
            min="0"
            name="exerciseMinutes"
            onChange={handleChange}
            type="number"
            value={formData.exerciseMinutes}
          />
          <InputField
            label="Sleep hours"
            max="24"
            min="0"
            name="sleepHours"
            onChange={handleChange}
            required
            step="0.1"
            type="number"
            value={formData.sleepHours}
          />
          <label className="md:col-span-2 xl:col-span-3">
            <span className="mb-2 block text-sm font-medium text-main">Notes</span>
            <textarea
              className="input-shell min-h-24 w-full rounded-2xl px-4 py-3"
              name="notes"
              onChange={handleChange}
              placeholder="How did today feel?"
              value={formData.notes}
            />
          </label>
          {error ? (
            <div className="rounded-2xl px-4 py-3 text-sm md:col-span-2 xl:col-span-3" style={{ border: '1px solid rgba(248, 113, 113, 0.35)', background: 'rgba(248, 113, 113, 0.12)', color: '#fecaca' }}>
              {error}
            </div>
          ) : null}
          <div className="flex gap-3 md:col-span-2 xl:col-span-3">
            <button
              className="btn-primary rounded-2xl px-4 py-3 font-semibold"
              type="submit"
            >
              {editingLogId ? 'Save log' : 'Add log'}
            </button>
            {editingLogId ? (
              <button
                className="btn-secondary rounded-2xl px-4 py-3 font-semibold"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard subtitle="Newest entries first." title="Log History">
        {loading ? (
          <p className="text-muted">Loading logs...</p>
        ) : logs.length ? (
          <div className="table-shell overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left">
                <thead className="text-sm uppercase tracking-[0.2em] text-subtle" style={{ background: 'var(--surface-strong)' }}>
                  <tr>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Calories</th>
                    <th className="px-4 py-4">Water</th>
                    <th className="px-4 py-4">Steps</th>
                    <th className="px-4 py-4">Exercise</th>
                    <th className="px-4 py-4">Sleep</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ background: 'transparent' }}>
                  {logs.map((log) => (
                    <tr className="text-sm text-main" key={log._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className="px-4 py-4">{formatDate(log.date)}</td>
                      <td className="px-4 py-4">{log.caloriesIntake} kcal</td>
                      <td className="px-4 py-4">{log.waterIntakeLiters} L</td>
                      <td className="px-4 py-4">{log.steps}</td>
                      <td className="px-4 py-4">{log.exerciseMinutes} min</td>
                      <td className="px-4 py-4">{log.sleepHours} hrs</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            className="btn-secondary rounded-full px-3 py-2 text-xs font-semibold"
                            onClick={() => handleEdit(log)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger rounded-full px-3 py-2 text-xs font-semibold"
                            onClick={() => handleDelete(log._id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            description="Your logged days will appear here once you start tracking."
            title="No logs recorded yet"
          />
        )}
      </SectionCard>
    </main>
  );
};

export default HealthLogsPage;

import { useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth.js';
import goalService from '../services/goalService.js';
import Container from '../components/Container.jsx';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import NumberInput from '../components/NumberInput.jsx';
import Textarea from '../components/Textarea.jsx';

const goalTypes = [
  { id: 'weight_loss', label: 'Weight loss', defaultUnit: 'kg' },
  { id: 'weight_gain', label: 'Weight gain', defaultUnit: 'kg' },
  { id: 'maintenance', label: 'Maintenance', defaultUnit: 'kg' },
  { id: 'calorie_target', label: 'Calorie target', defaultUnit: 'kcal' },
  { id: 'water_target', label: 'Water target', defaultUnit: 'liters' },
  { id: 'sleep_target', label: 'Sleep target', defaultUnit: 'hours' },
  { id: 'steps_target', label: 'Steps target', defaultUnit: 'steps' },
  { id: 'exercise_target', label: 'Exercise target', defaultUnit: 'minutes' }
];

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState(() => ({
    type: 'calorie_target',
    title: '',
    targetValue: '',
    unit: 'kcal',
    dueDate: '',
    notes: ''
  }));

  useEffect(() => {
    const initial = goalTypes.find((t) => t.id === form.type);
    if (initial) setForm((s) => ({ ...s, unit: initial.defaultUnit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type]);

  const loadGoals = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await goalService.getGoals();
      setGoals(data.goals || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load goals.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user) loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        type: form.type,
        title: form.title || `${goalTypes.find((t) => t.id === form.type)?.label} goal`,
        targetValue: Number(form.targetValue),
        unit: form.unit,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        notes: form.notes,
        currentValue: 0,
        isCompleted: false
      };
      const created = await goalService.createGoal(payload);
      setGoals((prev) => [created.goal, ...prev]);
      setForm((s) => ({
        ...s,
        title: '',
        targetValue: '',
        dueDate: '',
        notes: ''
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create goal.');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    setBusy(true);
    setError('');
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete goal.');
    } finally {
      setBusy(false);
    }
  };

  const onUpdate = async (id, updates) => {
    setBusy(true);
    setError('');
    try {
      const updated = await goalService.updateGoal(id, updates);
      setGoals((prev) => prev.map((g) => (g._id === id ? updated.goal : g)));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update goal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h1 className="text-xl font-semibold">Goals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create goals for calories, hydration, movement, sleep, and more.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={onCreate}>
            <FormField label="Goal type">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={form.type}
                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
              >
                {goalTypes.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Title" hint="Short label">
              <Input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                placeholder="e.g. Drink 3 liters daily"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Target value">
                <NumberInput
                  value={form.targetValue}
                  onChange={(e) => setForm((s) => ({ ...s, targetValue: e.target.value }))}
                  min="0"
                  step="0.1"
                  required
                />
              </FormField>
              <FormField label="Unit">
                <Input
                  value={form.unit}
                  onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                  required
                />
              </FormField>
            </div>

            <FormField label="Due date" hint="Optional">
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
              />
            </FormField>

            <FormField label="Notes" hint="Optional">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              />
            </FormField>

            <button
              disabled={busy}
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Create goal'}
            </button>
          </form>
        </Card>

        <Card className="bg-slate-50">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800">Your goals</h2>
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
              onClick={loadGoals}
              disabled={busy}
              type="button"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {goals.length === 0 ? (
              <div className="text-sm text-slate-600">No goals yet. Create one on the left.</div>
            ) : null}

            {goals.map((g) => (
              <div key={g._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{g.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{g.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Target</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {g.targetValue} {g.unit}
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onDelete(g._id)}
                        disabled={busy}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <FormField label="Current value">
                    <NumberInput
                      value={g.currentValue ?? 0}
                      onChange={(e) => {
                        const v = e.target.value;
                        setGoals((prev) =>
                          prev.map((x) => (x._id === g._id ? { ...x, currentValue: Number(v) } : x))
                        );
                      }}
                      min="0"
                      step="0.1"
                    />
                  </FormField>
                  <FormField label="Completed">
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      value={g.isCompleted ? 'yes' : 'no'}
                      onChange={(e) => {
                        const v = e.target.value === 'yes';
                        setGoals((prev) =>
                          prev.map((x) => (x._id === g._id ? { ...x, isCompleted: v } : x))
                        );
                      }}
                    >
                      <option value="no">Not completed</option>
                      <option value="yes">Completed</option>
                    </select>
                  </FormField>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onUpdate(g._id, { currentValue: g.currentValue, isCompleted: g.isCompleted })}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}


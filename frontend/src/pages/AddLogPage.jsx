import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';
import healthLogService from '../services/healthLogService.js';
import Card from '../components/Card.jsx';
import Container from '../components/Container.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import NumberInput from '../components/NumberInput.jsx';
import Textarea from '../components/Textarea.jsx';

const toLocalDateInputValue = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AddLogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initialDate = useMemo(() => toLocalDateInputValue(new Date()), []);

  const [form, setForm] = useState({
    date: initialDate,
    caloriesIntake: 2000,
    waterIntakeLiters: 2.5,
    steps: 8000,
    exerciseMinutes: 30,
    sleepHours: 7.0,
    notes: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await healthLogService.createLog({
        ...form,
        date: form.date
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create log.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h1 className="text-xl font-semibold">Add daily health log</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your calories, water, steps, exercise, and sleep.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <FormField label="Date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Calories (kcal)">
                <NumberInput
                  value={form.caloriesIntake}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, caloriesIntake: Number(e.target.value) }))
                  }
                  min="0"
                  step="10"
                />
              </FormField>
              <FormField label="Water (L)">
                <NumberInput
                  value={form.waterIntakeLiters}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      waterIntakeLiters: Number(e.target.value)
                    }))
                  }
                  min="0"
                  step="0.1"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Steps">
                <NumberInput
                  value={form.steps}
                  onChange={(e) => setForm((s) => ({ ...s, steps: Number(e.target.value) }))}
                  min="0"
                  step="100"
                />
              </FormField>
              <FormField label="Exercise (min)">
                <NumberInput
                  value={form.exerciseMinutes}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      exerciseMinutes: Number(e.target.value)
                    }))
                  }
                  min="0"
                  step="5"
                />
              </FormField>
            </div>

            <FormField label="Sleep hours" hint="0 - 24">
              <NumberInput
                value={form.sleepHours}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    sleepHours: Number(e.target.value)
                  }))
                }
                min="0"
                max="24"
                step="0.1"
              />
            </FormField>

            <FormField label="Notes" hint="Optional">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                placeholder={`How did ${user?.fullName || 'today'} go?`}
              />
            </FormField>

            <button
              disabled={saving}
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save log'}
            </button>
          </form>
        </Card>

        <Card className="bg-gradient-to-b from-slate-50 to-white">
          <h2 className="text-sm font-semibold text-slate-700">Quick tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Try to keep calories consistent for clearer trends.</li>
            <li>• Water intake improves sleep and recovery.</li>
            <li>• Use notes to remember “why” a day was different.</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}


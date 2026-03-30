import { useEffect, useMemo, useState } from 'react';

import EmptyState from '../components/EmptyState';
import HealthTrendChart from '../components/HealthTrendChart';
import InputField from '../components/InputField';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../hooks/useAuth';
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal
} from '../services/goalService';
import { getAnalytics, getLogs } from '../services/logService';
import {
  formatDate,
  formatGoalProgress,
  getSuggestionCards,
  goalTypeOptions
} from '../utils/appFormatters';

const initialGoalState = {
  type: 'calorie_target',
  title: '',
  targetValue: '',
  currentValue: '',
  unit: '',
  dueDate: '',
  notes: ''
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [range, setRange] = useState('weekly');
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState(initialGoalState);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async (selectedRange = range) => {
    setLoading(true);
    setError('');

    try {
      const [analyticsResponse, logsResponse, goalsResponse] = await Promise.all([
        getAnalytics(selectedRange),
        getLogs({ limit: 5 }),
        getGoals()
      ]);

      setAnalytics(analyticsResponse);
      setRecentLogs(logsResponse.logs);
      setGoals(goalsResponse.goals);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(range);
  }, [range]);

  const latestLog = recentLogs[0];
  const suggestionCards = useMemo(
    () => getSuggestionCards({ profile: user?.profile, latestLog }),
    [latestLog, user?.profile]
  );

  const handleGoalChange = (event) => {
    setGoalForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetGoalForm = () => {
    setGoalForm(initialGoalState);
    setEditingGoalId(null);
  };

  const handleGoalSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...goalForm,
      targetValue: Number(goalForm.targetValue),
      currentValue: Number(goalForm.currentValue || 0),
      dueDate: goalForm.dueDate || null
    };

    try {
      if (editingGoalId) {
        await updateGoal(editingGoalId, payload);
      } else {
        await createGoal(payload);
      }

      resetGoalForm();
      await loadDashboard(range);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save goal.');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal._id);
    setGoalForm({
      type: goal.type,
      title: goal.title,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : '',
      notes: goal.notes || ''
    });
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      await loadDashboard(range);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete goal.');
    }
  };

  const toggleGoalCompletion = async (goal) => {
    try {
      await updateGoal(goal._id, { isCompleted: !goal.isCompleted });
      await loadDashboard(range);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update goal status.');
    }
  };

  if (loading && !analytics) {
    return <div className="px-4 py-20 text-center text-muted">Loading dashboard...</div>;
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 pb-12">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-panel rounded-[2rem] p-8">
          <p className="hero-badge text-sm">Personal Snapshot</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold text-main">
            Stay on top of your health with daily signals that actually guide your routine.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Track calories, water, steps, movement, sleep, and your long-term goals in one place.
          </p>
        </div>

        <SectionCard
          subtitle="Lightweight AI-style tips based on your latest entries."
          title="Suggestions"
        >
          <div className="space-y-3">
            {suggestionCards.map((suggestion) => (
              <div
                className="rounded-2xl border border-teal-500/20 bg-teal-500/10 p-4 text-sm text-teal-100"
                key={suggestion}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {error ? (
        <div className="rounded-2xl px-4 py-3 text-sm" style={{ border: '1px solid rgba(248, 113, 113, 0.35)', background: 'rgba(248, 113, 113, 0.12)', color: '#fecaca' }}>
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          hint="Average for selected range"
          label="Calories"
          value={`${analytics?.averages?.caloriesIntake || 0} kcal`}
        />
        <StatCard
          hint="Average for selected range"
          label="Water"
          value={`${analytics?.averages?.waterIntakeLiters || 0} L`}
        />
        <StatCard
          hint="Average for selected range"
          label="Steps"
          value={`${analytics?.averages?.steps || 0}`}
        />
        <StatCard
          hint="Average for selected range"
          label="Sleep"
          value={`${analytics?.averages?.sleepHours || 0} hrs`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          action={
            <div className="flex gap-2">
              {['weekly', 'monthly'].map((value) => (
                <button
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    range === value ? 'btn-primary text-sm' : 'btn-secondary text-sm'
                  }`}
                  key={value}
                  onClick={() => setRange(value)}
                  type="button"
                >
                  {value === 'weekly' ? '7 days' : '30 days'}
                </button>
              ))}
            </div>
          }
          subtitle="Weekly and monthly health trends."
          title="Analytics"
        >
          {analytics ? <HealthTrendChart analytics={analytics} /> : null}
        </SectionCard>

        <SectionCard subtitle="Your latest entries at a glance." title="Recent Logs">
          {recentLogs.length ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  className="rounded-2xl p-4"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}
                  key={log._id}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-main">{formatDate(log.date)}</h3>
                    <span className="text-sm text-muted">{log.caloriesIntake} kcal</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted">
                    <p>Water: {log.waterIntakeLiters} L</p>
                    <p>Steps: {log.steps}</p>
                    <p>Exercise: {log.exerciseMinutes} min</p>
                    <p>Sleep: {log.sleepHours} hrs</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Add your first daily log to see trends and insights."
              title="No health logs yet"
            />
          )}
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          subtitle="Set weight, hydration, activity, or sleep targets."
          title={editingGoalId ? 'Update Goal' : 'Create Goal'}
        >
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleGoalSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-main">Goal type</span>
              <select
                className="input-shell rounded-2xl px-4 py-3"
                name="type"
                onChange={handleGoalChange}
                value={goalForm.type}
              >
                {goalTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <InputField
              label="Title"
              name="title"
              onChange={handleGoalChange}
              placeholder="Lose 4 kg over 8 weeks"
              required
              value={goalForm.title}
            />
            <InputField
              label="Target value"
              min="0"
              name="targetValue"
              onChange={handleGoalChange}
              required
              step="0.1"
              type="number"
              value={goalForm.targetValue}
            />
            <InputField
              label="Current value"
              min="0"
              name="currentValue"
              onChange={handleGoalChange}
              step="0.1"
              type="number"
              value={goalForm.currentValue}
            />
            <InputField
              label="Unit"
              name="unit"
              onChange={handleGoalChange}
              placeholder="kg, liters, steps"
              required
              value={goalForm.unit}
            />
            <InputField
              label="Due date"
              name="dueDate"
              onChange={handleGoalChange}
              type="date"
              value={goalForm.dueDate}
            />
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-main">Notes</span>
              <textarea
                className="input-shell min-h-24 w-full rounded-2xl px-4 py-3"
                name="notes"
                onChange={handleGoalChange}
                placeholder="Optional notes to keep the goal actionable."
                value={goalForm.notes}
              />
            </label>
            <div className="flex gap-3 md:col-span-2">
              <button
                className="btn-primary rounded-2xl px-4 py-3 font-semibold"
                type="submit"
              >
                {editingGoalId ? 'Save changes' : 'Add goal'}
              </button>
              {editingGoalId ? (
                <button
                  className="btn-secondary rounded-2xl px-4 py-3 font-semibold"
                  onClick={resetGoalForm}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard subtitle="Track progress toward the outcomes that matter." title="Goal Tracking">
          {goals.length ? (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = formatGoalProgress(goal);

                return (
                  <div
                    className="rounded-3xl p-5"
                    key={goal._id}
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-main">{goal.title}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              goal.isCompleted
                                ? 'bg-teal-500/20 text-teal-100'
                                : 'text-muted'
                            }`}
                            style={!goal.isCompleted ? { background: 'var(--surface)' } : undefined}
                          >
                            {goal.isCompleted ? 'Completed' : 'Active'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                          {goal.dueDate ? ` • due ${formatDate(goal.dueDate)}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary rounded-full px-3 py-2 text-sm"
                          onClick={() => handleEditGoal(goal)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-secondary rounded-full px-3 py-2 text-sm"
                          onClick={() => toggleGoalCompletion(goal)}
                          type="button"
                        >
                          {goal.isCompleted ? 'Reopen' : 'Complete'}
                        </button>
                        <button
                          className="btn-danger rounded-full px-3 py-2 text-sm font-semibold"
                          onClick={() => handleDeleteGoal(goal._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: 'rgba(148, 163, 184, 0.18)' }}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-orange-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {goal.notes ? <p className="mt-3 text-sm text-muted">{goal.notes}</p> : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              description="Create your first goal to track progress over time."
              title="No goals yet"
            />
          )}
        </SectionCard>
      </section>
    </main>
  );
};

export default DashboardPage;

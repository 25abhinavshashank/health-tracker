export const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

export const formatGoalProgress = (goal) => {
  if (!goal.targetValue) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(((goal.currentValue || 0) / goal.targetValue) * 100)
  );
};

export const getSuggestionCards = ({ profile, latestLog }) => {
  const suggestions = [];

  if (!latestLog) {
    return [
      'Log today’s meals, water, movement, and sleep to unlock more personalized guidance.'
    ];
  }

  if (latestLog.waterIntakeLiters < 2.5) {
    suggestions.push('Hydration is a little low. Add one more bottle of water this evening.');
  }

  if (latestLog.sleepHours < 7) {
    suggestions.push('Sleep dipped below 7 hours. A consistent bedtime could improve recovery.');
  }

  if (latestLog.steps < 8000) {
    suggestions.push('Movement is below your daily target. A short walk after meals can close the gap.');
  }

  if (profile?.goalSummary) {
    suggestions.push(`Keep your focus on: ${profile.goalSummary}`);
  }

  return suggestions.slice(0, 3);
};

export const goalTypeOptions = [
  { value: 'weight_loss', label: 'Weight loss' },
  { value: 'weight_gain', label: 'Weight gain' },
  { value: 'maintenance', label: 'Weight maintenance' },
  { value: 'calorie_target', label: 'Calorie target' },
  { value: 'water_target', label: 'Water target' },
  { value: 'sleep_target', label: 'Sleep target' },
  { value: 'steps_target', label: 'Steps target' },
  { value: 'exercise_target', label: 'Exercise target' }
];

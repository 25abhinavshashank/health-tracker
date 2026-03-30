export const sampleGoals = [
  {
    type: 'weight_loss',
    title: 'Lose 4 kg over 8 weeks',
    targetValue: 4,
    currentValue: 1.2,
    unit: 'kg',
    notes: 'Focus on a consistent calorie deficit and evening walks.',
    isCompleted: false
  },
  {
    type: 'water_target',
    title: 'Drink 3 liters of water daily',
    targetValue: 3,
    currentValue: 2.4,
    unit: 'liters',
    notes: 'Carry a bottle during work hours.',
    isCompleted: false
  },
  {
    type: 'steps_target',
    title: 'Average 10,000 steps per day',
    targetValue: 10000,
    currentValue: 8400,
    unit: 'steps',
    notes: 'Walk for 20 minutes after lunch.',
    isCompleted: false
  }
];

export const buildSampleLogs = (userId) => {
  const today = new Date();
  const logs = [];

  for (let offset = 0; offset < 21; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    date.setHours(0, 0, 0, 0);

    logs.push({
      user: userId,
      date,
      caloriesIntake: 1800 + ((offset % 5) * 90),
      waterIntakeLiters: Number((2.1 + ((offset % 4) * 0.25)).toFixed(1)),
      steps: 6500 + (offset % 6) * 900,
      exerciseMinutes: 25 + (offset % 4) * 10,
      sleepHours: Number((6.5 + ((offset % 5) * 0.4)).toFixed(1)),
      notes:
        offset % 3 === 0
          ? 'Felt energized after staying consistent with hydration.'
          : 'Regular workday with balanced meals and movement.'
    });
  }

  return logs;
};

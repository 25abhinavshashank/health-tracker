export const normalizeDate = (value) => {
  const date = value ? new Date(value) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const formatDateKey = (value) =>
  new Date(value).toISOString().slice(0, 10);

export const buildDateSeries = (days) => {
  const endDate = normalizeDate();
  const dates = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - index);
    dates.push(date);
  }

  return dates;
};

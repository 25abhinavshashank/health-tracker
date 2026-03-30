import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const HealthTrendChart = ({ analytics }) => {
  const palette =
    typeof window === 'undefined'
      ? {
          text: '#94a3b8',
          grid: 'rgba(148, 163, 184, 0.12)'
        }
      : {
          text:
            getComputedStyle(document.documentElement)
              .getPropertyValue('--muted')
              .trim() || '#94a3b8',
          grid:
            getComputedStyle(document.documentElement)
              .getPropertyValue('--border')
              .trim() || 'rgba(148, 163, 184, 0.12)'
        };

  const labels = analytics.series.map((entry) => entry.label);
  const data = {
    labels,
    datasets: [
      {
        label: 'Calories',
        data: analytics.series.map((entry) => entry.caloriesIntake),
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Water (L)',
        data: analytics.series.map((entry) => entry.waterIntakeLiters),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        tension: 0.35
      },
      {
        label: 'Sleep (hrs)',
        data: analytics.series.map((entry) => entry.sleepHours),
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.12)',
        tension: 0.35
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: palette.text
        }
      }
    },
    scales: {
      x: {
        ticks: { color: palette.text },
        grid: { color: palette.grid }
      },
      y: {
        ticks: { color: palette.text },
        grid: { color: palette.grid }
      }
    }
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default HealthTrendChart;

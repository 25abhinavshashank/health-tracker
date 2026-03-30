import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const hexToRgba = (hex, alpha) => {
  const normalized = String(hex).replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function AnalyticsChart({ series, metricKey, title, color }) {
  const labels = series.map((entry) => entry.label);
  const data = series.map((entry) => entry[metricKey]);
  const lineColor = color || '#0f172a';
  const fillColor = hexToRgba(lineColor, 0.15);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-500">Last {series.length} days</span>
      </div>

      <div className="mt-3">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: title,
                data,
                borderColor: lineColor,
                backgroundColor: fillColor,
                tension: 0.25,
                fill: true,
                pointRadius: 2
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { maxTicksLimit: 7 }
              },
              y: {
                grid: { color: 'rgba(15,23,42,0.08)' }
              }
            }
          }}
          height={220}
        />
      </div>
    </div>
  );
}


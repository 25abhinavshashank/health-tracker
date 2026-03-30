/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#e2e8f0',
        shell: '#f8fafc',
        brand: '#0f766e',
        accent: '#f97316'
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.45)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(15,118,110,0.18), transparent 28%), radial-gradient(circle at top right, rgba(249,115,22,0.16), transparent 24%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))'
      }
    }
  },
  plugins: []
};

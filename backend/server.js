import dotenv from 'dotenv';
import dns from 'dns';

import app from './app.js';
import connectDB from './config/db.js';

// On Windows it's common to have system env vars set; ensure local `.env` wins for dev.
dotenv.config({ override: true });

const configureDnsServers = () => {
  const raw = process.env.DNS_SERVERS;
  if (!raw) return;

  const servers = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
    console.log(`DNS servers set: ${servers.join(', ')}`);
  }
};

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  configureDnsServers();
  await connectDB();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

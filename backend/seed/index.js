import dotenv from 'dotenv';
import dns from 'dns';

import connectDB from '../config/db.js';
import Goal from '../models/Goal.js';
import HealthLog from '../models/HealthLog.js';
import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import { buildSampleLogs, sampleGoals } from './sampleData.js';

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

const seedDatabase = async () => {
  configureDnsServers();
  await connectDB();

  await Promise.all([
    RefreshToken.deleteMany({}),
    Goal.deleteMany({}),
    HealthLog.deleteMany({}),
    User.deleteMany({})
  ]);

  const demoUser = await User.create({
    fullName: 'Demo User',
    email: 'demo@healthtracker.com',
    password: 'Password123!',
    profile: {
      age: 29,
      weight: 74,
      height: 173,
      goalSummary: 'Improve consistency across nutrition, sleep, and activity.'
    }
  });

  await Goal.insertMany(
    sampleGoals.map((goal) => ({
      ...goal,
      user: demoUser._id
    }))
  );

  await HealthLog.insertMany(buildSampleLogs(demoUser._id));

  console.log('Seed data created successfully.');
  console.log('Demo credentials: demo@healthtracker.com / Password123!');
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});

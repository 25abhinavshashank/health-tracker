import dns from 'node:dns';

import mongoose from 'mongoose';

const configureDnsServers = () => {
  const configuredServers = (process.env.DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (!configuredServers.length) {
    return;
  }

  dns.setServers(configuredServers);
  console.log(`Using custom DNS servers: ${configuredServers.join(', ')}`);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured.');
  }

  configureDnsServers();

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    const hint =
      mongoUri.startsWith('mongodb+srv://')
        ? 'For MongoDB Atlas, ensure the cluster is running, your IP is allowed in Network Access, and if your network or proxy DNS is flaky set DNS_SERVERS=8.8.8.8,1.1.1.1.'
        : 'This app is configured for cloud MongoDB. Use a MongoDB Atlas connection string in MONGO_URI instead of a localhost URI.';

    throw new Error(`MongoDB connection failed: ${error.message}\n${hint}`);
  }
};

export default connectDB;

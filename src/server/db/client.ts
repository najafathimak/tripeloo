import { MongoClient } from 'mongodb';
import { env, assertEnv } from '@/server/config/env';

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  assertEnv();
  if (client) return client;

  const newClient = new MongoClient(env.mongodbUri, { maxPoolSize: 10 });
  await newClient.connect();
  client = newClient;
  return client;
}

export async function getDb() {
  const c = await getMongoClient();
  return c.db(env.mongodbDb);
}



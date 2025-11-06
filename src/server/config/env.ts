export const env = {
  mongodbUri: process.env.MONGODB_URI ?? '',
  mongodbDb: process.env.MONGODB_DB ?? 'tripeloo'
};

export function assertEnv() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set');
  }
}



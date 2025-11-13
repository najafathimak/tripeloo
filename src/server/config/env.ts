export const env = {
  mongodbUri: process.env.MONGODB_URI ?? '',
  mongodbDb: process.env.MONGODB_DB ?? 'tripeloo',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
};

export function assertEnv() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set');
  }
}



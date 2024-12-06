import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongoose = global as typeof globalThis & {
    mongoose: Promise<typeof mongoose>;
  };
  if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = mongoose.connect(uri);
  }
  clientPromise = globalWithMongoose.mongoose;
} else {
  clientPromise = mongoose.connect(uri);
}

export default clientPromise;


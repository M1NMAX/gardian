import { connect } from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || '';

if (MONGODB_URI === '') {
  throw new Error('Please define MONGODB_URI');
}

declare global {
  var mongoose: any;
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  console.log('🚀 Next.js Connected to MongoDb Database');
  return cached.conn;
};

export default dbConnect;

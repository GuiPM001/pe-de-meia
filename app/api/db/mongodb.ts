import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://GuiPM001:33211319@reboque.t5klc.mongodb.net/pe-de-meia"; //process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Por favor defina a variável MONGODB_URI no .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

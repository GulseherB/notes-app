/**
 * MongoDB bağlantı yöneticisi
 * MongoDB Atlas'a bağlantı kurar ve bağlantıyı cache'ler
 */
import mongoose from 'mongoose';

// MongoDB bağlantı URL'i
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Lütfen .env.local dosyasında MONGODB_URI değişkenini tanımlayın'
  );
}

/**
 * Global tip tanımı - development modda bağlantıyı cache'lemek için
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Global cache nesnesi
let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * MongoDB'ye bağlan
 * Bağlantı varsa mevcut bağlantıyı döndürür, yoksa yeni bağlantı oluşturur
 */
async function connectDB() {
  // Eğer bağlantı varsa, mevcut bağlantıyı döndür
  if (cached.conn) {
    return cached.conn;
  }

  // Eğer bağlantı promise'ı yoksa, yeni bir bağlantı oluştur
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

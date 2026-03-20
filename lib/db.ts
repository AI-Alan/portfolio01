import mongoose from 'mongoose'

const RAW_URI = process.env.MONGODB_URI!

// URL-encode the password so special characters like [ ] work without
// changing the .env file (the Node MongoDB driver is strict about this).
function encodedURI(uri: string): string {
  try {
    // Match: protocol://user:password@rest
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+?)@(.+)$/)
    if (!match) return uri
    const [, proto, user, pass, rest] = match
    return `${proto}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${rest}`
  } catch {
    return uri
  }
}

const MONGODB_URI = encodedURI(RAW_URI)
const MONGODB_DB = process.env.MONGODB_DB || 'portfolio'

if (!MONGODB_URI) {
  throw new Error(
    'Please define MONGODB_URI in your .env.local file.\n' +
    'Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/'
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.__mongoose ?? { conn: null, promise: null }
global.__mongoose = cached

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) return cached.conn
    cached.conn = null
    cached.promise = null
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: MONGODB_DB,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
      maxPoolSize: 10,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log(`✅ MongoDB connected → db: "${MONGODB_DB}"`)
        return m
      })
      .catch((err) => {
        cached.promise = null
        console.error('❌ MongoDB connection error:', err.message)
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

export default connectDB

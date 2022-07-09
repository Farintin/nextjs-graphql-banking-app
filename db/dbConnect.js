import mongoose from 'mongoose'



const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Define MONGODB_URI environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {}

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('### Database connected sucessfully ###')
      return mongoose
    })
  }
  cached.conn = await cached.promise
  
  return cached.conn
}



export default connectDB
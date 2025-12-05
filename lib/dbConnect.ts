// lib/dbConnect.ts
import mongoose from 'mongoose'

import fileSchema from '@/lib/entity/file/schema'
import userSchema from '@/features/user/schema'

if (!process.env.MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  )
}
const MONGO_URI = process.env.MONGO_URI

let cachedDb: mongoose.Connection | null = null

export default async function dbConnect() {
  // 1️⃣ تست اتصال دیتابیس
  const dbStart = Date.now()
  if (cachedDb == null) {
    const db = await mongoose.connect(MONGO_URI, {})
    cachedDb = db.connections[0]
  }
  const database_connection = Date.now() - dbStart

  if (database_connection > 100)
    console.log('🔴 اتصال دیتابیس کند است - Region را بررسی کنید')

  return cachedDb
}

// *** dont remove this function because it is used in dbConnect.ts
function registerSchemas() {
  // Register your schemas here
  fileSchema
  userSchema
}

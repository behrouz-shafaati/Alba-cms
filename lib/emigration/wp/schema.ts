import mongoose, { Schema, model } from 'mongoose'
import { EntityType, WpMigrationLog } from './interface'

const WpMigrationLogSchema = new Schema<WpMigrationLog>(
  {
    entityType: {
      type: String,
      enum: ['user', 'post', 'category', 'tag', 'comment', 'media'],
      required: true,
      index: true,
    },
    wpId: {
      type: Number,
      required: true,
      index: true,
    },
    mongoId: {
      type: Schema.Types.ObjectId,
      refPath: 'entityType', // داینامیک ref
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'skipped'],
      default: 'pending',
      index: true,
    },
    errorMessage: String,
    metadata: Schema.Types.Mixed,
    attempts: {
      type: Number,
      default: 0,
    },
    migratedAt: Date,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
// ====== ایندکس ترکیبی یکتا ======
// هر wpId برای هر entityType فقط یکبار
WpMigrationLogSchema.index({ entityType: 1, wpId: 1 }, { unique: true })

// ====== متدهای استاتیک ======
// WpMigrationLogSchema.statics = {
//   // بررسی آیا قبلاً منتقل شده
//   async isAlreadyMigrated(
//     entityType: EntityType,
//     wpId: number
//   ): Promise<boolean> {
//     const log = await this.findOne({ entityType, wpId, status: 'success' })
//     return !!log
//   },

//   // گرفتن MongoDB ID از روی WP ID
//   async getMongoId(
//     entityType: EntityType,
//     wpId: number
//   ): Promise<mongoose.Types.ObjectId | null> {
//     const log = await this.findOne({ entityType, wpId, status: 'success' })
//     return log?.mongoId || null
//   },

//   // ثبت موفقیت
//   async logSuccess(
//     entityType: EntityType,
//     wpId: number,
//     mongoId: mongoose.Types.ObjectId,
//     metadata?: Record<string, any>
//   ) {
//     return this.findOneAndUpdate(
//       { entityType, wpId },
//       {
//       $set: {
//         status: 'success',
//         mongoId,
//         metadata,
//         migratedAt: new Date(),
//         error: null,
//       },
//       $inc: { attempts: 1 },
//     },
//       { upsert: true, new: true }
//     )
//   },

//   // ثبت خطا
//   async logFailure(
//     entityType: EntityType,
//     wpId: number,
//     error: string,
//     metadata?: Record<string, any>
//   ) {
//     return this.findOneAndUpdate(
//       { entityType, wpId },
//       {
//       $set: {
//         status: 'failed',
//         error,
//         metadata,
//       },
//       $inc: { attempts: 1 },
//     },
//       { upsert: true, new: true }
//     )
//   },

//   // ثبت skip
// async logSkipped (
//   entityType: EntityType,
//   wpId: number,
//   reason: string,
//   existingMongoId?: mongoose.Types.ObjectId
// ): Promise<WpMigrationLog> {
//   return this.findOneAndUpdate(
//     { entityType, wpId },
//     {
//       $set: {
//         status: 'skipped',
//         mongoId: existingMongoId,
//         metadata: { reason },
//         migratedAt: new Date(),
//       },
//       $inc: { attempts: 1 },
//     },
//     { upsert: true, new: true }
//   )
// },

//   // آمار مهاجرت
//   async getStats(entityType?: EntityType) {
//     const match = entityType ? { entityType } : {}

//     return this.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: { entityType: '$entityType', status: '$status' },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $group: {
//           _id: '$_id.entityType',
//           statuses: {
//             $push: {
//               status: '$_id.status',
//               count: '$count',
//             },
//           },
//           total: { $sum: '$count' },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ])
//   },

// // لیست موارد ناموفق
// async getFailedItems  (
//   entityType: EntityType,
//   limit = 100
// ): Promise<IMigrationLog[]> {
//   return this.find({ entityType, status: 'failed' }).limit(limit).lean()
// },

// // پیدا کردن wpIdهایی که هنوز منتقل نشدند
// async getPendingWpIds  (
//   entityType: EntityType,
//   allWpIds: number[]
// ): Promise<number[]> {
//   const migrated = await this.find({
//     entityType,
//     wpId: { $in: allWpIds },
//     status: { $in: ['success', 'skipped'] },
//   }).select('wpId')

//   const migratedIds = new Set(migrated.map((m) => m.wpId))
//   return allWpIds.filter((id) => !migratedIds.has(id))
// },

// // ریست کردن موارد failed برای retry
// async resetFailed (entityType: EntityType): Promise<number> {
//   const result = await this.updateMany(
//     { entityType, status: 'failed' },
//     { $set: { status: 'pending', error: null } }
//   )
//   return result.modifiedCount
// }
// }

// ====== مدل ======
const MigrationLog =
  mongoose.models.WpMigrationLog ||
  mongoose.model<WpMigrationLog>('WpMigrationLog', WpMigrationLogSchema)
export default MigrationLog

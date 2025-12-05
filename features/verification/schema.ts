import mongoose, { Model, Schema } from 'mongoose'
import { IVerificationCode } from './interface'
const VerificationCodeSchema = new Schema<IVerificationCode>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    targetEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      sparse: true,
    },
    targetPhone: { type: String, trim: true, index: true, sparse: true },

    hashedCode: { type: String, required: true },
    salt: { type: String, required: true },
    codeLength: { type: Number, required: true, default: 6 },

    purpose: {
      type: String,
      required: true,
      enum: [
        'signup',
        'login',
        'password_reset',
        'email_change',
        'phone_change',
        'two_factor_auth',
        'other',
      ],
    },
    channel: {
      type: String,
      required: true,
      enum: ['sms', 'email', 'whatsapp', 'voice', 'other'],
    },

    used: { type: Boolean, default: false, index: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },

    expiresAt: { type: Date, required: true },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  }
)

/**
 * Indexes:
 * - TTL index on expiresAt (remove doc after expire + optional safety window)
 * - Composite index to quickly find active codes per email/phone/purpose
 */
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
// compound index: find active latest code for given target & purpose
VerificationCodeSchema.index(
  { targetEmail: 1, purpose: 1, used: 1, createdAt: -1 },
  { sparse: true }
)
VerificationCodeSchema.index(
  { targetPhone: 1, purpose: 1, used: 1, createdAt: -1 },
  { sparse: true }
)

const VerificationCode: Model<IVerificationCode> =
  mongoose.models.verificationCode ||
  mongoose.model<IVerificationCode>('verificationCode', VerificationCodeSchema)

export default VerificationCode

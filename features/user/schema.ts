import { hashPassword } from '@/lib/utils'
import mongoose, { Schema, model } from 'mongoose'
import { UserSchema } from '@/features/user/interface'

const TranslationsUserSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    about: { type: String, default: '' },
  },
  { _id: false }
)

const userSchema = new Schema<UserSchema>(
  {
    roles: { type: [String], required: true },
    mobile: {
      type: String,
      default: null, // می‌تونه null باشه. ممکنه کاربر با این موبال پاک شده باشد یا موبال خود را وریفای نکرده باشد
      trim: true,
    },
    mobileVerified: { type: Boolean, default: false },
    email: {
      type: String,
      default: null, // می‌تونه null باشه
      trim: true,
      lowercase: true,
    },
    userName: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    country: String,
    state: String,
    city: String,
    address: String,
    image: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    language: String,
    darkMode: Boolean,
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    translations: [TranslationsUserSchema],
  },
  { timestamps: true }
)

userSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  mobile: 'text',
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password)
  }
  next()
})

// فرض: hashPassword(password: string) => Promise<string>
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate()
    if (!update) return next()

    // مقدار ممکنه مستقیم در update.password باشه یا داخل update.$set.password
    const rawPassword = update.password ?? update.$set?.password
    if (!rawPassword) return next()

    const hashed = await hashPassword(rawPassword)

    // جایگزینی مقدار هَشد شده در همان ساختارِ آپدیت
    if (update.password) {
      update.password = hashed
    } else {
      update.$set = { ...(update.$set || {}), password: hashed }
    }

    this.setUpdate(update)
    next()
  } catch (err) {
    next(err)
  }
})

// برای اینکه null‌تکراری مجاز باشد
userSchema.index(
  { mobile: 1 },
  {
    unique: true,
    partialFilterExpression: {
      mobile: { $exists: true, $ne: null },
      deleted: false,
    },
  }
)

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null },
      deleted: false,
    },
  }
)

userSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  ret.name =
    ret.firstName && ret.lastName
      ? `${ret.firstName} ${ret.lastName}`
      : ret.email
  delete ret._id
  delete ret.__v
  // delete ret.password;
  delete ret.deleted
}

userSchema.set('toObject', {
  transform,
})

userSchema.set('toJSON', {
  transform,
})

export default mongoose.models?.user || model<UserSchema>('user', userSchema)

import mongoose, { model, Schema } from 'mongoose'
import { SettingsSchema } from './interface'

const InfoTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    site_title: { type: String, default: '' },
    site_introduction: { type: String, default: '' },
  },
  { _id: false }
)
const PageTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    homePageId: { type: Schema.Types.ObjectId, ref: 'page', default: null },
    termsPageId: { type: Schema.Types.ObjectId, ref: 'page', default: null },
    privacyPageId: { type: Schema.Types.ObjectId, ref: 'page', default: null },
  },
  { _id: false }
)
const UserSchema = new Schema(
  {
    defaultRoles: { type: [String] },
  },
  { _id: false }
)

const FarazsmsSchema = new Schema(
  {
    farazsms_apiKey: String,
    farazsms_verifyPatternCode: String,
    farazsms_from_number: String,
  },
  { _id: false }
)

const ADTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    banners: [
      {
        aspect: String,
        file: { type: Schema.Types.ObjectId, ref: 'file' },
      },
    ],
  },
  { _id: false }
)

const ADSchema = new Schema(
  {
    fallbackBehavior: {
      type: String,
      enum: ['inherit', 'random', 'default_banner', 'hide'],
    },
    targetUrl: String,
    translations: [ADTranslationSchema],
  },
  { _id: false }
)

const settingsSchema = new Schema<SettingsSchema>(
  {
    type: { type: String, default: 'site-settings', unique: true }, // مهم!
    infoTranslations: [InfoTranslationSchema],
    pageTranslations: [PageTranslationSchema],
    commentApprovalRequired: { type: Boolean, default: true },
    emailVerificationRequired: { type: Boolean, default: false },
    mobileVerificationRequired: { type: Boolean, default: false },
    site_url: { type: String, default: '' },
    favicon: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    mail_host: String,
    mail_port: String,
    mail_username: String,
    mail_password: String,
    desktopHeaderHeight: Number,
    tabletHeaderHeight: Number,
    mobileHeaderHeight: Number,
    farazsms: FarazsmsSchema,
    ad: ADSchema,
    theme: {
      primaryColor: String,
      backgroundColor: String,
      darkMode: Boolean,
    },
    integrations: {
      googleAnalyticsId: String,
    },
    user: UserSchema,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

settingsSchema.set('toObject', {
  transform,
})

settingsSchema.set('toJSON', {
  transform,
})

settingsSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next: any) {
    this.populate([
      { path: 'favicon' },
      { path: 'ad.translations.banners.file' },
      { path: 'pageTranslations.homePageId', select: ' slug' },
      { path: 'pageTranslations.termsPageId', select: ' slug' },
      { path: 'pageTranslations.privacyPageId', select: ' slug' },
    ])
    next()
  }
)

export default mongoose.models.settings ||
  model<SettingsSchema>('settings', settingsSchema)

import fileCtrl from '@/lib/entity/file/controller'
import { ImageMigrationResult } from '../tiptap-types'
const ObjectId = require('bson-objectid')

/**
 * کلاس کمکی برای انتقال تصاویر از وردپرس به Alba CMS
 * این کلاس تصویر را از URL وردپرس دانلود کرده و
 * یک File object برمی‌گرداند که می‌توانید به API آپلود بدهید
 */
export class WPImageMigrationHelper implements ImageMigrationHelper {
  private uploadEndpoint: string
  private authHeaders: Record<string, string>

  constructor(config?: {
    uploadEndpoint?: string // آدرس API آپلود Alba
    authHeaders?: Record<string, string>
  }) {
    this.uploadEndpoint = config?.uploadEndpoint || ''
    this.authHeaders = config?.authHeaders || {}
  }

  /**
   * دانلود تصویر از URL و تبدیل به File
   */
  async downloadImageAsFile(imageUrl: string): Promise<File | null> {
    try {
      const response = await fetch(imageUrl)

      if (!response.ok) {
        console.error(`Failed to download image: ${imageUrl}`)
        return null
      }

      const blob = await response.blob()

      // استخراج نام فایل از URL
      const urlParts = imageUrl.split('/')
      let fileName = urlParts[urlParts.length - 1]

      // حذف query string اگر وجود دارد
      fileName = fileName.split('?')[0]

      // decode کردن نام فایل (برای نام‌های فارسی)
      fileName = decodeURIComponent(fileName)

      // تعیین MIME type
      const mimeType = blob.type || this.getMimeTypeFromExtension(fileName)

      return new File([blob], fileName, { type: mimeType })
    } catch (error) {
      console.error(`Error downloading image: ${imageUrl}`, error)
      return null
    }
  }

  /**
   * تعیین MIME type از پسوند فایل
   */
  private getMimeTypeFromExtension(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      bmp: 'image/bmp',
    }
    return mimeTypes[ext || ''] || 'image/jpeg'
  }

  /**
   * ساخت FormData برای آپلود
   */
  createUploadFormData(
    file: File,
    additionalData?: Record<string, string>
  ): FormData {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return formData
  }

  /**
   * متد اصلی برای مهاجرت تصویر
   * این متد فقط File را برمی‌گرداند - آپلود را شما انجام دهید
   */
  async migrateImage(
    wpImageUrl: string,
    details: { alt: string; title: string }
  ): Promise<ImageMigrationResult | null> {
    // در این پیاده‌سازی، فقط File را آماده می‌کنیم
    // شما باید logic آپلود خودتان را اضافه کنید

    console.log(`📥 #23984s76 Downloaded image: ${wpImageUrl})`)
    const file = await this.downloadImageAsFile(wpImageUrl)

    if (!file) {
      return null
    }
    console.log(
      `📥 #2398476 Downloaded image: ${file.name} (${file.size} bytes)`
    )
    // TODO: اینجا باید API آپلود خودتان را call کنید
    const uploadResult = await this.uploadToAlba(file, details)
    return uploadResult
  }

  /**
   * متد کمکی برای آپلود به Alba (نمونه)
   * این را بر اساس API خودتان پیاده‌سازی کنید
   */
  async uploadToAlba(
    file: File,
    details?: { alt: string; title: string }
  ): Promise<ImageMigrationResult | null> {
    try {
      const id = ObjectId().toString()
      const formData = this.createUploadFormData(file, {
        alt: details?.alt || '',
        title: details?.alt || '',
        id,
      })
      console.log('#2349087 alt of image:', details?.alt)
      const response = await fileCtrl.saveFile(formData)

      if (!response) {
        throw new Error(`Upload failed: ${response?.statusText}`)
      }

      return {
        id: String(response?.id),
        srcMedium: response?.srcMedium,
      }
    } catch (error) {
      console.error('Upload to Alba failed:', error)
      return null
    }
  }
}

/**
 * نسخه ساده‌تر که فقط File برمی‌گرداند
 * برای استفاده در جایی که خودتان آپلود را مدیریت می‌کنید
 */
export async function downloadWPImageAsFile(
  imageUrl: string
): Promise<File | null> {
  const helper = new WPImageMigrationHelper({ uploadEndpoint: '' })
  return helper.downloadImageAsFile(imageUrl)
}

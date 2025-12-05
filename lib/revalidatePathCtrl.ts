import categoryCtrl from '@/features/category/controller'
import pageCtrl from '@/features/page/controller'
import postCtrl from '@/features/post/controller'

import fs from 'fs'
import path from 'path'

export type RevalidatePathProp = {
  feature:
    | 'category'
    | 'post'
    | 'postComment'
    | 'page'
    | 'template'
    | 'templatePart'
    | 'menu'
    | 'settings'
    | 'tag'
    | 'city'
    | 'country'
    | 'province'
    | 'shippingAddress'
    | 'user'
    | 'campaign'
    | 'form'
    | 'formSubmission'
  slug?: string | string[]
}

class controller {
  async getAllPagesPaths() {
    return (await pageCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getAllPostsPaths() {
    return (await postCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getBlogPath() {
    return ['/blog']
  }

  async getAllCategoriessPaths() {
    return (await categoryCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getAllPaths() {
    return [
      '/',
      ...(await this.getAllPagesPaths()),
      ...(await this.getAllPostsPaths()),
      ...(await this.getAllCategoriessPaths()), //category change to daynamic page
      ...(await this.getBlogPath()),
    ]
  }

  async getAllPathesNeedRevalidate(
    revalidate: RevalidatePathProp
  ): Promise<string[]> {
    if (!revalidate) return []

    let pathes = []
    const { feature, slug } = revalidate

    if (Array.isArray(slug)) {
      for (const p of slug) {
        if (typeof p === 'string' && p.trim() !== '') {
          pathes.push(encodeURI(p))
        }
      }
    } else if (typeof slug === 'string' && slug.trim() !== '') {
      pathes.push(encodeURI(slug))
    }

    let finalPathes: string[] = []

    switch (feature) {
      case 'post':
      case 'menu':
      case 'category':
      case 'template':
      case 'templatePart':
      case 'form':
      case 'settings': {
        finalPathes = [...(await this.getAllPaths()), ...pathes]
        break
      }
      case 'page':
      case 'postComment':
      case 'formSubmission':
        finalPathes = [...pathes]
        break
      case 'campaign':
      case 'tag':
      case 'city':
      case 'country':
      case 'province':
      case 'shippingAddress':
      case 'user':
        break
    }

    // finalPathes = finalPathes.map((p) => decodeURI(p)) // اگر این دیکد انجام شود تولید مجدد صفحه انجام نمی شود

    // -------------------------------------------------
    // 🔥 ذخیره لاگ در فایل root/revalidate-log.txt
    // -------------------------------------------------

    const filePath = path.join(process.cwd(), 'revalidate-log.txt')

    const logData = {
      timestamp: new Date().toISOString(), // زمان دقیق
      feature,
      slugsReceived: slug,
      finalPathes,
    }

    const logLine = JSON.stringify(logData, null, 2) + '\n\n'

    // appendFile غیر همزمان و بدون بلاک کردن Node
    fs.appendFile(filePath, logLine, (err) => {
      if (err) console.error('⚠ Error writing log:', err)
    })

    return finalPathes
  }
}

const revalidatePathCtrl = new controller()
export default revalidatePathCtrl

'use server'

import { State } from '@/types'
import { z } from 'zod'
import wpEmigrationCtrl from './controller'
import { createUserMigration } from './users/migrate-users'

const FormSchema = z.object({
  host: z.string({}).min(1, { message: 'لطفا هاست را وارد کنید.' }),
  port: z.string({}).nullable(),
  user: z.string({}).nullable(),
  password: z.string({}).nullable(),
  database: z.string({}).nullable(),
  tablePrefix: z.string({}).nullable(),
})

export async function testConnectionAction(
  prevState: State,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
  }

  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  try {
    // const user = (await getSession())?.user as User
    // await can(user.roles, 'tag.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const {
      success: testConnectionSuccess,
      reportedHost,
      recentPosts,
    } = await wpEmigrationCtrl.testConnection({
      host: validatedFields.data.host,
      port: Number(validatedFields.data.port) || 3306,
      user: validatedFields.data.user,
      password: validatedFields.data.password,
      database: validatedFields.data.database,
      tablePrefix: validatedFields.data.tablePrefix,
    })
    console.log('!testConnectionAction validatedFields:', validatedFields)

    return {
      testConnectionSuccess,
      status: 200,
      message: testConnectionSuccess
        ? 'اتصال با موفقیت تست شد'
        : 'اتصال ناموفق بود',
      values,
      reportedHost,
      recentPosts,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      console.log('!s23s4d5:', error)
      return {
        testConnectionSuccess: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }

    // Handle database error
    if (error instanceof z.ZodError) {
      console.log('!23s4d5:', error)
      return {
        testConnectionSuccess: false,
        errors: error.flatten().fieldErrors,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!23s45:', error)
    return {
      testConnectionSuccess: false,
      message: 'خطای پایگاه داده: تست اتصال ناموفق بود.',
      values,
    }
  }
}

export async function startEmigrationAction(
  prevState: State,
  formData: FormData
) {
  const rawValues = Object.fromEntries(formData)
  const values = {
    ...rawValues,
  }

  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  try {
    // const user = (await getSession())?.user as User
    // await can(user.roles, 'tag.create')
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'لطفا فیلدهای لازم را پر کنید.',
        values,
      }
    }

    const dbConnectionInfo = {
      host: validatedFields.data.host,
      port: Number(validatedFields.data.port) || 3306,
      user: validatedFields.data.user,
      password: validatedFields.data.password,
      database: validatedFields.data.database,
      tablePrefix: validatedFields.data.tablePrefix,
    }

    const result = await startUserMigration({ dbConnectionInfo })
    console.log('!testConnectionAction validatedFields:', validatedFields)
    console.log('UserMigration result:', result)

    return {
      emigrationSuccess: true,
      status: 200,
      message: true ? 'اتصال با موفقیت تست شد' : 'اتصال ناموفق بود',
      values,
      ...result,
    }
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return {
        emigrationSuccess: false,
        status: 403,
        message: 'شما اجازه انجام این کار را ندارید',
        values,
      }
    }

    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        emigrationSuccess: false,
        errors: error.flatten().fieldErrors,
      }
    }
    if (process.env.NODE_ENV === 'development') throw error
    console.log('!2345:', error)
    return {
      emigrationSuccess: false,
      message: 'خطای پایگاه داده: تست اتصال ناموفق بود.',
      values,
    }
  }
}

// limit تعداد کاربران برای مهاجرت (اختیاری)
// dryRun فقط شبیه‌سازی کند بدون ذخیره‌سازی
export async function startUserMigration({
  options,
  dbConnectionInfo,
}: {
  options?: { limit?: number; dryRun?: boolean }
  dbConnectionInfo: any
}) {
  const migration = await createUserMigration({
    dbConnectionInfo,
    options: { batchSize: 50, dryRun: options?.dryRun || false, verbose: true },
  })

  const stats = await migration.migrateAll({
    limit: options?.limit,
  })

  return stats
}

export async function getMigrationStats({
  dbConnectionInfo,
}: {
  dbConnectionInfo: any
}) {
  const migration = await createUserMigration({ dbConnectionInfo })
  return migration.getStats()
}

export async function retryFailedUsers({
  dbConnectionInfo,
}: {
  dbConnectionInfo: any
}) {
  const migration = await createUserMigration({ dbConnectionInfo })
  return migration.migrateAll({ onlyFailed: true })
}

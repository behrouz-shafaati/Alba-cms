'use server'

import { z } from 'zod'
import Ctrl from '@/features/province/controller'
import { redirect } from 'next/navigation'
import { Province } from './interface'
import { State } from '@/types'
import revalidatePathCtrl from '@/lib/revalidatePathCtrl'
import { revalidatePath } from 'next/cache'

const FormSchema = z.object({
  title: z.string({}).min(1, { message: 'لطفا عنوان را وارد کنید.' }),
  parentId: z.string({}).nullable(),
  description: z.string({}),
})

/**
 * Creates a  with the given form data.
 *
 * @param prevState - The previous state.
 * @param formData - The form data.
 * @returns An object with errors and a message if there are any, or redirects to the  dashboard.
 */
export async function createProvince(prevState: State, formData: FormData) {
  // Validate form fields
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    }
  }

  validatedFields.data.parentId =
    validatedFields.data.parentId == '' ? null : validatedFields.data.parentId

  try {
    // Create the
    await Ctrl.create({ params: validatedFields.data })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'province',
      slug: [`/dashboard/provinces`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    // Handle database error
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
      }
    }
    return {
      message: 'خطای پایگاه داده: ایجاد دسته ناموفق بود.',
    }
  }
  redirect('/dashboard/provinces')
}

export async function updateProvince(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    }
  }
  try {
    await Ctrl.findOneAndUpdate({
      filters: id,
      params: validatedFields.data,
    })
    const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
      feature: 'province',
      slug: [`/dashboard/provinces`],
    })

    for (const slug of pathes) {
      // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
      revalidatePath(slug)
    }
  } catch (error) {
    return { message: 'خطای پایگاه داده: بروزرسانی دسته ناموفق بود.' }
  }
  redirect('/dashboard/provinces')
}

export async function deleteProvince(id: string) {
  try {
    await Ctrl.delete({ filters: [id] })
  } catch (error) {
    return { message: 'خطای پایگاه داده: حذف دسته ناموفق بود' }
  }
  await Ctrl.delete({ filters: [id] })
  const pathes = await revalidatePathCtrl.getAllPathesNeedRevalidate({
    feature: 'province',
    slug: [`/dashboard/provinces`],
  })

  for (const slug of pathes) {
    // این تابع باید یا در همین فایل سرور اکشن یا از طریق api فراخوانی شود. پس محلش نباید تغییر کند.
    revalidatePath(slug)
  }
}

export async function getProvincesAsOption() {
  return Ctrl.getProvincesAsOption()
}

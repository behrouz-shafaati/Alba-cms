export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // فقط سمت سرور اجرا میشه
    await import('@/features/category/controller')
    await import('@/features/tag/controller')
  }
}

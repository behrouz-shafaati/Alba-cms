import mysql from 'mysql2/promise'

// ====== تنظیمات اتصال ======
export interface WPConnectionConfig {
  host: string
  port?: number
  user: string
  password: string
  database: string
  tablePrefix?: string // پیش‌فرض: wp_
}

// ====== کلاس اتصال ======
export class WPDatabase {
  private connection: mysql.Connection | null = null
  private config: WPConnectionConfig
  private prefix: string

  constructor(config: WPConnectionConfig) {
    this.config = config
    this.prefix = config.tablePrefix || 'wp_'
  }

  getPrefix(): string {
    return this.prefix
  }

  // ====== اتصال ======
  async connect(): Promise<void> {
    console.log('🔌 در حال اتصال به دیتابیس وردپرس...')

    this.connection = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port || 3306,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      charset: 'utf8mb4',
    })

    console.log('✅ اتصال برقرار شد')
  }

  // ====== قطع اتصال ======
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
      console.log('🔌 اتصال بسته شد')
    }
  }

  // ====== اجرای کوئری ======
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.connection) {
      throw new Error('ابتدا باید connect() را صدا بزنید')
    }

    const [rows] = await this.connection.execute(sql, params)
    return rows as T[]
  }

  // ====== نام جدول با پیشوند ======
  table(name: string): string {
    return `${this.prefix}${name}`
  }

  // ====== تست اتصال ======
  async testConnection(): Promise<boolean> {
    let reportedHost: any = {}
    try {
      const result = await this.query<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${this.table(
          'posts'
        )} WHERE post_type = 'post'`
      )
      reportedHost['posts'] = result[0].count
      console.log(`📊 تعداد پست‌ها: ${result[0].count}`)

      const users = await this.query<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${this.table('users')}`
      )
      reportedHost['users'] = users[0].count
      console.log(`👥 تعداد کاربران: ${users[0].count}`)

      const terms = await this.query<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${this.table('terms')}`
      )
      reportedHost['terms'] = terms[0].count
      console.log(`🏷️  تعداد دسته‌ها و تگ‌ها: ${terms[0].count}`)

      return true
    } catch (error) {
      console.error('❌ خطا در تست اتصال:', error)
      return false
    }
  }

  // ====== آمار کلی ======
  async getStats(): Promise<void> {
    let reportedHost: any = {}
    console.log('\n📊 آمار دیتابیس وردپرس:')
    console.log('─'.repeat(40))

    // پست‌ها
    const posts = await this.query(`
      SELECT post_status, COUNT(*) as count 
      FROM ${this.table('posts')} 
      WHERE post_type = 'post'
      GROUP BY post_status
    `)
    console.log('\n📄 پست‌ها:')
    posts.forEach((p: any) => {
      reportedHost[p.post_status] = p.count
      console.log(`   ${p.post_status}: ${p.count}`)
    })

    // کاربران
    const users = await this.query(`
      SELECT COUNT(*) as count FROM ${this.table('users')}
    `)
    reportedHost['users'] = users[0].count
    console.log(`\n👥 کاربران: ${users[0].count}`)

    // دسته‌بندی‌ها
    const categories = await this.query(`
      SELECT COUNT(*) as count 
      FROM ${this.table('term_taxonomy')} 
      WHERE taxonomy = 'category'
    `)
    reportedHost['categories'] = categories[0].count
    console.log(`\n📁 دسته‌بندی‌ها: ${categories[0].count}`)

    // برچسب‌ها
    const tags = await this.query(`
      SELECT COUNT(*) as count 
      FROM ${this.table('term_taxonomy')} 
      WHERE taxonomy = 'post_tag'
    `)
    reportedHost['tags'] = tags[0].count
    console.log(`\n🏷️  برچسب‌ها: ${tags[0].count}`)

    // نظرات
    const comments = await this.query(`
      SELECT comment_approved, COUNT(*) as count 
      FROM ${this.table('comments')}
      GROUP BY comment_approved
    `)
    console.log('\n💬 نظرات:')
    comments.forEach((c: any) => {
      const status =
        c.comment_approved === '1'
          ? 'تأیید شده'
          : c.comment_approved === '0'
          ? 'در انتظار'
          : c.comment_approved

      reportedHost[status] = c.count

      console.log(`   ${status}: ${c.count}`)
    })

    console.log('\n' + '─'.repeat(40))

    return reportedHost
  }
}

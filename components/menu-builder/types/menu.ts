export interface MenuItem {
  _id: string
  label: string
  url: string
  icon?: string
  subMenu?: MenuItem[] // فقط یکی مجاز است (ما در اجرا کنترل می‌کنیم)
}

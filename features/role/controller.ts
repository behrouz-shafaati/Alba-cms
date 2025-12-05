import { Role } from './interface'

class controller {
  getRoles(): Role[] {
    return [
      {
        title: 'مدیر کل',
        slug: 'super_admin',
        description:
          'این نقش بالاترین سطح دسترسی را دارد و کنترل کامل سایت را به مالک یا صاحبان سایت می‌دهد.',
        permissions: ['all'],
      },
      {
        title: 'مدیر',
        slug: 'admin',
        description:
          'این نقش امکان کنترل کامل سایت را دارد و می‌تواند همه چیز را مدیریت کند.',
        permissions: ['all'],
      },
      {
        title: 'مدیر فنی',
        slug: 'technical_admin',
        description:
          'مدیریت بخش فنی و ظاهر سایت شامل صفحات، قالب‌ها، منوها و تنظیمات سایت.',
        permissions: [
          'dashboard.view.any',

          'user.edit.own',
          'postComment.create',
          'page.view.any',
          'page.create',
          'page.edit.any',
          'page.publish.any',
          'page.delete.any',

          'template.view.any',
          'template.create',
          'template.edit.any',
          'template.publish.any',
          'template.delete.any',

          'menu.view.any',
          'menu.create',
          'menu.edit.any',
          'menu.publish.any',
          'menu.delete.any',

          'form.view.any',
          'form.create',
          'form.edit.any',
          'form.publish.any',

          'formSubmission.create',
          'formSubmission.view.any',

          'settings.view.any',
          'settings.moderate.any',
        ],
      },
      {
        title: 'ویرایشگر محتوا',
        slug: 'content_editor',
        description:
          'مدیریت کامل محتوای سایت شامل مطالب، دسته‌بندی‌ها، تگ‌ها و کامنت‌ها.',
        permissions: [
          'dashboard.view.any',

          'user.edit.own',
          'postComment.create',
          'post.view.any',
          'post.create',
          'post.edit.any',
          'post.publish.any',
          'post.delete.any',

          'category.view.any',
          'category.create',
          'category.edit.any',
          'category.publish.any',
          'category.delete.any',

          'tag.view.any',
          'tag.create',
          'tag.edit.any',
          'tag.publish.any',

          'postComment.moderate.any',

          'formSubmission.create',
        ],
      },
      {
        title: 'نویسنده',
        slug: 'author',
        description:
          'می‌تواند مطالب خود را ایجاد، ویرایش و منتشر کند. به مطالب دیگران دسترسی ندارد.',
        permissions: [
          'dashboard.view.any',

          'user.edit.own',
          'postComment.create',
          'post.view.own',
          'post.create',
          'post.edit.own',
          'post.publish.own',

          'formSubmission.create',
        ],
      },
      {
        title: 'مشارکت‌کننده',
        slug: 'contributor',
        description:
          'می‌تواند مطالب خود را ایجاد و ویرایش کند، اما نمی‌تواند آنها را منتشر یا حذف کند.',
        permissions: [
          'user.edit.own',
          'postComment.create',
          'post.view.own',
          'post.create',
          'post.edit.own',

          'formSubmission.create',
        ],
      },
      {
        title: 'مشترک',
        slug: 'subscriber',
        description:
          'می‌تواند وارد سایت شود و پروفایل خود را مشاهده و بروزرسانی کند، اما دسترسی مدیریتی ندارد.',
        permissions: [
          'user.edit.own',
          'postComment.create',
          'formSubmission.create',
        ],
      },
      {
        title: 'مشاهده‌کننده',
        slug: 'viewer',
        description:
          'این نقش فقط امکان مشاهده پنل و محتوا را دارد و هیچ دسترسی مدیریتی ندارد.',
        permissions: [
          'dashboard.view.any',
          'user.edit.own',
          'postComment.create',
          'postComment.view.any',
          'settings.view.any',
          'post.view.any',
          'user.view.any',
          'category.view.any',
          'tag.view.any',
          'menu.view.any',
          'page.view.any',
          'template.view.any',
          'formSubmission.create',
        ],
      },
      {
        title: 'میهمان',
        slug: 'guest',
        description: 'کاربری که لاگین نکرده',
        permissions: ['formSubmission.create', 'postComment.create'],
        shwoInSetUserRolesList: false,
      },
      {
        title: 'مدیر فروشگاه',
        slug: 'shop_manager',
        description:
          'کنترل کاملی بر بخش فروشگاه وب سایت شما دارند. آنها می توانند تمام تراکنش ها و سفارش ها را بررسی، ویرایش و کنترل کنند و هر محصولی را از جمله محصولاتی که توسط دیگران ایجاد شده اضافه، ویرایش، انتشار و حذف کنند. مدیر فروش دسترسی به تغییر تنظیمات سایت و اضافه کردن کاربر جدید را ندارند.',
        permissions: [],
      },
      {
        title: 'مدیر فروش',
        slug: 'sales_manager',
        description:
          'کنترل کاملی بر بخش محصولات وب سایت شما دارند. آنها می توانند هر محصولی را از جمله محصولاتی که توسط دیگران ایجاد شده اضافه، ویرایش، انتشار و حذف کنند. مدیر فروش دسترسی به تغییر تنظیمات سایت و اضافه کردن کاربر جدید را ندارند.',
        permissions: [],
      },
      {
        title: 'فروشنده',
        slug: 'seller',
        description:
          'می تواند محصولات خود را ایجاد و آنها را ویرایش و منتشر کند. آنها همچنین می توانند محصولات خود را حذف کنند. نقش فروشنده نمی تواند دسته بندی محصولات را ایجاد کنند و فقط می توانند از دسته بندی های موجود انتخاب کنند، اما می توانند برچسب ها را به محصول خود اضافه کنند. فروشنده گان می توانند نظرات حتی کسانی که در انتظار بررسی و تأیید هستند را مشاهده کنند ولی نمی توانند نظری را تأیید یا حذف کنند.    ',
        permissions: [],
      },
      {
        title: 'کمک فروشنده',
        slug: 'seller_assistance',
        description:
          'کمک فروشنده ها می توانند محصولات جدید را اضافه کنند و فقط محصولات خود را ویرایش کنند. اما نمی توانند محصولی را منتشر کنند، حتی محصولات خودشان را. هنگام افزودن محصولات، نمی توانند دسته های جدیدی ایجاد کنند و باید از دسته های موجود انتخاب کنند با این حال آنها می توانند برچسب ها را نیز به محصولات خود اضافه کنند.',
        permissions: [],
      },
    ]
  }
}

const roleCtrl = new controller()

export default roleCtrl

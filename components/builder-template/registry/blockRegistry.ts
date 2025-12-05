// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '@/lib/block/singletonBlockRegistry'
import { ContentBlockDef } from '../blocks/content_all'
import { ContentPostTitleBlockDef } from '../blocks/content_post_title'
import { ContentPostCoverBlockDef } from '../blocks/content_post_cover'
import { ContentPostMetadataBlockDef } from '../blocks/content_post_metadata'
import { ContentPostContentBlockDef } from '../blocks/content_post_content'
import { ContentPostTableContentBlockDef } from '../blocks/content_post_tablecontent'
import { ContentPostCommentsBlockDef } from '../blocks/content_post_comments'
import { ContentPostCommentFormBlockDef } from '../blocks/content_post_comment_form'
import { ContentPostBreadcrumbBlockDef } from '../blocks/content_post_breadcrumb'
import { ContentPostShareBlockDef } from '../blocks/content_post_share'
import { ContentPostTagsBlockDef } from '../blocks/content_post_tags'
import { ContentPostAuthorCardBlockDef } from '../blocks/content_post_author_card'
import { ContentPostCommentsHeaderBlockDef } from '../blocks/content_post_comments_header'
import { ContentCategoryDescriptionBlockDef } from '../blocks/content_category_description'

export const blockRegistry = {
  content_all: ContentBlockDef, // تمام محتوا
  content_post_title: ContentPostTitleBlockDef, // عنوان مطلب
  content_post_cover: ContentPostCoverBlockDef, // پوستر مطلب
  content_post_metadata: ContentPostMetadataBlockDef, // متادیتا مطلب
  content_post_content: ContentPostContentBlockDef, // متن مطلب
  content_post_tablecontent: ContentPostTableContentBlockDef, // فهرست مطالب
  content_post_comments: ContentPostCommentsBlockDef, //  دیدگاه‌ها
  content_post_comment_form: ContentPostCommentFormBlockDef, // فرم ارسال دیدگاه برای مطالب
  content_post_breadcrumb: ContentPostBreadcrumbBlockDef, // مسیر ناوبری مطلب
  content_post_share: ContentPostShareBlockDef, // دکمه‌های اشتراک‌گذاری مطلب
  content_post_tags: ContentPostTagsBlockDef, // برچسب‌های مطلب
  content_post_author_card: ContentPostAuthorCardBlockDef, // کارت نویسنده مطلب
  content_post_comments_header: ContentPostCommentsHeaderBlockDef, // هدر دیدگاه‌های مطلب
  content_category_description: ContentCategoryDescriptionBlockDef, // توضیحات دسته‌بندی

  // ...
}

// registerBlock(blockRegistry)

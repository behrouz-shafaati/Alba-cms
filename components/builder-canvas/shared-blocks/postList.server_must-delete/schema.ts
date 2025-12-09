export const PostListBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    countOfPosts: {
      type: 'number',
      title: 'تعداد مطالب',
      default: 8,
      minimum: 1,
    },
    listDesign: {
      type: 'string',
      title: 'طرح لیست',
      // enum: ['column', 'row', 'hero', 'spotlight'],
      oneOf: [
        { const: 'row', title: 'ردیفی' },
        { const: 'column', title: 'ستونی' },
        { const: 'heroVertical', title: 'قهرمان عمودی ' },
        { const: 'heroHorizontal', title: 'قهرمان افقی' },
        { const: 'spotlight', title: 'برجسته' },
      ],
      default: 'row',
    },
  },
  required: ['listDesign'],
  allOf: [
    {
      // حالت column / row (بدون تغییر)
      if: {
        properties: { listDesign: { enum: ['column', 'row'] } },
      },
      then: {
        properties: {
          cardDesign: {
            type: 'string',
            title: 'طرح کارت',
            oneOf: [
              { const: 'image-card', title: 'عمودی' },
              { const: 'overly-card', title: 'عنوان روی تصویر' },
              { const: 'horizontal-card', title: 'کارت افقی' },
              { const: 'horizontal-card-small', title: 'کارت افقی کوچک' },
            ],
            default: 'image-card',
          },
          showNewest: {
            type: 'boolean',
            title: 'نمایش تازه‌ها',
            default: true,
          },
          advertisingAfter: {
            type: 'number',
            title: 'تبلیغ پس از چند مطلب (aspect: 4/1)',
            default: 0,
            minimum: 0,
            description: `aspect: 4/1`,
          },
        },
        allOf: [
          {
            if: {
              properties: {
                cardDesign: { not: { const: 'horizontal-card-small' } },
              },
            },
            then: {
              properties: {
                showExcerpt: {
                  type: 'boolean',
                  title: 'نمایش گزیده',
                  default: true,
                },
              },
            },
          },
        ],
      },

      // ⭐⭐ حالت hero + spotlight (فقط نمایش showExcerpt) ⭐⭐
      else: {
        if: {
          properties: {
            listDesign: {
              enum: ['heroVertical', 'heroHorizontal', 'spotlight'],
            },
          },
        },
        then: {
          properties: {
            showExcerpt: {
              type: 'boolean',
              title: 'نمایش گزیده',
              default: true,
            },
          },
        },
        else: {
          properties: {},
        },
      },
    },
  ],
}

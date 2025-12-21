export const PostListBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    listDesign: {
      type: 'string',
      title: 'طرح لیست',
      oneOf: [
        { const: 'row', title: 'ردیفی' },
        { const: 'column', title: 'ستونی' },
        { const: 'heroVertical', title: 'قهرمان عمودی' },
        { const: 'heroHorizontal', title: 'قهرمان افقی' },
        { const: 'spotlight', title: 'برجسته' },
      ],
      default: 'row',
    },
  },
  required: ['listDesign'],

  allOf: [
    // 🔹 row / column
    {
      if: {
        properties: {
          listDesign: { enum: ['row', 'column'] },
        },
      },
      then: {
        properties: {
          countOfPosts: {
            type: 'number',
            title: 'تعداد مطالب',
            default: 5,
            minimum: 1,
          },
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
    },

    // 🔹 spotlight (فقط countOfPosts)
    {
      if: {
        properties: {
          listDesign: { const: 'spotlight' },
        },
      },
      then: {
        properties: {
          countOfPosts: {
            type: 'number',
            title: 'تعداد مطالب',
            default: 5,
            minimum: 1,
          },
          showExcerpt: {
            type: 'boolean',
            title: 'نمایش گزیده',
            default: true,
          },
        },
      },
    },

    // 🔹 hero
    {
      if: {
        properties: {
          listDesign: {
            enum: ['heroVertical', 'heroHorizontal'],
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
    },
  ],
}

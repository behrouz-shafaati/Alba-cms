export const BlogPostSliderBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    design: {
      type: 'string',
      title: 'طرح',
      enum: ['simple', 'parallax'],
      default: 'simple',
    },
    showExcerpt: {
      type: 'boolean',
      title: 'نمایش گزیده',
      default: true,
    },
    showMoreLink: {
      type: 'boolean',
      title: 'نمایش دکمه بیشتر',
      default: true,
    },
    moreLink: {
      type: 'string',
      title: 'لینک دکمه بیشتر',
      default: '',
    },
    autoplay: {
      type: 'boolean',
      title: 'پخش خودکار (Autoplay)',
      default: true,
    },
    autoplayDelay: {
      type: 'number',
      title: 'فاصله زمانی بین اسلایدها (ثانیه)',
      default: 8,
      minimum: 1,
    },
    loop: {
      type: 'boolean',
      title: 'چرخش بی‌نهایت (Loop)',
      default: true,
    },
    dragFree: {
      type: 'boolean',
      title: 'کشیدن آزادانه (drag Free)',
      default: true,
    },
    showArrows: {
      type: 'boolean',
      title: 'نمایش دکمه‌های ناوبری',
      default: true,
    },
    showDots: {
      type: 'boolean',
      title: 'نمایش نقطه‌های ناوبری',
      default: true,
    },
    rtl: {
      type: 'boolean',
      title: 'راست‌چین (RTL)',
      default: true,
    },
  },
  required: ['slidesToShow'],
}

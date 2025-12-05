export type Permission =
  | 'all'
  | 'dashboard.view.any'

  // ===== POST_COMMENT =====
  | 'postComment.view.any'
  | 'postComment.view.own'
  | 'postComment.create'
  | 'postComment.delete.any'
  | 'postComment.delete.own'
  | 'postComment.moderate.any'
  | 'postComment.moderate.own'

  // ===== SETTINS =====
  | 'settings.view.any'
  | 'settings.view.own'
  | 'settings.moderate.any'
  | 'settings.moderate.own'

  // ===== POST =====
  | 'post.view.any'
  | 'post.view.own'
  | 'post.create'
  | 'post.edit.any'
  | 'post.edit.own'
  | 'post.publish.any'
  | 'post.publish.own'
  | 'post.delete.any'
  | 'post.delete.own'

  // ===== USER =====
  | 'user.view.any'
  | 'user.view.own'
  | 'user.create'
  | 'user.edit.any'
  | 'user.edit.own'
  | 'user.delete.any'
  | 'user.delete.own'

  // ===== CATEGORY =====
  | 'category.view.any'
  | 'category.view.own'
  | 'category.create'
  | 'category.edit.any'
  | 'category.edit.own'
  | 'category.publish.any'
  | 'category.delete.any'
  | 'category.delete.own'

  // ===== TAG =====
  | 'tag.view.any'
  | 'tag.view.own'
  | 'tag.create'
  | 'tag.edit.any'
  | 'tag.edit.own'
  | 'tag.publish.any'
  | 'tag.publish.own'
  | 'tag.delete.any'
  | 'tag.delete.own'

  // ===== MENU =====
  | 'menu.view.any'
  | 'menu.view.own'
  | 'menu.create'
  | 'menu.edit.any'
  | 'menu.edit.own'
  | 'menu.publish.any'
  | 'menu.delete.any'
  | 'menu.delete.own'

  // ===== PAGE =====
  | 'page.view.any'
  | 'page.view.own'
  | 'page.create'
  | 'page.edit.any'
  | 'page.edit.own'
  | 'page.publish.any'
  | 'page.delete.any'
  | 'page.delete.own'

  // ===== TEMPLATE & TEMPLATE_PART =====
  | 'template.view.any'
  | 'template.view.own'
  | 'template.create'
  | 'template.edit.any'
  | 'template.edit.own'
  | 'template.publish.any'
  | 'template.delete.any'
  | 'template.delete.own'

  // ===== Campaign =====
  | 'campaign.view.any'
  | 'campaign.view.own'
  | 'campaign.create'
  | 'campaign.edit.any'
  | 'campaign.edit.own'
  | 'campaign.publish.any'
  | 'campaign.delete.any'
  | 'campaign.delete.own'

  // ===== Form =====
  | 'form.view.any'
  | 'form.view.own'
  | 'form.create'
  | 'form.edit.any'
  | 'form.edit.own'
  | 'form.publish.any'
  | 'form.delete.any'
  | 'form.delete.own'

  // ===== Form Submission =====
  | 'formSubmission.view.any'
  | 'formSubmission.view.own'
  | 'formSubmission.create'
  | 'formSubmission.edit.any'
  | 'formSubmission.edit.own'
  | 'formSubmission.publish.any'
  | 'formSubmission.delete.any'
  | 'formSubmission.delete.own'

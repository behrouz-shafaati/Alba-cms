'use server'

import { renderTiptapJsonToHtml } from '@/lib/renderTiptapToHtml'
import { TNode } from '../type'

type Props = {
  contentJson: string
}
export async function renderTiptapAction({ contentJson }: Props) {
  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode
  return renderTiptapJsonToHtml(doc)
}

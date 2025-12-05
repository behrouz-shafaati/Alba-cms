// lib/tiptap/mention.ts
import { searchUser } from '@/features/user/actions'
import Mention from '@tiptap/extension-mention'
import tippy, { Instance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

interface User {
  id: string
  userName: string
}

let popup: Instance[] = []

function renderPopup(props: any) {
  const dom = document.createElement('div')
  dom.className = ''

  props.items.forEach((item: User) => {
    const btn = document.createElement('button')
    btn.textContent = `${item.userName} (${item?.name ?? ''})`
    btn.className = ''
    btn.onclick = () =>
      props.command({ id: item.id, label: item?.name ?? item.userName })
    dom.appendChild(btn)
  })

  return dom
}

export const CustomMention = Mention.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      suggestion: {
        char: '@',
        startOfLine: false,
        items: async ({ query }) => {
          const userResult = await searchUser(query) // ✅ سرور اکشن

          console.log('#2345987 userResult:', userResult)
          return userResult?.data ?? []
        },
        render: () => {
          return {
            onStart: (props) => {
              const container = renderPopup(props)
              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: container,
                showOnCreate: true,
                interactive: true,
              })
            },
            onUpdate(props) {
              if (!popup[0]) return
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
              popup[0].setContent(renderPopup(props))
            },
            onExit() {
              popup.forEach((p) => p.destroy())
              popup = []
            },
          }
        },
      },
    }
  },
})

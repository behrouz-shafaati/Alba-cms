import { create } from 'zustand'
import { MenuItem } from '../types/menu'
import { generateObjectId } from '@/lib/utils/generateObjectId'

interface MenuStore {
  items: MenuItem[]
  addItem: () => void
  addChild: (parentId: string) => void
  deleteItem: (id: string) => void
  updateItem: (id: string, data: Partial<MenuItem>) => void
  moveItem: (
    sourceId: string,
    destinationId: string | null,
    level: number
  ) => void
  reorderItems: (sourceId: string, destinationId: string) => void
  setItems: (items: MenuItem[]) => void
  getJson: () => string
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  items: [],

  addItem: () => {
    const newItem: MenuItem = {
      _id: generateObjectId(),
      label: 'New Item',
      url: '#',
      subMenu: [],
    }
    set((state) => ({ items: [...state.items, newItem] }))
  },

  addChild: (parentId: string) => {
    set((state) => {
      const addChildRecursive = (items: MenuItem[]): MenuItem[] =>
        items.map((item) => {
          if (item._id === parentId) {
            return {
              ...item,
              subMenu: [
                ...(item.subMenu || []),
                {
                  _id: generateObjectId(),
                  label: 'Sub Item',
                  url: '#',
                },
              ],
            }
          }
          return {
            ...item,
            subMenu: item.subMenu ? addChildRecursive(item.subMenu) : [],
          }
        })

      return { items: addChildRecursive(state.items) }
    })
  },

  deleteItem: (id: string) => {
    const deleteRecursive = (items: MenuItem[]): MenuItem[] =>
      items
        .filter((item) => item._id !== id)
        .map((item) => ({
          ...item,
          subMenu: item.subMenu ? deleteRecursive(item.subMenu) : [],
        }))

    set((state) => ({ items: deleteRecursive(state.items) }))
  },

  updateItem: (id: string, data: Partial<MenuItem>) => {
    const updateRecursive = (items: MenuItem[]): MenuItem[] =>
      items.map((item) =>
        item._id === id
          ? { ...item, ...data }
          : {
              ...item,
              subMenu: item.subMenu ? updateRecursive(item.subMenu) : [],
            }
      )

    set((state) => ({ items: updateRecursive(state.items) }))
  },

  moveItem: (sourceId, destinationId, level) => {
    if (sourceId === destinationId) return

    const [sourceItem, updatedItems] = findAndRemove(get().items, sourceId)
    if (!sourceItem) return

    const insertInto = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item._id === destinationId) {
          return {
            ...item,
            subMenu: [...(item.subMenu || []), sourceItem],
          }
        }
        return {
          ...item,
          subMenu: item.subMenu ? insertInto(item.subMenu) : [],
        }
      })
    }

    if (destinationId) {
      set({ items: insertInto(updatedItems) })
    } else {
      set({ items: [...updatedItems, sourceItem] })
    }
  },

  reorderItems: (sourceId, destinationId) => {
    const reorderRecursive = (items: MenuItem[]): MenuItem[] => {
      const indexFrom = items.findIndex((i) => i._id === sourceId)
      const indexTo = items.findIndex((i) => i._id === destinationId)
      if (indexFrom === -1 || indexTo === -1) {
        return items.map((item) => ({
          ...item,
          subMenu: item.subMenu ? reorderRecursive(item.subMenu) : [],
        }))
      }
      const updated = [...items]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return updated
    }

    set((state) => ({ items: reorderRecursive(state.items) }))
  },

  setItems: (items: MenuItem[]) => set({ items }),

  getJson: () => JSON.stringify(get().items, null, 2),
}))

const findAndRemove = (
  items: MenuItem[],
  id: string
): [MenuItem | null, MenuItem[]] => {
  let removed: MenuItem | null = null

  const recursiveRemove = (list: MenuItem[]): MenuItem[] => {
    return list.reduce<MenuItem[]>((acc, item) => {
      if (item._id === id) {
        removed = item
        return acc
      }

      const [childRemoved, newChildren] = item.subMenu
        ? findAndRemove(item.subMenu, id)
        : [null, []]

      if (childRemoved) removed = childRemoved

      acc.push({
        ...item,
        subMenu: item.subMenu ? newChildren : undefined,
      })

      return acc
    }, [])
  }

  const newItems = recursiveRemove(items)
  return [removed, newItems]
}

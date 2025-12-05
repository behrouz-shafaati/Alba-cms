import {
  Menu as MenuType,
  MenuTranslationSchema,
} from '@/features/menu/interface'
import HorizontalMenu from './designs/Horizontal'
import VerticalMenu from './designs/Vertical'
import MenuPrefetch from './MenuPrefetch'

interface MainMenuProps {
  blockData: {
    content: { menuId: string }
    type: 'menu'
    settings: {}
  }
  widgetName: string
  menu: MenuType
}

function Menu({ blockData, widgetName, menu, ...props }: MainMenuProps) {
  menu.translations = menu?.translations || []

  const locale = 'fa'
  const translation: MenuTranslationSchema =
    menu?.translations?.find((t: MenuTranslationSchema) => t.lang === locale) ||
    menu?.translations[0] ||
    {}
  const items = translation.items
  const { settings } = blockData
  let selectedMenu
  switch (settings?.design) {
    case 'vertical':
      selectedMenu = <VerticalMenu items={items} {...props} />
      break
    default:
      selectedMenu = <HorizontalMenu items={items} {...props} />
      break
  }

  return (
    <>
      <MenuPrefetch items={items} />
      {selectedMenu}
    </>
  )
}

export default Menu

import MobileMenuList from '../mobile/MobileMenuList'

type Props = {
  items: any
}

export default function VerticalMenu({ items, ...props }: Props) {
  return (
    <nav {...props}>
      <MobileMenuList items={items} />
    </nav>
  )
}

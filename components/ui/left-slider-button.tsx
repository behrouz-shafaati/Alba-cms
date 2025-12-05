import { ChevronLeft } from 'lucide-react'
type Props = {
  scrollPrev: () => void
}
const LeftSliderButton = ({ scrollPrev }: Props) => {
  return (
    <button
      onClick={scrollPrev}
      className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition"
    >
      <ChevronLeft size={24} />
    </button>
  )
}

export default LeftSliderButton

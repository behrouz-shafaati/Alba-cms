export default function EmptyBlock(props: any) {
  const { widgetName, onClick, message, ...restProps } = props
  return (
    <div
      {...(onClick ? { onClick } : {})}
      className="block w-full h-full p-5 rounded bg-slate-100 dark:bg-slate-900"
    >
      {message ? message : `برای انجام تنظیمات ${widgetName} کلیک کنید`}
    </div>
  )
}

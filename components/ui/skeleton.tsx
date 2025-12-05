function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={`bg-accent animate-pulse ${className}`}
      {...props}
    />
  )
}

export { Skeleton }

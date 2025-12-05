interface HeadingProps {
  title: string
  description: string
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  ...props
}) => {
  return (
    <div {...props}>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

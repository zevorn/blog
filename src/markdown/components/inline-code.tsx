type InlineCodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export const InlineCode = (props: InlineCodeProps) => {
  return <code {...props} className='inline-code' />
}

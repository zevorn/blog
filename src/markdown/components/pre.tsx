type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export const pre = (props: PreProps) => {
  // 直接返回 pre，不使用额外的 div 包装器，避免样式不一致
  return <pre {...props} />
}

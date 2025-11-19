import React from 'react'

type InlineCodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export const InlineCode = (props: InlineCodeProps) => {
  // 清理 children 中的反引号
  const cleanChildren = React.Children.map(props.children, child => {
    if (typeof child === 'string') {
      // 移除字符串开头和结尾的反引号
      return child.replace(/^`+|`+$/g, '')
    }
    return child
  })

  return (
    <code {...props} className='inline-code'>
      {cleanChildren}
    </code>
  )
}

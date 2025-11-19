import rehypeShiki, { type RehypeShikiOptions } from '@shikijs/rehype'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  // transformerMetaHighlight,     // 移除：导致无语言类型代码块显示元数据
  // transformerMetaWordHighlight, // 移除：导致无语言类型代码块显示元数据
  transformerRemoveLineBreak,
} from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/twoslash'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeDefaultCodeLang } from 'rehype-default-code-lang'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MDX } from 'rsc-mdx'

import { CodeGroup, Alert, Details, Hello, pre, InlineCode } from './components'
import {
  remarkDirectiveContainer,
  rehypeGithubAlert,
  rehypeEnhanceInlineCode,
} from './plugins'

interface MarkdownProps {
  source: string
}

export async function Markdown(props: MarkdownProps) {
  const { source } = props
  return (
    <MDX
      source={source}
      useMDXComponents={() => ({
        CodeGroup,
        Alert,
        Details,
        Hello,
        pre,
        code: InlineCode,
      })}
      remarkPlugins={[
        remarkDirective,
        remarkDirectiveContainer,
        remarkGfm, // GitHub Flavored Markdown: 表格、删除线、任务列表等
        remarkBreaks, // 支持软换行（单个回车换行）
        remarkMath, // 支持数学公式（LaTeX 语法）
      ]}
      rehypePlugins={[
        rehypeGithubAlert, // GitHub 风格警告框
        rehypeSlug, // 为标题添加 ID
        rehypeAutolinkHeadings, // 标题自动链接
        rehypeEnhanceInlineCode, // 增强行内代码显示
        [
          rehypeDefaultCodeLang,
          {
            defaultLang: 'text',
          },
        ],
        [
          rehypeShiki,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            defaultColor: false,
            // 移除可能导致元数据渲染的 transformers
            transformers: [
              transformerNotationDiff(),
              transformerNotationHighlight(),
              transformerNotationFocus(),
              transformerNotationErrorLevel(),
              // transformerMetaHighlight(),      // 注释掉：可能导致元数据显示
              // transformerMetaWordHighlight(),  // 注释掉：可能导致元数据显示
              transformerRemoveLineBreak(),
              transformerTwoslash({
                explicitTrigger: true,
              }),
            ],
          } as RehypeShikiOptions,
        ],
        rehypeKatex, // 渲染数学公式（需要在 Shiki 之后）
      ]}
    />
  )
}

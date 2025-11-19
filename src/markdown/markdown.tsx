import rehypeShiki, { type RehypeShikiOptions } from '@shikijs/rehype'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerRemoveLineBreak,
} from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/twoslash'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeDefaultCodeLang } from 'rehype-default-code-lang'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
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
  rehypeEscapeSpecialChars,
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
        rehypeRaw, // 支持在 markdown 中使用原始 HTML
        [
          rehypeSanitize,
          {
            ...defaultSchema,
            // 扩展允许的标签和属性，避免过度清理
            tagNames: [
              ...(defaultSchema.tagNames || []),
              'math',
              'mi',
              'mo',
              'mn',
              'ms',
              'mtext',
            ],
            attributes: {
              ...defaultSchema.attributes,
              code: [
                ...(defaultSchema.attributes?.code || []),
                ['className', 'inline-code'],
              ],
              // 允许所有标签使用 class 和 style 属性
              '*': ['className', 'style', 'id'],
            },
          },
        ],
        rehypeGithubAlert, // GitHub 风格警告框
        rehypeSlug, // 为标题添加 ID
        rehypeAutolinkHeadings, // 标题自动链接
        rehypeEnhanceInlineCode, // 增强行内代码显示
        rehypeEscapeSpecialChars, // 处理特殊字符
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
              light: 'solarized-light',
              dark: 'dracula-soft',
            },
            transformers: [
              transformerNotationDiff(),
              transformerNotationHighlight(),
              transformerNotationFocus(),
              transformerNotationErrorLevel(),
              transformerMetaHighlight(),
              transformerMetaWordHighlight(),
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

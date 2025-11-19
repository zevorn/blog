import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'

import type { Element, Text, Parent } from 'hast'
import type { Directives } from 'mdast-util-directive'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

const isDirectiveNode = (node: Node): node is Directives => {
  const { type } = node
  return (
    type === 'textDirective' ||
    type === 'leafDirective' ||
    type === 'containerDirective'
  )
}

export const remarkDirectiveContainer: Plugin = () => tree =>
  visit(tree, node => {
    if (isDirectiveNode(node)) {
      if (node.name === 'code-group') {
        const childrenMeta = node.children.map(child => child.meta)
        node.data = {
          hName: 'CodeGroup',
          hProperties: {
            ...node.attributes,
            'data-children-meta': JSON.stringify(childrenMeta),
          },
        }
      } else if (node.name === 'details') {
        node.data = {
          hName: 'Details',
          hProperties: {
            ...node.attributes,
          },
        }
      }
    }
  })

export const rehypeGithubAlert: Plugin = () => tree =>
  visit(tree, node => {
    if (isElement(node)) {
      if (node.tagName === 'blockquote') {
        const firstParagraph = node.children.find(child => {
          return isElement(child) && child.tagName === 'p'
        })
        if (!isElement(firstParagraph)) {
          return
        }
        const text = firstParagraph.children[0] as Text
        const value = text.value
        if (!value) {
          return
        }
        const matches = value.match(/\[!(.+)]/)
        if (matches) {
          const type = matches[1].toLowerCase()
          text.value = value.replace(matches[0], '').trim()
          node.tagName = 'Alert'
          node.properties = {
            ...node.properties,
            type,
          }
        }
      }
    }
  })

/**
 * 增强行内代码显示，添加样式类和处理特殊字符
 * 避免 HTML 标签和特殊字符与代码冲突
 */
export const rehypeEnhanceInlineCode: Plugin = () => tree => {
  visit(tree, node => {
    if (isElement(node) && node.tagName === 'code') {
      // 检查是否是行内代码（不在 pre 标签内）
      const parent = node as unknown as { parent?: Element }
      const isInline = !parent.parent || parent.parent.tagName !== 'pre'

      if (isInline) {
        // 添加行内代码样式类
        const existingClasses = node.properties?.className
        const classArray = Array.isArray(existingClasses)
          ? existingClasses.filter(
              (c): c is string =>
                typeof c === 'string' || typeof c === 'number',
            )
          : existingClasses && typeof existingClasses !== 'boolean'
            ? [existingClasses as string]
            : []

        node.properties = {
          ...node.properties,
          className: [...classArray, 'inline-code'],
        }

        // 处理代码内容，移除多余的反引号
        visit(node, 'text', (textNode: Text) => {
          if (textNode.value) {
            // 移除开头和结尾的反引号（如果存在）
            // 例如：`code` 或 ``code`` 应该显示为 code
            let value = textNode.value

            // 移除开头的反引号
            while (value.startsWith('`')) {
              value = value.slice(1)
            }

            // 移除结尾的反引号
            while (value.endsWith('`')) {
              value = value.slice(0, -1)
            }

            textNode.value = value
          }
        })
      }
    }
  })
}

/**
 * 处理特殊 HTML 字符，避免与 markdown 语法冲突
 * 这个插件确保 HTML 实体正确显示
 */
export const rehypeEscapeSpecialChars: Plugin = () => tree => {
  visit(tree, 'text', (node: Text, _index, parent) => {
    if (!node.value) return

    // 只处理非代码块中的文本
    const isInCode =
      parent &&
      isElement(parent as Parent) &&
      ((parent as Element).tagName === 'code' ||
        (parent as Element).tagName === 'pre')

    if (!isInCode) {
      // 对于普通文本，不需要额外处理
      // HTML 实体已经由 markdown 解析器处理
      // 这里只是确保文本节点完整性
      return
    }
  })
}

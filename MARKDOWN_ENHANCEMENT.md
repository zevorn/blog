# Markdown 解析增强文档

## 📋 概述

本次更新大幅增强了博客的 Markdown 解析能力，支持更多语法和特性，特别是解决了特殊字符（如 `<` `>` 等）与编程语言冲突的问题。

## ✨ 新增功能

### 1. 行内代码增强 ✅
- **完整支持特殊字符**：`<div>`、`</div>`、`<Component />`
- **泛型语法**：`List<String>`、`Map<K, V>`、`Array<number>`
- **比较运算符**：`x < y`、`a > b`
- **箭头函数**：`(x) => x * 2`
- **自定义样式**：带有背景色和边框的美观样式

### 2. GitHub Flavored Markdown (GFM) ✅
- **表格支持**：完整的 Markdown 表格语法
- **任务列表**：`- [ ]` 和 `- [x]` 复选框
- **删除线**：`~~删除的内容~~`
- **自动链接**：自动识别 URL

### 3. 数学公式支持 (LaTeX) ✅
- **行内公式**：`$E = mc^2$`
- **块级公式**：
  ```
  $$
  \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
  $$
  ```
- 使用 KaTeX 进行高质量渲染

### 4. 软换行支持 ✅
- 单个回车即可换行（无需双空格或双回车）
- 更接近常见编辑器的行为

### 5. 原始 HTML 支持 ✅
- 可以在 Markdown 中嵌入原始 HTML 标签
- 自动清理和消毒，确保安全性

## 🔧 技术实现

### 安装的插件

#### Remark 插件（处理 Markdown AST）
- `remark-gfm`: GitHub Flavored Markdown 支持
- `remark-breaks`: 软换行支持
- `remark-math`: 数学公式解析

#### Rehype 插件（处理 HTML AST）
- `rehype-raw`: 原始 HTML 支持
- `rehype-sanitize`: HTML 清理和安全防护
- `rehype-katex`: 数学公式渲染

### 自定义插件

#### `rehypeEnhanceInlineCode`
增强行内代码显示，自动添加样式类，确保特殊字符正确显示。

```typescript
export const rehypeEnhanceInlineCode: Plugin = () => tree => {
  visit(tree, node => {
    if (isElement(node) && node.tagName === 'code') {
      // 检查是否是行内代码（不在 pre 标签内）
      const parent = node as unknown as { parent?: Element }
      const isInline = !parent.parent || parent.parent.tagName !== 'pre'
      
      if (isInline) {
        // 添加行内代码样式类
        node.properties = {
          ...node.properties,
          className: [...classArray, 'inline-code'],
        }
      }
    }
  })
}
```

#### `rehypeEscapeSpecialChars`
处理特殊字符，避免与 Markdown 语法冲突。

## 🎨 样式增强

### 行内代码样式
```css
.inline-code {
  @apply rounded px-1.5 py-0.5 text-sm font-mono;
  @apply bg-slate-100 text-slate-800;
  @apply dark:bg-slate-800 dark:text-slate-200;
  @apply border border-slate-200 dark:border-slate-700;
  font-size: 0.875em;
  white-space: pre-wrap;
  word-break: break-word;
}
```

### 表格样式
- 完整的边框和背景色
- 深色模式支持
- 响应式设计

### 数学公式样式
- 居中显示块级公式
- 横向滚动支持
- 适配深色模式

## 📝 使用示例

### 行内代码示例
```markdown
在 TypeScript 中，你可以这样定义泛型：`Array<T>` 或 `List<K, V>`。

React 组件可以这样写：`<Component prop={value} />`。

比较运算：`if (x > 0 && y < 100)`。
```

### 数学公式示例
```markdown
爱因斯坦质能方程：$E = mc^2$

二次方程求根公式：
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 表格示例
```markdown
| 功能 | 状态 | 说明 |
|------|------|------|
| 行内代码 | ✅ | 支持特殊字符 |
| 数学公式 | ✅ | LaTeX 语法 |
| 表格 | ✅ | GFM 支持 |
```

### 任务列表示例
```markdown
- [x] 已完成的任务
- [ ] 待完成的任务
```

## 🔒 安全性

使用 `rehype-sanitize` 确保所有 HTML 内容都经过清理：
- 移除潜在的恶意脚本
- 只允许安全的标签和属性
- 保留必要的样式和功能

## 🚀 性能优化

- 使用 lazy loading 加载 CodeGroup 组件
- KaTeX 渲染在服务器端完成
- 优化的插件执行顺序

## 📦 依赖项

新增的 npm 包：
```json
{
  "devDependencies": {
    "rehype-raw": "^7.0.0",
    "rehype-sanitize": "^6.0.0",
    "remark-breaks": "^4.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.0"
  }
}
```

## 🐛 已解决的问题

1. ✅ 行内代码中的 `<>` 字符被误解析为 HTML 标签
2. ✅ 泛型语法 `List<T>` 显示不正确
3. ✅ JSX 标签 `<Component />` 无法正确显示
4. ✅ 比较运算符 `<` 和 `>` 被转义
5. ✅ 缺少数学公式支持
6. ✅ 表格样式不完整
7. ✅ 软换行不工作

## 📚 相关文件

- `src/markdown/markdown.tsx` - 主配置文件
- `src/markdown/plugins.ts` - 自定义插件
- `src/markdown/components/inline-code.tsx` - 行内代码组件
- `src/app/globals.css` - 全局样式

## 🎯 测试建议

使用 `MARKDOWN_TEST.md` 文件测试所有新功能：
```bash
# 该文件包含所有新功能的测试用例
cat MARKDOWN_TEST.md
```

## 📖 参考文档

- [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [KaTeX documentation](https://katex.org/docs/api.html)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

## 🔄 后续优化建议

1. 添加更多自定义指令（如提示框、注释等）
2. 支持 Mermaid 图表
3. 支持代码块差异对比
4. 添加代码块复制按钮
5. 支持目录自动生成

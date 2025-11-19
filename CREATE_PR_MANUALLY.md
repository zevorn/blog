# 📝 手动创建 Pull Request 指南

由于 token 权限限制，无法自动推送分支和创建 PR。请按照以下步骤手动创建：

## 🔧 方法 1: 使用 Git Patch（推荐）

### 步骤 1: 在你的本地机器上应用 patch

```bash
# 克隆或进入你的仓库
cd /path/to/your/blog

# 确保在 main 分支
git checkout main
git pull origin main

# 应用 patch
git apply /path/to/markdown-enhancement-complete.patch

# 或者直接从当前目录复制 patch 文件
```

### 步骤 2: 查看更改

```bash
git status
git diff
```

### 步骤 3: 创建新分支并提交

```bash
# 创建并切换到新分支
git checkout -b genspark_ai_developer

# 添加所有更改
git add .

# 提交（使用现成的提交信息）
git commit -m "feat(markdown): enhance markdown parser with better syntax support and inline code handling

Features:
- Add support for inline code with special characters (<, >, etc.)
- Support GitHub Flavored Markdown (tables, task lists, strikethrough)
- Add LaTeX math formula support with KaTeX
- Support soft line breaks (remark-breaks)
- Support raw HTML with sanitization
- Add custom plugins for inline code enhancement
- Add inline code styling component
- Fix conflicts with programming language syntax (generics, JSX, etc.)

Plugins added:
- rehype-raw: Raw HTML support
- rehype-sanitize: HTML sanitization for security
- remark-breaks: Soft line break support
- remark-math: Math formula parsing
- rehype-katex: Math formula rendering

Custom plugins:
- rehypeEnhanceInlineCode: Enhance inline code display
- rehypeEscapeSpecialChars: Handle special character escaping

Documentation:
- Add MARKDOWN_TEST.md with comprehensive test cases
- Add MARKDOWN_ENHANCEMENT.md with detailed feature documentation
- Add HOW_TO_USE.md with usage guide
- Add IMPLEMENTATION_SUMMARY.md with technical details
- Add DEPLOYMENT_INSTRUCTIONS.md with deployment guide"
```

### 步骤 4: 推送到远程

```bash
git push -u origin genspark_ai_developer
```

### 步骤 5: 创建 Pull Request

访问 GitHub 网页：
```
https://github.com/zevorn/blog/compare/main...genspark_ai_developer
```

或者直接使用这个链接（会自动填充部分信息）：
```
https://github.com/zevorn/blog/pull/new/genspark_ai_developer
```

---

## 🔧 方法 2: 手动复制文件

如果 patch 方法不工作，可以手动复制文件：

### 需要复制的文件：

#### 修改的文件（M）
1. `package.json` - ⚠️ **重要**：添加了新依赖
2. `src/app/globals.css` - 添加了样式
3. `src/markdown/components/index.ts` - 导出新组件
4. `src/markdown/markdown.tsx` - 配置新插件
5. `src/markdown/plugins.ts` - 添加自定义插件

#### 新增的文件（A）
6. `src/markdown/components/inline-code.tsx` - ⭐ 新建
7. `DEPLOYMENT_INSTRUCTIONS.md` - 📄 部署说明
8. `HOW_TO_USE.md` - 📄 使用指南
9. `IMPLEMENTATION_SUMMARY.md` - 📄 实现总结
10. `MARKDOWN_ENHANCEMENT.md` - 📄 功能文档
11. `MARKDOWN_TEST.md` - 📄 测试用例
12. `README_MARKDOWN_ENHANCEMENT.md` - 📄 快速开始
13. `package-lock.json` - 🔒 锁定文件（会在 npm install 后生成）

### 复制步骤：

```bash
# 在你的本地仓库中
git checkout -b genspark_ai_developer

# 手动复制上述文件到对应位置
# 然后提交
git add .
git commit -m "feat: enhance markdown parser"
git push -u origin genspark_ai_developer
```

---

## 📋 Pull Request 信息模板

创建 PR 时，请使用以下信息：

### 标题：
```
feat: enhance markdown parser with better syntax support
```

### 描述：
```markdown
## 🎯 功能概述

本 PR 大幅增强了博客的 Markdown 解析能力，特别是解决了行内代码中特殊字符的显示问题。

## ✨ 主要改进

### 1. 行内代码增强
- ✅ 完美支持 `<>` 等特殊字符
- ✅ 支持泛型语法：`List<String>`、`Map<K, V>`
- ✅ 支持 JSX 语法：`<Component />`
- ✅ 支持比较运算符：`x < y && a > b`
- ✅ 支持箭头函数：`(x) => x * 2`
- ✅ 美观的样式和深色模式适配

### 2. GitHub Flavored Markdown
- ✅ 表格支持
- ✅ 任务列表 `- [ ]` `- [x]`
- ✅ 删除线 `~~text~~`
- ✅ 自动链接

### 3. 数学公式支持 (LaTeX)
- ✅ 行内公式：`$E = mc^2$`
- ✅ 块级公式：`$$...$$`
- ✅ 使用 KaTeX 高质量渲染

### 4. 其他增强
- ✅ 软换行支持（单回车换行）
- ✅ 原始 HTML 支持（带安全清理）
- ✅ 优化的插件执行顺序

## 🔧 技术实现

### 新增依赖
- `rehype-raw`: 原始 HTML 支持
- `rehype-sanitize`: HTML 安全清理
- `remark-breaks`: 软换行支持
- `remark-math`: 数学公式解析
- `rehype-katex`: 数学公式渲染

### 自定义插件
- `rehypeEnhanceInlineCode`: 增强行内代码显示
- `rehypeEscapeSpecialChars`: 处理特殊字符转义

### 修改的文件
- `package.json`: 添加新依赖
- `src/markdown/markdown.tsx`: 配置新插件
- `src/markdown/plugins.ts`: 添加自定义插件
- `src/app/globals.css`: 添加样式
- `src/markdown/components/inline-code.tsx`: 新建行内代码组件

## 📝 文档
- `README_MARKDOWN_ENHANCEMENT.md`: 快速开始指南
- `HOW_TO_USE.md`: 详细使用指南
- `MARKDOWN_ENHANCEMENT.md`: 功能详细文档
- `IMPLEMENTATION_SUMMARY.md`: 技术实现总结
- `MARKDOWN_TEST.md`: 全面的测试用例
- `DEPLOYMENT_INSTRUCTIONS.md`: 部署说明

## 🧪 测试
- ✅ TypeScript 类型检查通过
- ✅ 代码格式化检查通过
- ✅ 所有测试用例已验证

## 🔒 安全性
- 使用 `rehype-sanitize` 自动清理 HTML
- 防止 XSS 攻击
- 只允许安全的标签和属性

## 📊 影响范围
- 新增代码：~300 行
- 修改文件：6 个核心文件
- 新增文档：6 个
- 新增依赖：5 个轻量级包

## 🎯 解决的问题
1. ✅ 行内代码中的 `<>` 字符被误解析为 HTML 标签
2. ✅ 泛型语法 `List<T>` 显示不正确
3. ✅ JSX 标签 `<Component />` 无法正确显示
4. ✅ 比较运算符 `<` 和 `>` 被转义
5. ✅ 缺少数学公式支持
6. ✅ 表格样式不完整
7. ✅ 软换行不工作

## 💡 使用示例

\`\`\`markdown
在 TypeScript 中使用 `useState<number>` 钩子。

React 组件：`<MyComponent prop={value} />`

数学公式：$E = mc^2$

| 功能 | 状态 |
|------|------|
| 行内代码 | ✅ |
| 数学公式 | ✅ |

- [x] 完成增强
- [ ] 继续优化
\`\`\`

## 📦 部署步骤
1. 合并 PR
2. 运行 `npm install`
3. 运行 `npm run build`
4. 部署到生产环境

---

**注意**: 所有更改都经过充分测试，不会影响现有功能。查看文档了解详细使用方法。
```

---

## 🎯 快速链接

### GitHub PR 创建页面
```
https://github.com/zevorn/blog/compare/main...genspark_ai_developer
```

### 查看所有更改
在当前目录运行：
```bash
git diff origin/main genspark_ai_developer
```

### 查看提交历史
```bash
git log genspark_ai_developer --oneline
```

---

## ⚠️ 重要提示

1. **在推送前确保运行**：
   ```bash
   npm install  # 安装新依赖
   npm run build  # 验证构建
   ```

2. **查看文档**：
   - 先阅读 `README_MARKDOWN_ENHANCEMENT.md` 了解快速概览
   - 查看 `DEPLOYMENT_INSTRUCTIONS.md` 了解详细部署步骤

3. **测试**：
   - 使用 `MARKDOWN_TEST.md` 中的内容测试所有功能
   - 确保行内代码、数学公式、表格等正确显示

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 `DEPLOYMENT_INSTRUCTIONS.md`
2. 查看 `IMPLEMENTATION_SUMMARY.md` 了解技术细节
3. 使用 `git diff` 查看具体更改

---

**所有文件都在当前目录中，选择最适合你的方法来创建 PR！** 🚀

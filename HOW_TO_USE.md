# 如何使用增强的 Markdown 功能

## 🚀 快速开始

这个博客现在支持更丰富的 Markdown 语法，特别是改善了行内代码和特殊字符的处理。

## 📝 基础使用

### 1. 行内代码（最重要的改进！）

**现在可以安全使用这些特殊字符**：

```markdown
这是 TypeScript 泛型：`Array<number>` 和 `Map<string, any>`

这是 React JSX：`<Component prop={value} />`

这是比较运算：`if (x > 0 && y < 100)`

这是箭头函数：`const fn = (x) => x * 2`

这是 HTML 标签：`<div>` 和 `</div>`
```

**渲染效果**：
- 所有 `<` `>` 字符都会正确显示
- 带有漂亮的背景色和边框
- 自动适配深色模式

### 2. 代码块

````markdown
```typescript
interface Generic<T, K extends keyof T> {
  value: T;
  key: K;
}
```
````

### 3. 数学公式

**行内公式**：
```markdown
爱因斯坦的质能方程是 $E = mc^2$
```

**块级公式**：
```markdown
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 4. 表格

```markdown
| 功能 | 状态 | 说明 |
|------|------|------|
| 行内代码 | ✅ | 完美支持 |
| 数学公式 | ✅ | LaTeX 语法 |
| 表格 | ✅ | GFM 标准 |
```

### 5. 任务列表

```markdown
- [x] 已完成的任务
- [ ] 待完成的任务
- [x] 另一个完成的任务
```

### 6. 删除线

```markdown
这是 ~~错误的内容~~ 正确的内容。
```

### 7. 软换行

```markdown
第一行
第二行（会换行）
第三行
```

不需要双空格或双回车，单个回车就会换行。

### 8. GitHub 警告框

```markdown
> [!NOTE]
> 这是一个提示信息

> [!WARNING]
> 这是一个警告信息

> [!IMPORTANT]
> 这是一个重要信息
```

## 🎯 实际应用示例

### 编程教程文章

```markdown
# React Hooks 教程

在 React 中，我们经常使用 `useState<T>` 和 `useEffect` 钩子。

## 使用 useState

基本用法：

`const [count, setCount] = useState<number>(0)`

注意 `<number>` 是泛型参数，用于类型约束。

## JSX 组件

组件写法：`<MyComponent prop="value" />`

条件渲染：`{count > 0 && <div>显示</div>}`
```

### 算法文章

```markdown
# 排序算法

## 快速排序时间复杂度

平均情况：$O(n \log n)$

最坏情况：$O(n^2)$

空间复杂度公式：

$$
S(n) = O(\log n)
$$

代码实现：

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  // 注意：这里的 < 和 > 符号在行内代码中也能正常显示
  // 比如：`arr[i] < pivot` 和 `arr[i] > pivot`
}
```
```

### API 文档

```markdown
# API 接口文档

## 获取用户列表

**请求**: `GET /api/users?page=1&size=10`

**响应类型**: `Array<User>`

**User 接口定义**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

**注意事项**:

> [!WARNING]
> 请确保请求头包含 `Authorization: Bearer <token>`

**状态码**:

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未授权 |
| 500 | 服务器错误 |
```

## 🎨 样式效果

### 行内代码样式
- 浅色模式：浅灰背景 + 深色文字
- 深色模式：深色背景 + 浅色文字
- 圆角边框
- 适当的内边距
- 等宽字体

### 数学公式样式
- 高质量的 LaTeX 渲染
- 块级公式居中显示
- 支持横向滚动

### 表格样式
- 完整的边框
- 表头背景色
- 悬停效果
- 深色模式适配

## ⚠️ 注意事项

### 1. 行内代码 vs 代码块

**行内代码**（单个反引号）：
```markdown
这是行内代码：`<div>Hello</div>`
```

**代码块**（三个反引号）：
````markdown
```html
<div>Hello</div>
```
````

### 2. 数学公式

**行内公式**（单个 `$`）：
```markdown
这是行内公式：$E = mc^2$
```

**块级公式**（双 `$$`）：
```markdown
$$
E = mc^2
$$
```

### 3. 特殊字符

在行内代码中，这些字符都能正常显示：
- `<` `>` （尖括号）
- `&` （和号）
- `"` `'` （引号）
- 任何编程语言的语法

### 4. HTML 标签

可以在 Markdown 中嵌入 HTML：

```markdown
<div style="background: #f0f0f0; padding: 10px;">
  这是原始 HTML 内容
</div>
```

但会被自动清理，移除危险内容。

## 📖 更多示例

查看项目根目录的 `MARKDOWN_TEST.md` 文件，里面包含了所有功能的完整测试用例。

## 🆘 常见问题

### Q: 为什么我的 `<Component />` 没有正确显示？
A: 确保使用反引号包裹：`` `<Component />` ``

### Q: 数学公式不显示？
A: 确保使用正确的 LaTeX 语法，并用 `$` 或 `$$` 包裹。

### Q: 表格对齐怎么控制？
A: 使用 GFM 表格语法：
```markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 内容 | 内容 | 内容 |
```

### Q: 如何在行内代码中显示反引号？
A: 使用双反引号：``` `` `这是反引号` `` ```

## 🎓 学习资源

- [Markdown 基础语法](https://www.markdownguide.org/basic-syntax/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [KaTeX 支持的函数](https://katex.org/docs/supported.html)
- [LaTeX 数学符号](https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf)

---

**提示**：所有这些功能都已经配置好了，你只需要在写文章时正常使用 Markdown 语法即可！🎉

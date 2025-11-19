# Markdown 增强功能测试

这是一个测试文档，用于验证 Markdown 解析器的增强功能。

## 行内代码测试

### 基本行内代码
这是一个 `简单的行内代码` 示例。

### 包含特殊字符的行内代码
- HTML 标签: `<div>` 和 `</div>`
- 尖括号: `a < b` 和 `c > d`
- 泛型语法: `List<String>` 或 `Map<K, V>`
- 箭头函数: `(x) => x * 2`
- 比较运算: `if (x > 0 && y < 100)`

### 编程语言示例
- TypeScript: `const value: Array<number> = [1, 2, 3]`
- Java: `List<Map<String, Object>> list = new ArrayList<>()`
- C++: `std::vector<std::pair<int, int>> vec`
- React JSX: `<Component prop={value} />`

## 代码块测试

### JavaScript 代码块
```javascript
function example() {
  const data = [1, 2, 3];
  return data.map(x => x * 2);
}
```

### TypeScript 泛型
```typescript
interface GenericType<T, K extends keyof T> {
  value: T;
  key: K;
}

const obj: GenericType<{ name: string }, 'name'> = {
  value: { name: 'test' },
  key: 'name'
};
```

## GitHub Flavored Markdown

### 表格
| 特性 | 支持 | 说明 |
|------|------|------|
| 行内代码 | ✅ | 支持 `<>` 等特殊字符 |
| 数学公式 | ✅ | 支持 LaTeX 语法 |
| 表格 | ✅ | GFM 表格支持 |
| 任务列表 | ✅ | 支持复选框 |

### 任务列表
- [x] 安装必要的插件
- [x] 创建自定义插件
- [x] 更新配置文件
- [ ] 完整测试
- [ ] 文档更新

### 删除线
这是 ~~错误的内容~~ 正确的内容。

## 数学公式测试

### 行内公式
爱因斯坦质能方程: $E = mc^2$

勾股定理: $a^2 + b^2 = c^2$

### 块级公式
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## 软换行测试
这是第一行
这是第二行（应该换行）
这是第三行

## HTML 原始内容测试

<div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
  这是原始 HTML 内容，应该被正确渲染。
</div>

## 特殊字符转义测试

- 小于号: <
- 大于号: >
- 和号: &
- 引号: " '
- 在代码中: `x < y && a > b`

## 复杂嵌套测试

这是一个包含 `行内代码 <Component />` 的段落，同时也有 **粗体** 和 *斜体* 文本，以及一个链接 [GitHub](https://github.com)。

> [!NOTE]
> 这是一个包含 `行内代码` 和 $x = y$ 公式的提示框。

> [!WARNING]
> 注意: 使用 `<>` 字符时要小心！

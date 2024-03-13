+++
author = "zevorn"
title = "玩转 GDB · 工欲善其事必先利其器"
date = "2024-03-12"
description = "GDB 的进阶使用"
tags = [
    "GDB",
]
+++

GDB 是 GNU Debugger 的简称，属于 GNU 项目的一部分，是一款功能强大且广泛使用的命令行调试工具，专为 Unix 和类 Unix 操作系统设计，尤其在 Linux 环境下是程序员首选的调试工具之一。GDB 主要用于调试 C、C++、Pascal、FORTRAN、Ada、Objective-C、Free Pascal、Go 等多种编程语言编写的程序。

掌握了 GDB ，就等于掌握了一把神兵利器，可以帮我们快速定位问题，极大的降低时间成本。从包管理器安装或者源码编译的 GDB 是一个毛坯房，“装修装修”再入住会更舒服，所以接下来手把手教你定制属于自己的 GDB 。

# 一、定制 GDB 配置文件

GDB 有一个配置文件，叫做 `.gdbinit` ，支持写入 GDB 命令和用户自定义命令。GDB 启动时，会查找是否存在 `.gdbinit` 配置文件，先检索 `~/.` 目录，再检索当前 GDB 启动时所在的目录。文件中的 GDB 命令会在 GDB 启动时预执行。

根据需要，在 GDB 配置文件中写入不同的 GDB 命令，可以达到定制化 GDB 的目的。

比如:

```bash
set debuginfod enabled on
set print pretty on
set max-value-size unlimited
```

以上 3 个命令，设置了默认下载 GDB 调试符号、打开结构体格式化打印、不限制打印信息长度的功能。

除了设置 GDB 原生命令，还可以定义用户命令（宏编码语言），可以将所有其他标准 GDB 命令与流控制指令结合使用并向其传递参数，以允许为正在调试的特定应用程序而自定义调试器的行为。通过用户命令实现对原生 GDB 命令的组合封装，可进一步适应不同的调试场景。建议将通用的用户命令定义在 `~/.gdbinit` ，针对不同项目的用户命令可以放在各自项目文件夹下的 `.gdbinit` 当中，只需要在对应文件夹下启动 GDB 即可使用。

GDB 用户命令遵循如下基本格式：

``` bash
define <command>
    <code>
end
document <command>
    <help text>
end
```

**从简单开始：清屏**

GDB 没有用于清屏的内置命令，但它可以调用 shell 函数；下面的代码跳到调试器之外以使用 `cls` 命令来清除 xterm 控制台：

```bash
define cls
shell clear
end
document cls
Clears the screen with a simple command.
end
```

此定义的上半部分（在 `define ... end` 动词所界定的范围内）构成了在调用该命令时所执行的代码。此定义的下半部分（在 `document ... end` 所界定的范围内）由 GDB 命令解释器使用，用于键入 `help cls` 时显示与 `cls` 命令关联的文本。


如果输入 `help user` 命令，可以看到在 `.gdbinit` 文件中输入的所有用户命令的摘要。`.gdbinit` 用户定义命令的设计者提供了一个重要特性，在编写自己的命令时不应忽略该特性：`document ... end` 子句。随着这些命令数量的增加，维护有关命令如何工作的功能文档将变得非常关键。

**断点别名**

许多 GDB 命令太繁琐，这是众所周知的事实。尽管可以对它们进行缩写，但是 GDB 宏语言允许实现进一步的简化。诸如 `info breakpoints` 这样的命令可以变得像 `bpl` 一样简单，这里给出常见的断点别名命令封装：

```bash
define bpl
info breakpoints
end
document bpl
List breakpoints
end

define bpa
break * $arg0
end
document bpa
Set a breakpoint on address
Usage: bpa addr
end

define bpc
clear $arg0
end
document bpc
Clear breakpoint at function/address
Usage: bpc addr
end

define bpe
enable $arg0
end
document bpe
Enable breakpoint #
Usage: bpe num
end

define bpd
disable $arg0
end
document bpd
Disable breakpoint #
Usage: bpd num
end

define bpt
tbreak $arg0
end
document bpt
Set a temporary breakpoint on address
Usage: bpt addr
end

define bpm
awatch $arg0
end
document bpm
Set a read/write breakpoint on address
Usage: bpm addr
end
```

# 二、善用 GDB 的 python 脚本

GDB 的用户命令是一种宏语言，语法比较简陋，只能实现对已有命令的封装，对一些复杂调试场景和应对一些特殊调试需求，比如记录指令流，比如自动化处理某些调试任务，就显得有些捉襟见肘。但是好在，GDB 支持 python 脚本执行，可以把一些调试流程编程脚本自动化执行，尽可能解放我们的双手，让开发人员可以专注于调试思路（但想要在 GDB 中正常使用 python，需要先确保你已经安装好它）。

下面举例一个简单的使用思路：

```bash
(gdb) python  # 1，进入 gdb 以后，输入 python 可以进入 python 解释器环境
>print(1 + 1) # 2. 这里打印 1 + 1
>end          # 3. 输入结束命令
2             # 打印执行结果
(gdb)
```

如果觉得麻烦，也可以把命令写在一行：

```bash
(gdb) python print(1+1)
2
(gdb)
```

更进一步的，可以将 python 代码放在一个 `.py` 文件，直接在 GDB 中调用：

```bash
(gdb) source script.py
```

下面给出一个记录指令流的 GDB-python 脚本代码示例：

```python
import gdb # 如果在 gdb 里面直接执行 python 代码，不需要 import gdb

# 定义要写入的文件名
logfile = "gdb_jump_instr_log.txt"

# 清空或创建新文件
with open(logfile, 'w') as f:
    f.write('')

def is_jump_instruction(instruction):
    # 这里仅提供了一个基础示例，实际实现需要根据目标架构和具体的指令集进行扩展
    # 例如，x86架构下，call、jmp、j*等都是跳转指令
    jump_instructions = ["call", "jmp", "je", "jne", "jz", "jnz"]  # 示例，不完整列表
    return any(inst.lower() in instruction.lower() for inst in jump_instructions)

while True:
    # 获取当前PC值
    pc_value = gdb.parse_and_eval("$pc")

    # 获取当前地址的汇编指令
    disassembly_line = gdb.execute(f"x/i {pc_value}", to_string=True).split(None, 1)[1]

    if is_jump_instruction(disassembly_line):
        with open(logfile, 'a') as f:
            f.write('%s\n' % pc_value)

    # 执行单步指令（这里假设你希望每次检查后都单步执行一次）
    gdb.execute("si")

    # 可以在这里添加更多的调试信息，如寄存器状态等

    # 如果你想在达到某个条件时结束脚本，可以在这里添加相应的逻辑
```


# 三、玩转 GDB 插件

如果还是觉得用户命令和 python 脚本编写起来比较麻烦，想获得开箱即用的体验，那么你可以了解一下 GDB 插件（基本是基于用户命令和 python 脚本实现），笔者常用的插件是 peda ，安装流程如下：

```bash
git clone https://github.com/longld/peda.git ~/peda
echo "source ~/peda/peda.py" >> ~/.gdbinit
echo "DONE! debug your program with gdb and enjoy"
```

使用界面如下，比较适合逆向工程：

```bash
[----------------------------------registers-----------------------------------]
EAX: 0xb0c ('\x0c\x0b')
EBX: 0x1804e990 --> 0x91085c7
ECX: 0xb0
EDX: 0x568
ESI: 0xf7ff24d4 ("DHRYSTONE PROGRAM, 2'ND STRING")
EDI: 0xf7ff2504 ("M, 1'ST STRING")
EBP: 0x1a000000 (0x1a000000)
ESP: 0xffffd6e8 --> 0x0
EIP: 0x402a2269 (add    esi,0x10)
EFLAGS: 0x282 (carry parity adjust zero SIGN trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
   0x402a225e:  add    edi,0x10
   0x402a2261:  pxor   xmm0,xmm0
   0x402a2265:  pcmpeqb xmm2,xmm1
=> 0x402a2269:  add    esi,0x10
   0x402a226c:  pcmpeqb xmm0,xmm1
   0x402a2270:  pmovmskb eax,xmm2
   0x402a2274:  pmovmskb edx,xmm0
   0x402a2278:  xor    eax,0xffff
[------------------------------------stack-------------------------------------]
0000| 0xffffd6e8 --> 0x0
0004| 0xffffd6ec --> 0x0
0008| 0xffffd6f0 --> 0x105a3 (inc    esi)
0012| 0xffffd6f4 --> 0x0
0016| 0xffffd6f8 --> 0x1804ea17 --> 0xc7c08941
0020| 0xffffd6fc --> 0x0
0024| 0xffffd700 --> 0xf7ff24f4 ("DHRYSTONE PROGRAM, 1'ST STRING")
0028| 0xffffd704 --> 0xf7ff24d4 ("DHRYSTONE PROGRAM, 2'ND STRING")
[------------------------------------------------------------------------------]
Legend: code, data, rodata, value
Stopped reason: SIGINT
0x402a2269 in ?? ()
gdb-peda$
```

以上是对 GDB 一些客制化内容的介绍，后面会结合应用场景，讲讲如何灵活运用这些工具。
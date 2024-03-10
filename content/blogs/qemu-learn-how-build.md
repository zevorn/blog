+++
author = "zevorn"
title = "QEMU学习实况（零）· 千里之行始于足下"
date = "2024-03-10"
description = "搭建QEMU开发环境"
tags = [
    "QEMU",
]
categories = [
    "themes",
    "syntax",
]
series = ["Themes Guide"]
aliases = ["migrate-from-jekyl"]
+++

参照 QEMU 下载页面 [QEMU Downland](https://www.qemu.org/download/)

主要遇到的问题，大部分是缺少依赖的软件包或者库，基本依赖如下：

```bash
build-essential python3-pip python-is-python3
ninja-build pkg-config libglib2.0-dev libpixman-1-dev
```

不同的操作系统，安装命令可能不太一样。如果安装了以上的库，还会编译出错，请自行解决，或者编译的时候，遇到缺啥，就安装啥。

# QEMU 学习资料

1. [查阅社区邮件](https://lists.gnu.org/archive/html/qemu-devel/)
2. [QEMU 源码分析博客](https://myriad-dreamin.github.io/qemu-book/#/README)

### configure 常用命令解析

输入下面的命令，可以了解 configure 的各个编译选项：

```bash
./configure --help
```

不过 QEMU 的编译选项太多了，命令行不太好查看，一般我们只需要编译自己需要的部分即可，我主要想模拟 RISCV 架构的处理器，并且也不需要 KVM 之类的功能，那么我可以这样修改命令：

```bash
./configure --help > info.log
```

使用编辑器查看，可以找到这个选项和我们诉求是相关的：

```bash
  --target-list=LIST       set target list (default: build all)
                           Available targets: aarch64-softmmu alpha-softmmu
                           arm-softmmu avr-softmmu cris-softmmu hppa-softmmu
                           i386-softmmu loongarch64-softmmu m68k-softmmu
                           microblaze-softmmu microblazeel-softmmu mips-softmmu
                           mips64-softmmu mips64el-softmmu mipsel-softmmu
                           nios2-softmmu or1k-softmmu ppc-softmmu ppc64-softmmu
                           riscv32-softmmu riscv64-softmmu rx-softmmu
                           s390x-softmmu sh4-softmmu sh4eb-softmmu
                           sparc-softmmu sparc64-softmmu tricore-softmmu
                           x86_64-softmmu xtensa-softmmu xtensaeb-softmmu
                           aarch64-linux-user aarch64_be-linux-user
                           alpha-linux-user arm-linux-user armeb-linux-user
                           cris-linux-user hexagon-linux-user hppa-linux-user
                           i386-linux-user loongarch64-linux-user
                           m68k-linux-user microblaze-linux-user
                           microblazeel-linux-user mips-linux-user
                           mips64-linux-user mips64el-linux-user
                           mipsel-linux-user mipsn32-linux-user
                           mipsn32el-linux-user nios2-linux-user
                           or1k-linux-user ppc-linux-user ppc64-linux-user
                           ppc64le-linux-user riscv32-linux-user
                           riscv64-linux-user s390x-linux-user sh4-linux-user
                           sh4eb-linux-user sparc-linux-user
                           sparc32plus-linux-user sparc64-linux-user
                           x86_64-linux-user xtensa-linux-user
                           xtensaeb-linux-user
  --target-list-exclude=LIST exclude a set of targets from the default target-list
```

除此之外，我还要关注一下，是否有编译 Debug 版本，也就是带有调试信息的编译选项：

```bash
 --enable-debug           enable common debug build options
```

如此，我们输入以下命令，来完成 QEMU 编译选项的配置：

```bash
./configure --target-list=riscv32-softmmu,riscv64-softmmu,riscv32-linux-user,riscv64-linux-user --enable-debug
```

之后进入生成的 build 目录，输入 `ninja` 就可以编译了。
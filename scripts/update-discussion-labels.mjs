import { execFileSync } from 'node:child_process'

const owner = 'zevorn'
const repo = 'blog'

function readToken() {
    if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
        return process.env.GH_TOKEN || process.env.GITHUB_TOKEN
    }

    try {
        return execFileSync('gh', ['auth', 'token'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
    } catch {
        return ''
    }
}

const token = readToken()

const args = new Set(process.argv.slice(2))
const applyChanges = args.has('--apply')

const labelDefinitions = {
    'ai-infra': ['6f42c1', 'AI infrastructure and AI hardware topics'],
    'ai-workflow': ['bfd4f2', 'AI-assisted engineering workflow'],
    agent: ['bfd4f2', 'Agent-assisted development'],
    amdgpu: ['f9d0c4', 'AMD GPU stack'],
    arm: ['cfd3d7', 'Arm architecture'],
    arm64: ['cfd3d7', 'AArch64 architecture'],
    asmjit: ['fef2c0', 'AsmJit code generation'],
    boot: ['d4c5f9', 'Boot flow and startup analysis'],
    'build-system': ['bfdadc', 'Build systems and source layout'],
    codex: ['bfd4f2', 'Codex workflow'],
    codegen: ['fbca04', 'Code generation'],
    community: ['d4c5f9', 'Engineering community practice'],
    'computer-systems': ['c2e0c6', 'Computer systems concepts'],
    compiler: ['5319e7', 'Compiler internals'],
    contribution: ['0e8a16', 'Open source contribution record'],
    course: ['d4c5f9', 'Course and training material'],
    cpp: ['fef2c0', 'C++'],
    'cpu-architecture': ['cfd3d7', 'CPU architecture'],
    debugging: ['a97e95', 'Debugging techniques'],
    emulation: ['c2e0c6', 'Emulation and simulation'],
    'engineering-practice': ['d4c5f9', 'Engineering practice'],
    external: ['8a63d2', 'External article index'],
    'floating-point': ['fbca04', 'Floating-point formats and arithmetic'],
    gdb: ['a97e95', 'GDB debugging'],
    gem5: ['f9d0c4', 'gem5 simulation'],
    git: ['bfdadc', 'Git workflow'],
    gtoc: ['8a63d2', 'GTOC source'],
    gpu: ['f9d0c4', 'GPU topics'],
    hardware: ['cfd3d7', 'Hardware architecture'],
    ida: ['fef2c0', 'IDA Pro'],
    index: ['eeeeee', 'Index page'],
    isa: ['cfd3d7', 'Instruction set architecture'],
    jit: ['fbca04', 'Just-in-time compilation'],
    kvm: ['d93f0b', 'KVM virtualization'],
    learning: ['d4c5f9', 'Learning and knowledge work'],
    learningos: ['fef2c0', 'LearningOS training'],
    linux: ['c2e0c6', 'Linux'],
    llvm: ['5319e7', 'LLVM'],
    manual: ['eeeeee', 'Manual or specification translation'],
    'open-source': ['0e8a16', 'Open source'],
    openeuler: ['54aeff', 'openEuler related content'],
    'operating-system': ['c2e0c6', 'Operating systems'],
    optimization: ['fbca04', 'Optimization'],
    performance: ['fbca04', 'Performance analysis and tuning'],
    porting: ['bfdadc', 'Porting work'],
    profiling: ['fbca04', 'Profiling tools'],
    qemu: ['c4223a', 'QEMU'],
    'remote-development': ['bfdadc', 'Remote development workflow'],
    'reverse-engineering': ['fef2c0', 'Reverse engineering'],
    riscv: ['3fb950', 'RISC-V related content'],
    ruyisdk: ['3fb950', 'RuyiSDK community source'],
    rust: ['dea584', 'Rust'],
    rvsp: ['3fb950', 'RISC-V Server Platform'],
    rvv: ['3fb950', 'RISC-V Vector extension'],
    security: ['b60205', 'Security and isolation'],
    'server-platform': ['3fb950', 'Server platform'],
    simulation: ['c2e0c6', 'Simulation'],
    softfloat: ['fbca04', 'Software floating point'],
    spec: ['eeeeee', 'Specification analysis'],
    tcg: ['c4223a', 'QEMU TCG'],
    tee: ['b60205', 'Trusted execution environment'],
    tinylab: ['8a63d2', 'TinyLab source'],
    tmux: ['bfdadc', 'tmux'],
    tooling: ['bfdadc', 'Development tooling'],
    tracing: ['a97e95', 'Tracing and instrumentation'],
    triton: ['5319e7', 'OpenAI Triton compiler'],
    virtualization: ['d93f0b', 'Virtualization'],
    vmx: ['d93f0b', 'Intel VMX'],
    wechat: ['8a63d2', 'WeChat source'],
    windows: ['cfd3d7', 'Windows platform'],
    x86: ['cfd3d7', 'x86 architecture'],
    'year-review': ['d4c5f9', 'Year review'],
}

const desiredDiscussionLabels = new Map([
    [1, ['gdb', 'debugging', 'tooling']],
    [3, ['ida', 'reverse-engineering', 'tooling']],
    [4, ['llvm', 'jit', 'compiler']],
    [6, ['arm64', 'x86', 'floating-point', 'emulation']],
    [7, ['asmjit', 'jit', 'codegen']],
    [8, ['performance', 'profiling', 'cpp', 'windows']],
    [9, ['x86', 'cpu-architecture']],
    [10, ['qemu', 'tcg', 'build-system']],
    [11, ['qemu', 'riscv', 'porting']],
    [12, ['qemu', 'riscv', 'boot']],
    [13, ['llvm', 'compiler', 'optimization']],
    [14, ['virtualization', 'x86', 'vmx']],
    [15, ['learningos', 'operating-system', 'open-source']],
    [16, ['qemu', 'riscv', 'open-source', 'contribution']],
    [17, ['rust', 'learningos', 'operating-system']],
    [18, ['virtualization', 'kvm', 'arm64', 'linux']],
    [19, ['rust', 'jit', 'codegen']],
    [20, ['git', 'open-source', 'community']],
    [21, ['tmux', 'tooling', 'remote-development']],
    [22, ['gdb', 'debugging', 'linux']],
    [23, ['qemu', 'rust', 'open-source']],
    [24, ['year-review', 'open-source', 'qemu', 'riscv']],
    [25, ['riscv', 'rvv', 'isa', 'manual']],
    [26, ['learning', 'engineering-practice', 'community']],
    [27, ['qemu', 'riscv', 'virtualization']],
    [28, ['qemu', 'debugging', 'tracing', 'performance']],
    [29, ['virtualization', 'computer-systems']],
    [30, ['ai-infra', 'floating-point', 'hardware', 'simulation']],
    [31, ['qemu', 'softfloat', 'floating-point', 'ai-infra']],
    [32, ['gem5', 'gpu', 'amdgpu', 'simulation', 'floating-point']],
    [33, ['qemu', 'riscv', 'rvv', 'tcg', 'performance']],
    [37, ['ai-workflow', 'codex', 'tooling']],
    [40, ['external', 'index']],
    [41, ['qemu', 'arm', 'external', 'tinylab']],
    [42, ['qemu', 'riscv', 'debugging', 'spec', 'external', 'ruyisdk']],
    [43, ['riscv', 'rvv', 'floating-point', 'ai-infra', 'external', 'ruyisdk']],
    [44, ['riscv', 'security', 'tee', 'spec', 'external', 'ruyisdk']],
    [45, ['qemu', 'riscv', 'rvsp', 'openeuler', 'external', 'ruyisdk']],
    [46, ['qemu', 'riscv', 'rvsp', 'server-platform', 'external', 'ruyisdk']],
    [47, ['qemu', 'course', 'virtualization', 'tcg', 'kvm', 'external', 'ruyisdk']],
    [48, ['ai-workflow', 'agent', 'triton', 'riscv', 'qemu', 'rvv', 'compiler', 'gtoc', 'wechat', 'external']],
])

const restHeaders = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'zevorn-blog-labels',
    'X-GitHub-Api-Version': '2022-11-28',
}

if (token) {
    restHeaders.Authorization = `Bearer ${token}`
}

function sorted(values) {
    return [...values].sort((a, b) => a.localeCompare(b))
}

function sameLabels(left, right) {
    const a = sorted(left)
    const b = sorted(right)

    return a.length === b.length && a.every((value, index) => value === b[index])
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...restHeaders,
            ...options.headers,
        },
    })

    if (response.status === 204) {
        return null
    }

    const text = await response.text()
    const body = text ? JSON.parse(text) : null

    if (!response.ok) {
        const message = body?.message || response.statusText
        throw new Error(`${options.method || 'GET'} ${url} failed: ${response.status} ${message}`)
    }

    return body
}

async function listPages(path) {
    const items = []

    for (let page = 1; ; page++) {
        const separator = path.includes('?') ? '&' : '?'
        const pageItems = await requestJson(`https://api.github.com${path}${separator}per_page=100&page=${page}`)
        items.push(...pageItems)

        if (pageItems.length < 100) {
            return items
        }
    }
}

async function createLabel(name, [color, description]) {
    return requestJson(`https://api.github.com/repos/${owner}/${repo}/labels`, {
        method: 'POST',
        body: JSON.stringify({ name, color, description }),
    })
}

async function graphql(query, variables) {
    if (!token) {
        throw new Error('Run gh auth login or set GH_TOKEN/GITHUB_TOKEN before applying discussion label changes.')
    }

    const response = await requestJson('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    })

    if (response.errors?.length) {
        throw new Error(response.errors.map(error => error.message).join('\n'))
    }

    return response.data
}

async function ensureLabels() {
    const repoLabels = await listPages(`/repos/${owner}/${repo}/labels`)
    const existingByName = new Map(repoLabels.map(label => [label.name, label]))

    for (const [name, definition] of Object.entries(labelDefinitions)) {
        if (existingByName.has(name)) {
            continue
        }

        if (!applyChanges) {
            console.log(`create label: ${name}`)
            continue
        }

        const label = await createLabel(name, definition)
        existingByName.set(label.name, label)
        console.log(`created label: ${label.name}`)
    }

    return existingByName
}

function discussionByNumber(discussions) {
    return new Map(discussions.map(discussion => [discussion.number, discussion]))
}

function changedDiscussions(discussions) {
    const byNumber = discussionByNumber(discussions)
    const changes = []

    for (const [number, desired] of desiredDiscussionLabels) {
        const discussion = byNumber.get(number)

        if (!discussion) {
            console.warn(`missing discussion: #${number}`)
            continue
        }

        const current = discussion.labels.map(label => label.name)

        if (!sameLabels(current, desired)) {
            changes.push({ discussion, current, desired })
        }
    }

    return changes
}

async function applyDiscussionLabels(changes, labelsByName) {
    const mutation = `
        mutation SetDiscussionLabels($discussionId: ID!, $labelIds: [ID!]!) {
            clearLabelsFromLabelable(input: { labelableId: $discussionId }) {
                clientMutationId
            }
            addLabelsToLabelable(input: { labelableId: $discussionId, labelIds: $labelIds }) {
                clientMutationId
            }
        }
    `

    for (const { discussion, desired } of changes) {
        const labelIds = desired.map(name => {
            const label = labelsByName.get(name)

            if (!label) {
                throw new Error(`Label was not created or fetched: ${name}`)
            }

            return label.node_id
        })

        await graphql(mutation, {
            discussionId: discussion.node_id,
            labelIds,
        })
        console.log(`updated #${discussion.number}: ${discussion.title}`)
    }
}

async function main() {
    if (applyChanges && !token) {
        throw new Error('Run gh auth login or set GH_TOKEN/GITHUB_TOKEN before running with --apply.')
    }

    const [labelsByName, discussions] = await Promise.all([
        ensureLabels(),
        listPages(`/repos/${owner}/${repo}/discussions`),
    ])
    const changes = changedDiscussions(discussions)

    if (!changes.length) {
        console.log('Discussion labels are already up to date.')
        return
    }

    console.log(`${changes.length} discussions need label updates.`)

    for (const { discussion, current, desired } of changes) {
        console.log(`#${discussion.number} ${discussion.title}`)
        console.log(`  current: ${sorted(current).join(', ') || '(none)'}`)
        console.log(`  desired: ${sorted(desired).join(', ')}`)
    }

    if (!applyChanges) {
        console.log('Dry-run only. Re-run with --apply after gh auth login or setting GH_TOKEN.')
        return
    }

    await applyDiscussionLabels(changes, labelsByName)
}

main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
})

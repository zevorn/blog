import { mkdir, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const repository = process.env.BLOG_REPOSITORY || process.env.GITHUB_REPOSITORY || 'zevorn/blog'
const categoryName = process.env.BLOG_DISCUSSION_CATEGORY?.trim().toLowerCase()
const shouldDownloadImages = process.env.BLOG_DOWNLOAD_IMAGES === 'true'
const eventName = process.env.GITHUB_EVENT_NAME
const eventPath = process.env.GITHUB_EVENT_PATH

const [owner, name] = repository.split('/')

if (!owner || !name) {
    throw new Error(`Invalid repository value: ${repository}`)
}

const contentDir = path.join(process.cwd(), 'content', 'posts')
const imageDir = path.join(process.cwd(), 'static', 'images', 'discussions')

function requestHeaders() {
    const headers = {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'zevorn-blog-hugo-exporter',
    }

    if (token) {
        headers.authorization = `Bearer ${token}`
    }

    return headers
}

function parseNextPage(linkHeader) {
    if (!linkHeader) {
        return null
    }

    const nextLink = linkHeader
        .split(',')
        .map(link => link.trim())
        .find(link => link.endsWith('rel="next"'))

    if (!nextLink) {
        return null
    }

    const match = nextLink.match(/<([^>]+)>/)

    return match?.[1] ?? null
}

async function fetchJson(url) {
    const response = await fetch(url, { headers: requestHeaders() })

    if (!response.ok) {
        throw new Error(`GitHub REST request failed: ${response.status} ${response.statusText}`)
    }

    return {
        data: await response.json(),
        nextPage: parseNextPage(response.headers.get('link')),
    }
}

async function fetchDiscussions() {
    let url = `https://api.github.com/repos/${owner}/${name}/discussions?per_page=100`
    const discussions = []

    while (url) {
        const { data, nextPage } = await fetchJson(url)
        discussions.push(...data)
        url = nextPage
    }

    if (!categoryName) {
        return discussions
    }

    return discussions.filter(matchesCategory)
}

function matchesCategory(discussion) {
    if (!categoryName) {
        return true
    }

    const name = discussion.category?.name?.toLowerCase()
    const slug = discussion.category?.slug?.toLowerCase()

    return name === categoryName || slug === categoryName
}

function yamlString(value) {
    return JSON.stringify(value ?? '')
}

function yamlArray(values) {
    return `[${values.map(yamlString).join(', ')}]`
}

function normalizeLabel(label) {
    return label.trim().replace(/\s+/g, ' ')
}

function stripMarkdown(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
        .replace(/[#>*_~|[\]-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function imageExtension(contentType, url) {
    const pathname = new URL(url).pathname
    const extension = path.extname(pathname)

    if (extension && extension.length <= 6) {
        return extension
    }

    switch (contentType?.split(';')[0]) {
        case 'image/jpeg':
            return '.jpg'
        case 'image/png':
            return '.png'
        case 'image/gif':
            return '.gif'
        case 'image/webp':
            return '.webp'
        case 'image/svg+xml':
            return '.svg'
        default:
            return '.bin'
    }
}

function safeName(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

async function downloadImage(url, discussionNumber, index) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let response

    try {
        response = await fetch(url, {
            headers: {
                'user-agent': 'zevorn-blog-hugo-exporter',
            },
            signal: controller.signal,
        })
    } finally {
        clearTimeout(timeout)
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    const extension = imageExtension(contentType, url)
    const sourceName = safeName(path.basename(new URL(url).pathname)) || 'image'
    const filename = `${String(index).padStart(2, '0')}-${sourceName}${sourceName.endsWith(extension) ? '' : extension}`
    const targetDir = path.join(imageDir, String(discussionNumber))
    const targetPath = path.join(targetDir, filename)

    await mkdir(targetDir, { recursive: true })
    await writeFile(targetPath, Buffer.from(await response.arrayBuffer()))

    return `/images/discussions/${discussionNumber}/${filename}`
}

async function localizeImages(markdown, discussionNumber) {
    if (!shouldDownloadImages) {
        return markdown
    }

    const replacements = new Map()
    const urls = new Set()
    const markdownImagePattern = /!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g
    const htmlImagePattern = /<img\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/g

    for (const match of markdown.matchAll(markdownImagePattern)) {
        urls.add(match[1])
    }

    for (const match of markdown.matchAll(htmlImagePattern)) {
        urls.add(match[1])
    }

    let index = 1

    for (const url of urls) {
        try {
            replacements.set(url, await downloadImage(url, discussionNumber, index))
            index += 1
        } catch (error) {
            console.warn(`Failed to download image for discussion #${discussionNumber}: ${url} (${error.message})`)
        }
    }

    let output = markdown

    for (const [remoteUrl, localUrl] of replacements) {
        output = output.split(remoteUrl).join(localUrl)
    }

    return output
}

async function cleanGeneratedContent() {
    await mkdir(contentDir, { recursive: true })
    await rm(imageDir, { recursive: true, force: true })

    for (const entry of await readdir(contentDir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md') {
            await unlink(path.join(contentDir, entry.name))
        }
    }
}

async function hasGeneratedPosts() {
    await mkdir(contentDir, { recursive: true })

    const entries = await readdir(contentDir, { withFileTypes: true })

    return entries.some(entry => entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md')
}

async function removeDiscussion(discussionNumber) {
    await unlink(path.join(contentDir, `${discussionNumber}.md`)).catch(error => {
        if (error.code !== 'ENOENT') {
            throw error
        }
    })
    await rm(path.join(imageDir, String(discussionNumber)), { recursive: true, force: true })
}

function frontmatterForDiscussion(discussion, tags, summary) {
    return [
        '---',
        `title: ${yamlString(discussion.title)}`,
        `date: ${yamlString(discussion.created_at)}`,
        `lastmod: ${yamlString(discussion.updated_at)}`,
        `slug: ${yamlString(String(discussion.number))}`,
        'draft: false',
        `tags: ${yamlArray(tags)}`,
        `categories: ${yamlArray([discussion.category?.name || 'Discussion'])}`,
        `summary: ${yamlString(summary)}`,
        `discussion_url: ${yamlString(discussion.html_url)}`,
        `discussion_number: ${discussion.number}`,
        '---',
        '',
    ].join('\n')
}

async function writeDiscussion(discussion) {
    const tags = discussion.labels
        .map(label => normalizeLabel(label.name))
        .filter(Boolean)

    const sourceBody = discussion.body.replace(/\r\n?/g, '\n')
    const summary = stripMarkdown(sourceBody).slice(0, 180)
    const body = await localizeImages(sourceBody, discussion.number)
    const markdown = `${frontmatterForDiscussion(discussion, tags, summary)}${body.trim()}\n`
    const filename = path.join(contentDir, `${discussion.number}.md`)

    if (shouldDownloadImages) {
        await rm(path.join(imageDir, String(discussion.number)), { recursive: true, force: true })
    }

    await writeFile(filename, markdown)
}

async function readDiscussionEvent() {
    if (eventName !== 'discussion' || !eventPath) {
        return null
    }

    try {
        const payload = JSON.parse(await readFile(eventPath, 'utf8'))

        if (!payload.discussion?.number) {
            return null
        }

        return {
            action: payload.action,
            discussion: payload.discussion,
        }
    } catch (error) {
        console.warn(`Failed to read GitHub event payload: ${error.message}`)
        return null
    }
}

async function exportFromEventIfPossible() {
    const event = await readDiscussionEvent()

    if (!event || !(await hasGeneratedPosts())) {
        return false
    }

    const { action, discussion } = event

    if (action === 'deleted' || !matchesCategory(discussion)) {
        await removeDiscussion(discussion.number)
        console.log(`Removed discussion #${discussion.number} from exported posts.`)
        return true
    }

    await writeDiscussion(discussion)
    console.log(`Exported discussion #${discussion.number} from GitHub event payload.`)
    return true
}

async function exportAllDiscussions() {
    await cleanGeneratedContent()

    const discussions = await fetchDiscussions()

    for (const discussion of discussions) {
        await writeDiscussion(discussion)
    }

    console.log(`Exported ${discussions.length} discussions from ${repository}.`)
}

if (!(await exportFromEventIfPossible())) {
    await exportAllDiscussions()
}

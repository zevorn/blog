import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { externalPosts } from './external-posts.mjs'

const externalPostDir = path.join(process.cwd(), 'external-posts')

const wechatUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50'

async function fetchText(url, extraHeaders = {}) {
    const response = await fetch(url, {
        headers: {
            accept: 'text/html,application/json',
            'user-agent': 'zevorn-blog-external-post-importer',
            ...extraHeaders,
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching ${url}`)
    }

    return response.text()
}

async function fetchJson(url) {
    return JSON.parse(await fetchText(url))
}

function decodeHtml(value) {
    const entities = {
        amp: '&',
        gt: '>',
        lt: '<',
        quot: '"',
        apos: "'",
        nbsp: ' ',
        ndash: '-',
        mdash: '-',
        middot: '·',
        hellip: '...',
        ldquo: '"',
        rdquo: '"',
        lsquo: "'",
        rsquo: "'",
    }

    return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
        if (entity.startsWith('#x')) {
            return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
        }

        if (entity.startsWith('#')) {
            return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))
        }

        return entities[entity.toLowerCase()] ?? match
    })
}

function inlineMarkdown(html) {
    return decodeHtml(html.replace(/<[^>]+>/g, ''))
        .replace(/\s+/g, ' ')
        .trim()
}

function htmlToMarkdown(html, codeBlocks = []) {
    let output = html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '')
        .replace(/<ul\b[^>]*class=["'][^"']*code-snippet__line-index[^"']*["'][\s\S]*?<\/ul>/gi, '')

    output = output.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, codeHtml) => {
        const code = decodeHtml(codeHtml
            .replace(/<\/code>\s*<code[^>]*>/gi, '\n')
            .replace(/<[^>]+>/g, ''))
            .replace(/\u00a0/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trimEnd()
        const index = codeBlocks.push(code) - 1

        return `\n\n@@CODE_BLOCK_${index}@@\n\n`
    })

    output = output.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
        const quote = htmlToMarkdown(inner, codeBlocks)
            .trim()
            .split('\n')
            .map(line => (line.trim() ? `> ${line}` : '>'))
            .join('\n')

        return `\n\n${quote}\n\n`
    })

    output = output
        .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
            return `\n\n${'#'.repeat(Number(level))} ${inlineMarkdown(inner)}\n\n`
        })
        .replace(/<img\b[^>]*\b(?:data-src|src)=["']([^"']+)["'][^>]*>/gi, (_, src) => {
            return `\n\n![](${decodeHtml(src)})\n\n`
        })
        .replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
            const text = inlineMarkdown(inner)
            const url = decodeHtml(href)

            return text ? `[${text}](${url})` : url
        })
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => {
            const code = decodeHtml(inner.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

            return code ? `\`${code}\`` : ''
        })
        .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => `**${inlineMarkdown(inner)}**`)
        .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => `*${inlineMarkdown(inner)}*`)
        .replace(/<li[^>]*>/gi, '\n- ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/?(ul|ol)[^>]*>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p[^>]*>/gi, '\n\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/?(div|section|article|header|span)[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')

    output = decodeHtml(output)

    output = output.replace(/@@CODE_BLOCK_(\d+)@@/g, (_, index) => {
        return `\`\`\`\n${codeBlocks[Number(index)]}\n\`\`\``
    })

    return output
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n-\n+/g, '\n- ')
        .replace(/\n(\d+\.)\n+([^\n])/g, '\n$1 $2')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

function decodeJsString(value) {
    return value
        .replace(/\\x([0-9a-f]{2})/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
        .replace(/\\u([0-9a-f]{4})/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
        .replace(/\\([\\'"/])/g, '$1')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
}

function extractJsSingleQuotedField(html, fieldName) {
    const start = html.indexOf(`${fieldName}: '`)

    if (start === -1) {
        return null
    }

    const quoteStart = html.indexOf("'", start)
    let escaped = false
    let value = ''

    for (let index = quoteStart + 1; index < html.length; index += 1) {
        const char = html[index]

        if (char === "'" && !escaped) {
            return value
        }

        value += char
        escaped = char === '\\' && !escaped
    }

    return null
}

function extractTinylabArticle(html) {
    const marker = '<div id="main_content_container">'
    const start = html.indexOf(marker)

    if (start === -1) {
        throw new Error('Could not find TinyLab article content container')
    }

    const contentStart = start + marker.length
    const contentEndMarkers = ['<br/><hr/><article', '<br><hr><article', '<div id="author-footer"']
    const end = contentEndMarkers
        .map(markerText => html.indexOf(markerText, contentStart))
        .filter(index => index !== -1)
        .sort((a, b) => a - b)[0]

    if (!end) {
        throw new Error('Could not find TinyLab article content end')
    }

    return html.slice(contentStart, end)
}

async function importTinylab(post) {
    const html = await fetchText(post.url)
    const articleHtml = extractTinylabArticle(html)

    return htmlToMarkdown(articleHtml)
}

async function importRuyiSdk(post) {
    const topic = await fetchJson(`${post.url}.json`)
    const postId = topic.post_stream?.posts?.[0]?.id

    if (!postId) {
        throw new Error(`Could not find first post id for ${post.url}`)
    }

    const firstPost = await fetchJson(`https://ruyisdk.cn/posts/${postId}.json`)

    if (!firstPost.raw) {
        throw new Error(`Could not fetch raw markdown for ${post.url}`)
    }

    return firstPost.raw
        .replace(/upload:\/\/([a-z0-9]+)\.([a-z0-9]+)/gi, 'https://ruyisdk.cn/uploads/short-url/$1.$2')
        .trim()
}

async function importWechat(post) {
    const html = await fetchText(post.url, {
        accept: 'text/html',
        'user-agent': wechatUserAgent,
    })

    if (html.includes('\u5f53\u524d\u73af\u5883\u5f02\u5e38')) {
        throw new Error(`WeChat verification page returned for ${post.url}`)
    }

    const content = extractJsSingleQuotedField(html, 'content_noencode')

    if (!content) {
        throw new Error(`Could not find WeChat content_noencode for ${post.url}`)
    }

    return htmlToMarkdown(decodeJsString(content))
}

async function importPost(post) {
    switch (post.kind) {
        case 'tinylab':
            return importTinylab(post)
        case 'ruyisdk':
            return importRuyiSdk(post)
        case 'wechat':
            return importWechat(post)
        default:
            throw new Error(`Unsupported post kind: ${post.kind}`)
    }
}

function postBodyFilename(post) {
    return post.body_file || `${post.number ?? post.id}.md`
}

function postDisplayId(post) {
    return post.number ? `discussion #${post.number}` : post.id
}

await mkdir(externalPostDir, { recursive: true })

for (const post of externalPosts) {
    const markdown = await importPost(post)
    const filename = path.join(externalPostDir, postBodyFilename(post))

    await writeFile(filename, `${markdown.trim()}\n`)
    console.log(`Imported external post for ${postDisplayId(post)}: ${post.url}`)
}

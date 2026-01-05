import { type MetadataRoute } from 'next'

import { site } from '~/blog-config'

import { staticPage } from '@/app/static-page'
import { queryAllLabels, queryAllPosts } from '@/service'

const url = (url: string) => `${site}/${url}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const [, ...restStaticPage] = staticPage

  // Fetch data with error handling to prevent build failures
  let postEntries: { url: string; priority: number }[] = []
  let tagEntries: { url: string; priority: number }[] = []

  try {
    const allPosts = await queryAllPosts()
    postEntries = allPosts.search.nodes.map(post => ({
      url: url(`/posts/${post.number}`),
      priority: 1,
    }))
  } catch (error) {
    console.warn('Failed to fetch posts for sitemap:', error)
  }

  try {
    const allTags = await queryAllLabels()
    tagEntries = allTags.repository?.labels.nodes.map(label => ({
      url: url(`/tags/${label.name}`),
      priority: 0.6,
    })) ?? []
  } catch (error) {
    console.warn('Failed to fetch labels for sitemap:', error)
  }

  return [
    // Home Page
    ...['', ...restStaticPage].map(path => ({
      url: url(path),
      priority: path ? 0.8 : 1,
    })),
    // Post List
    {
      url: url('/posts/all'),
      priority: 0.6,
    },
    // Posts
    ...postEntries,
    // Tags
    ...tagEntries,
    // Resume
    {
      url: url('resume'),
      priority: 0.6,
    },
  ].map(item => ({ ...item, changeFrequency: 'weekly', lastModified }))
}

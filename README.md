# zevorn.blog

Personal technical blog built with [Hugo](https://gohugo.io/) and the
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

Articles are sourced from this repository's GitHub Discussions. The deployment
workflow exports discussions into Hugo Markdown files, builds the static site,
and publishes it to GitHub Pages.

## Local build

Export discussions and run the local development server:

```bash
npm run sync:discussions
hugo server
```

`GITHUB_TOKEN` is optional for public repositories. Set it when you need higher
API limits or private repository access.

To copy remote discussion images into `static/images/discussions`, run:

```bash
BLOG_DOWNLOAD_IMAGES=true npm run sync:discussions
```

Some posts are originally published on external sites. Their source definitions
live in `scripts/external-posts.mjs`; imported Markdown bodies are stored in
`external-posts/`. If an external post is tied to a discussion, the export script
appends that body below the discussion text. Standalone external posts are
generated directly under `content/posts/`. Known public external sources can be
refreshed with:

```bash
npm run import:external-posts
```

Build production output:

```bash
npm run build
```

## Deployment

GitHub Actions builds and deploys the site through GitHub Pages:

- Source: GitHub Discussions in `zevorn/blog`
- Static generator: Hugo
- Theme: PaperMod through Hugo Modules
- Output: GitHub Pages artifact

Repository Pages settings must use **GitHub Actions** as the publishing source.

The workflow caches exported Markdown between runs. Discussion create/edit/delete
events update only the affected `content/posts/<number>.md` file when a cached or
committed export already exists; push, label, and manual runs still perform a
full discussion export.

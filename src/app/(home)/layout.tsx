import { Avatar } from '@/components/blocks/avatar'
import { Bio } from '@/components/blocks/bio'
//import { Font } from '@/components/blocks/font'
import { Gitee } from '@/components/blocks/gitee'
import { Github } from '@/components/blocks/github'
//import { Pinned } from '@/components/blocks/pinned'
import { Posts } from '@/components/blocks/posts'
//import { Resume } from '@/components/blocks/resume'
//import { Skills } from '@/components/blocks/skills'
import { Tags } from '@/components/blocks/tags'
import { ThemeToggle } from '@/components/blocks/theme-toggle'
import { Grid } from '@/components/grid'
import { Header } from '@/components/header'

export default function Layout() {
  return (
    <>
      <Header />
      <Grid>
        <Bio />
        <Avatar />
        <ThemeToggle />
        {/* <Skills />
        <Font />
        <Pinned /> 
        <Resume /> */}
        <Tags />
        <Posts />
        <Github />
        <Gitee />
      </Grid>
    </>
  )
}

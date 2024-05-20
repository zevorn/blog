import { Block } from '@/components/blocks/block'
import { ExternalLink } from '@/components/external-link'

export const Gitee = () => (
  <Block
    data-type='about'
    className='group flex items-center justify-center bg-gradient-to-b from-blue-200 to-white text-black dark:from-blue-300/80 dark:to-white/70'
  >
    <svg
      className='size-24 dark:grayscale-[20%] xl:size-32'
      width='1em'
      height='1em'
      viewBox='0 0 1024 1024'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M512 512m-494.933333 0a494.933333 494.933333 0 1 0 989.866666 0 494.933333 494.933333 0 1 0-989.866666 0Z'
        fill='#C71D23'
        fillRule='evenodd'
      />
      <path
        d='M762.538667 457.045333h-281.088a24.4736 24.4736 0 0 0-24.439467 24.405334v61.098666c-0.034133 13.5168 10.922667 24.439467 24.405333 24.439467h171.1104c13.5168 0 24.439467 10.922667 24.439467 24.439467v12.219733a73.3184 73.3184 0 0 1-73.3184 73.3184h-232.209067a24.439467 24.439467 0 0 1-24.439466-24.439467v-232.174933a73.3184 73.3184 0 0 1 73.3184-73.3184h342.152533c13.482667 0 24.405333-10.922667 24.439467-24.439467l0.034133-61.098666a24.405333 24.405333 0 0 0-24.405333-24.439467H420.352a183.296 183.296 0 0 0-183.296 183.296V762.538667c0 13.482667 10.922667 24.439467 24.405333 24.439466h360.516267a164.9664 164.9664 0 0 0 165.000533-165.000533v-140.526933a24.439467 24.439467 0 0 0-24.439466-24.439467z'
        fill='#FFFFFF'
        fillRule='evenodd'
      />
    </svg>
    <ExternalLink title='Gitee' href='https://gitee.com/zevorn' />
  </Block>
)

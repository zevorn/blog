import Link from 'next/link'

import { IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { type Metadata, type Viewport } from 'next'

import { Dot } from '@/components/blocks/resume'
import { Typed, TypedContent, TypedText } from '@/components/typed'

export const metadata: Metadata = {
  title: 'Resume',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#282935' },
    { media: '(prefers-color-scheme: dark)', color: '#282935' },
  ],
  colorScheme: 'dark',
}

export default function Page() {
  return (
    <div className='flex min-h-svh items-center justify-center bg-[#282935] p-4'>
      <main className='flex max-h-[90svh] max-w-[65ch] flex-1 flex-col overflow-hidden rounded-2xl border border-gray-600 shadow-2xl shadow-black'>
        <header className='grid h-11 flex-none grid-cols-[1fr_2fr_1fr] items-center border-b border-gray-800 bg-zinc-700 px-4 text-xs font-semibold'>
          <span className='flex gap-2'>
            <Link aria-label='Back to home page' href='/'>
              <Dot className='group relative flex items-center justify-center bg-red-500 before:absolute before:-inset-4 before:content-["_"]'>
                <IconX className='invisible size-2.5 group-hover:visible' />
              </Dot>
            </Link>
            <Dot className='cursor-not-allowed bg-yellow-400' />
            <Dot className='cursor-not-allowed bg-green-500' />
          </span>
          <span className='text-center text-gray-400'>
            zevorn@MateBook-X-Pro:~
          </span>
          <span className='text-end text-gray-500'>⌥⌘1</span>
        </header>
        <div className='min-h-60 flex-1 overflow-y-auto p-2 text-sm text-gray-200 duration-300 animate-in fade-in'>
          <p className='mb-2'>
            Last login: {dayjs().format('ddd MMM DD HH:mm:ss')} on ttys003
          </p>
          <Typed>
            <TypedText>whoami</TypedText>
            <TypedContent>
              <p>
                Hi, I&apos;m <strong>ZEVORN</strong>, in Chinese my name is{' '}
                <strong>泽文</strong>.
              </p>
              <p>
                I am a basic software development engineer with a focus on
                compilers, operating systems, and architecture simulation,
                Frequently used programming languages are C, C++, and python.
              </p>
            </TypedContent>
            <TypedText afterDelay={1000}>ls</TypedText>
            <TypedContent>
              <div className='grid grid-cols-2 gap-2 px-4 font-semibold text-sky-500'>
                <span>opensource</span>
                <span>projects</span>
                <span>contact</span>
              </div>
            </TypedContent>
            <TypedText afterDelay={700}>opensource</TypedText>
            <TypedContent>
              <p>
                I am passionate about contributing to the open-source community,
                several projects in the embedded field have been open sourced.
              </p>
            </TypedContent>
            <TypedText afterDelay={1000}>projects</TypedText>
            <TypedContent>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitee.com/gevico/antos'>AntOS</a>
                  </strong>
                </li>
                <li>A lightweight embedded real-time operating system.</li>
              </ul>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitee.com/gevico/mini-dso-pro'>
                      MiniDSO-Pro
                    </a>
                  </strong>
                </li>
                <li>Portable adjustable mini oscilloscope.</li>
              </ul>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitee.com/gevico/mcs51-ell'>MCS51-ELL</a>
                  </strong>
                </li>
                <li>High performance driver framework of STC8x MCU.</li>
              </ul>
              <ul>
                <li>
                  <strong>
                    <a href='https://gitee.com/gevico/freertos'>
                      FreeRTOS for MCS-251
                    </a>
                  </strong>
                </li>
                <li>The FreeRTOS is ported to MCS-251 MCU.</li>
              </ul>
            </TypedContent>
            <TypedText>Contact</TypedText>
            <TypedContent>
              <div className='my-4 flex items-center'>
                <p className='basis-1/4 text-center font-semibold'>Social</p>
                <div className='grid flex-1 grid-cols-2 justify-items-start gap-2'>
                  <a href='https://github.com/zevorn'>Github</a>
                  <a href='https://gitee.com/zevorn'>Gitee</a>
                  <a href='https://space.bilibili.com/483048140'>BiliBili</a>
                </div>
              </div>
              <div className='flex items-center'>
                <p className='basis-1/4 text-center font-semibold'>Email</p>
                <a href='mailto:zevorn@yeah.net'>zevorn@yeah.net</a>
              </div>
            </TypedContent>
          </Typed>
        </div>
      </main>
    </div>
  )
}

import { lazy } from 'react'

export { pre } from './pre'
export { Alert } from './alert'
export { Details } from './details'
export { default as Hello } from './hello'
export { InlineCode } from './inline-code'
export const CodeGroup = lazy(() => import('./code-group'))

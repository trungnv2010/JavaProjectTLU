import { ReactNode } from 'react'

export type TSidebarConfig = {
  title: string
  icon: ReactNode
  path?: string
  options?: {
    title: string
    icon?: string
    path?: string
  }[]
}

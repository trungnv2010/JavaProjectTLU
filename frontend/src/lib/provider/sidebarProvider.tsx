import { TChildProps } from '@/types'
import { createContext, useState } from 'react'

export interface TSidebarCollapse {
  collapse: boolean
  setCollapse: (collapse: boolean) => void
}

export const SidebarCollapseContext = createContext<TSidebarCollapse>({
  collapse: false,
  setCollapse: () => {}
})

export const SidebarProvider = ({ children }: TChildProps) => {
  const [collapse, setCollapse] = useState<boolean>(false)

  return <SidebarCollapseContext.Provider value={{ collapse, setCollapse }}>{children}</SidebarCollapseContext.Provider>
}

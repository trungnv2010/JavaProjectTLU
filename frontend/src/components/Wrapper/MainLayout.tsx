import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar'
import { useContext } from 'react'
import { SidebarCollapseContext } from '@/lib/provider/sidebarProvider'
import { cn } from '@/lib/utils'

const MainLayout = () => {
  const { collapse } = useContext(SidebarCollapseContext)
  return (
    <div className='mx-auto h-screen w-screen max-w-[1440px] flex-shrink-0 bg-inherit'>
      <Sidebar />
      <div className={cn('ml-[276px] p-4 duration-300', collapse && 'ml-[104px]')}>
        <Outlet />
      </div>
    </div>
  )
}
export default MainLayout

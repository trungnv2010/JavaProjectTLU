import { useContext } from 'react'
import Logo from '../element/Logo'
import sidebarConfig from './sidebarConfig'
import SidebarItem from './SidebarItem'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import UserNav from './UserNav'
import { t } from 'i18next'
import utilitiesConfig from './utilitiesConfig'
import SupportContact from './SupportContact'
import { SidebarCollapseContext } from '@/lib/provider/sidebarProvider'

const Sidebar = () => {
  const { collapse, setCollapse } = useContext(SidebarCollapseContext)

  const toggleSidebar = () => setCollapse(!collapse)

  return (
    <div
      className={cn(
        'fixed z-50 flex h-full w-[276px] flex-col rounded-[28px] border bg-card py-[22px] duration-300',
        collapse && 'w-[104px]'
      )}
    >
      <div className='px-[22px]'>
        <Logo collapsed={collapse} />
        <UserNav collapsed={collapse} />
      </div>
      <div className='flex-1 overflow-y-auto overflow-x-hidden px-[22px]'>
        <div
          className={cn('pb-1 pt-4 text-[11px] uppercase text-muted-foreground', !collapse ? 'pl-5' : 'text-center')}
        >
          {t('common.main')}
        </div>
        {sidebarConfig().map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapse} />
        ))}
        <div
          className={cn(
            'mt-4 border-t pb-1 pt-4 text-[11px] uppercase text-muted-foreground',
            !collapse ? 'pl-5' : 'text-center'
          )}
        >
          {t('common.utilities')}
        </div>
        {utilitiesConfig().map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapse} />
        ))}
        <SupportContact collapsed={collapse} />
      </div>
      <Button
        className='absolute -right-2.5 top-20 z-10 h-6 w-6 rounded-full bg-secondary p-0 text-primary/20 shadow'
        variant={'ghost'}
        size={'icon'}
        onClick={toggleSidebar}
      >
        {collapse ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </Button>
    </div>
  )
}
export default Sidebar

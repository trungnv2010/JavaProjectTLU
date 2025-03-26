import { TSidebarConfig } from '@/types/sidebar'
import { Link } from 'react-router-dom'
import CollapsibleItem from './CollapsibleItem'
import { cn } from '@/lib/utils'

type Props = {
  item: TSidebarConfig
  collapsed: boolean
}

const SidebarItem = ({ item, collapsed }: Props) => {
  switch (Boolean(item.options)) {
    case true:
      return <CollapsibleItem item={item} collapsed={collapsed} />
    default:
      return (
        <Link to={item.path!}>
          <div
            className={cn(
              'flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium text-secondary-foreground/70 hover:bg-[#2422200A] hover:text-primary',
              collapsed && 'justify-center'
            )}
          >
            <div className='h-6 w-6 flex-shrink-0'>{item.icon}</div>
            {!collapsed && <span className={cn('')}>{item.title}</span>}
          </div>
        </Link>
      )
  }
}
export default SidebarItem

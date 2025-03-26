import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { TSidebarConfig } from '@/types/sidebar'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from '../ui/dropdown-menu'

type Props = {
  item: TSidebarConfig
  collapsed: boolean
}

const CollapsibleItem = ({ item, collapsed }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full text-secondary-foreground/70'>
      <div className='relative z-10 flex items-center justify-between space-x-4 rounded-xl bg-card'>
        <CollapsibleTrigger asChild>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className={cn(
                  'flex h-14 w-full rounded-xl px-5 py-4 hover:bg-[#2422200A] [&_svg]:flex-shrink-0',
                  collapsed ? 'items-center' : 'justify-between'
                )}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <div className='gap-4 text-sm font-medium'>{item.title}</div>
                    <ChevronDown className='h-6 w-6' />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            {collapsed && (
              <DropdownMenuContent sideOffset={10} alignOffset={100} align='start' className='w-[176px]'>
                <DropdownMenuGroup>
                  {item.options?.map((option, index) => (
                    <Link to={option.path!} key={index}>
                      <div className={cn('rounded-md px-3.5 py-2 text-xs hover:bg-[#2422200A]')}>{option.title}</div>
                    </Link>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={cn('relative flex flex-col gap-2', !collapsed ? 'ml-[46px]' : 'ml-[40px]')}>
        {item.options?.map((option, index) => (
          <Link className='relative' to={option.path!} key={index}>
            <div
              className={cn(
                'overflow-hidden rounded-md px-3.5 py-2 text-xs hover:bg-[#2422200A]',
                collapsed && 'w-0 p-0'
              )}
            >
              {option.title}
            </div>
            <div className='absolute -left-5 -top-2 bottom-0 h-[calc(100%+20px)] w-[14px] -translate-y-1/2 rounded-bl-md border-b border-l'></div>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
export default CollapsibleItem

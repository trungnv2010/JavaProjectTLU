import { AuthContext } from '@/lib/provider/authProvider'
import { useContext } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { t } from 'i18next'
import { cn } from '@/lib/utils'

type Props = {
  collapsed: boolean
}

const UserNav = ({ collapsed }: Props) => {
  const { state } = useContext(AuthContext)

  return (
    <div className={cn('flex w-full items-center gap-3 border-b py-4', collapsed && 'justify-center')}>
      <Avatar className='h-12 w-12'>
        <AvatarImage src='https://github.com/shadcn.png' />
      </Avatar>
      {!collapsed && (
        <div>
          <p className='text-[11px] uppercase text-muted-foreground'>{t('ladingCode.customer')}</p>
          <p className='text-sm font-medium capitalize'>{state.auth.fullName}</p>
        </div>
      )}
    </div>
  )
}
export default UserNav

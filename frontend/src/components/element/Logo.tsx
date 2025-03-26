import { cn } from '@/lib/utils'
import { t } from 'i18next'

type Props = {
  collapsed?: boolean
}
const Logo = ({ collapsed = false }: Props) => {
  return (
    <div className={cn('flex items-center justify-start gap-1', collapsed && 'justify-center')}>
      <img width={27} height={27} src='/src/assets/logo.png' />
      {!collapsed && <span className='text-sm font-semibold'>{t('common.logo')}</span>}{' '}
    </div>
  )
}

export default Logo

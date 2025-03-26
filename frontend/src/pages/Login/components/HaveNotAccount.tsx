import { ROOT_ROUTES } from '@/common/constants/router'
import { t } from 'i18next'
import { Link } from 'react-router-dom'

const HaveNotAccount = () => {
  return (
    <div className='mt-6 flex items-center justify-center gap-1'>
      <span className='text-sm text-secondary-foreground'>{t('unAuth.haveNotAccount')}</span>
      <Link className='text-sm font-medium hover:underline' to={ROOT_ROUTES.REGISTER}>
        {t('unAuth.signUp')}
      </Link>
    </div>
  )
}
export default HaveNotAccount

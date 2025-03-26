import { ROOT_ROUTES } from '@/common/constants/router'
import { t } from 'i18next'
import { Link } from 'react-router-dom'

const HaveAccount = () => {
  return (
    <div className='mt-6 flex items-center justify-center space-x-1 text-sm'>
      <div className='text-secondary-foreground'>{t('unAuth.haveAccount')}</div>
      <Link to={ROOT_ROUTES.LOGIN} className='font-medium hover:underline'>
        {t('unAuth.login')}
      </Link>
    </div>
  )
}
export default HaveAccount

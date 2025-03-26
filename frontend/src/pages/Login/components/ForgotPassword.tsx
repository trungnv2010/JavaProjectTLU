import { t } from 'i18next'

const ForgotPassword = () => {
  return (
    <div className='flex items-center gap-1'>
      <span className='text-sm text-secondary-foreground'>{t('unAuth.forgotPassword')}</span>
      <span className='text-sm font-medium hover:underline'>{t('unAuth.changeNow')}</span>
    </div>
  )
}
export default ForgotPassword

import { Checkbox } from '@/components/ui/checkbox'
import { t } from 'i18next'

const RememberAccount = () => {
  return (
    <div className='flex items-center space-x-2'>
      <Checkbox id='account' />
      <label htmlFor='account' className='cursor-pointer text-sm font-medium'>
        {t('unAuth.rememberMe')}
      </label>
    </div>
  )
}
export default RememberAccount

import { ROOT_ROUTES } from '@/common/constants/router'
import { TSidebarConfig } from '@/types/sidebar'
import { t } from 'i18next'

const utilitiesConfig = (): TSidebarConfig[] => {
  return [
    {
      title: t('common.recharge'),
      icon: <img className='h-[22px] w-[22px] object-cover' src='/src/assets/payment.png' />,
      path: ROOT_ROUTES.ROOT
    },
    {
      title: t('common.servicePriceList'),
      icon: <img className='h-[22px] w-[22px] object-cover' src='/src/assets/service.png' />,
      path: ROOT_ROUTES.ROOT
    },
    {
      title: t('common.tradeHistory'),
      icon: <img className='h-[22px] w-[22px] object-cover' src='/src/assets/history.png' />,
      path: ROOT_ROUTES.ROOT
    }
  ]
}
export default utilitiesConfig

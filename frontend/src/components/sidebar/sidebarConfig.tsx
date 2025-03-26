import HomeIcon from '@/assets/HomeIcon'
import ShopeeIcon from '@/assets/ShopeeIcon'
import { ROOT_ROUTES } from '@/common/constants/router'
import { TSidebarConfig } from '@/types/sidebar'
import { t } from 'i18next'

const sidebarConfig = (): TSidebarConfig[] => {
  return [
    {
      title: t('common.home'),
      icon: <HomeIcon />,
      path: ROOT_ROUTES.ROOT
    },
    {
      title: t('common.shopeeService'),
      icon: <ShopeeIcon />,
      options: [
        { path: ROOT_ROUTES.ROOT, title: t('common.increaseFavoriteComments') },
        { path: ROOT_ROUTES.ROOT, title: t('common.increaseFollowers') },
        { path: ROOT_ROUTES.ROOT, title: t('common.increaseFavorites') }
      ]
    },
    {
      title: t('common.ladingCode'),
      icon: <img width={24} height={24} className='flex-shrink-0 object-cover' src='/src/assets/lading-code.png' />,
      path: ROOT_ROUTES.LADING_CODE
    },
    {
      title: t('common.changeLocation'),
      icon: <img width={24} height={24} className='flex-shrink-0 object-cover' src='/src/assets/change-location.png' />,
      path: ROOT_ROUTES.ROOT
    },
    {
      title: t('common.rentUnregisteredNumber'),
      icon: (
        <img width={24} height={24} className='flex-shrink-0 object-cover' src='/src/assets/unregister-number.png' />
      ),
      path: ROOT_ROUTES.ROOT
    },
    {
      title: t('common.orderRenew'),
      icon: <img width={24} height={24} className='flex-shrink-0 object-cover' src='/src/assets/order-renew.png' />,
      path: ROOT_ROUTES.ROOT
    }
  ]
}

export default sidebarConfig

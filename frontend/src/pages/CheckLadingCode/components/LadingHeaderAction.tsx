import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { QrCode } from 'lucide-react'
import ListCookie from './ListCookie'

const LadingHeaderAction = () => {
  return (
    <div className='flex items-center gap-4'>
      <Button className='rounded-lg px-4 py-1.5 font-bold' size={'sm'}>
        <QrCode size={20} />
        {t('button.qrCode')}
      </Button>
      <ListCookie />
    </div>
  )
}

export default LadingHeaderAction

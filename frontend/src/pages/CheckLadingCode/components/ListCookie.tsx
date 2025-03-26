import DataTable from '@/components/element/DataTable'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CookieContext } from '@/lib/provider/cookieProvider'
import { t } from 'i18next'
import { Cookie } from 'lucide-react'
import { useContext } from 'react'
import cookieTable from '../TableConfig/cookieTable'
import EnterCookie from './EnterCookie'

const ListCookie = () => {
  const { state } = useContext(CookieContext)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='rounded-lg px-4 py-1.5 font-bold' size={'sm'}>
          <Cookie size={20} />
          {t('ladingCode.cookie')}
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-[17px] sm:max-w-[917.15px]'>
        <DialogHeader>
          <div className='flex items-center justify-between pt-3'>
            <DialogTitle>{t('ladingCode.cookie')}</DialogTitle>
            <EnterCookie />
          </div>
        </DialogHeader>
        <DataTable data={state.cookies} columns={cookieTable()} />
      </DialogContent>
    </Dialog>
  )
}
export default ListCookie

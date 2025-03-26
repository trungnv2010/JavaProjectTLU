import { cookieApi } from '@/apis/cookieApi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CookieContext } from '@/lib/provider/cookieProvider'
import { t } from 'i18next'
import { Plus } from 'lucide-react'
import { useContext, useState } from 'react'

const EnterCookie = () => {
  const [open, setOpen] = useState(false)
  const [cookie, setCookie] = useState('')
  const { dispatch } = useContext(CookieContext)
  const handleAddCookie = async () => {
    try {
      const res = await cookieApi.addCookie(cookie)
      setCookie('')
      dispatch({ type: 'ADD', payload: res })
      setOpen(false)
    } catch (error) {
      return error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='rounded-lg px-4 py-1.5 font-bold' size={'sm'}>
          <Plus size={20} />
          {t('button.enterCookie')}
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-[17px] p-10 sm:max-w-[917.15px]'>
        <DialogHeader>
          <DialogTitle>{t('button.enterCookie')}</DialogTitle>
        </DialogHeader>
        <textarea
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          className='h-[183.6px] w-full resize-none rounded-[17px] border border-[#FF5630] px-4 py-2 text-sm outline-none'
          placeholder={t('ladingCode.enterCookieInHere')}
        />
        <DialogFooter>
          <Button className='font-bold' variant={'outline'} type='button'>
            {t('button.cancel')}
          </Button>
          <Button onClick={handleAddCookie} className='font-bold' type='button'>
            {t('ladingCode.checkTheLadingCode')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EnterCookie

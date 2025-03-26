import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TCookie } from '@/types/cookie'
import { t } from 'i18next'
import { useState } from 'react'

type Props = {
  cookie: TCookie
}

const ChangeCookieCol = ({ cookie }: Props) => {
  const [value, setValue] = useState(cookie.cookie)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='line-clamp-1 w-[200px]' variant='ghost'>
          {cookie.cookie}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-1! flex w-80 flex-col items-end gap-2'>
        <textarea className='h-[150px] w-full' value={value} onChange={(e) => setValue(e.currentTarget.value)} />
        <Button size={'sm'}>{t('button.update')}</Button>
      </PopoverContent>
    </Popover>
  )
}
export default ChangeCookieCol

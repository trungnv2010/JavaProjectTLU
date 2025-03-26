import { t } from 'i18next'
import { Button } from '../ui/button'
import { Headset } from 'lucide-react'

type Props = {
  collapsed: boolean
}

const SupportContact = ({ collapsed }: Props) => {
  if (collapsed)
    return (
      <div>
        <Button className='shadow-drop mt-5 h-12 w-12 rounded-[12px] bg-[#F07F19] font-semibold text-muted hover:bg-[#893027]'>
          <Headset size={24} />
        </Button>
      </div>
    )
  return (
    <div className='rounded-[28px] bg-muted p-4 pt-6'>
      <div className='text-center text-base font-semibold leading-[25px] tracking-wide'>
        {t('common.assistantCenter')}
      </div>
      <p className='text-center text-[13px] text-muted-foreground'>{t('common.subAssistantCenter')}</p>
      <Button
        variant={'default'}
        size={'lg'}
        className='shadow-drop mt-5 w-full rounded-[12px] bg-[#F07F19] font-semibold hover:bg-[#893027]'
      >
        {t('common.supportContact')}
      </Button>
    </div>
  )
}
export default SupportContact

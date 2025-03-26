import { t } from 'i18next'

type Props = {
  total: number
}

const ResultData = ({ total }: Props) => {
  return (
    <div className='mb-3 flex items-center gap-2 text-sm'>
      <span className='font-semibold'>{total}</span>
      <span className='text-muted-foreground'>{t('common.resultsFound')}</span>
    </div>
  )
}
export default ResultData

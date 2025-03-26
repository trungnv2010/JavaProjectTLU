import { t } from 'i18next'

type Props = {
  email: string
}

const VerifyEmail = ({ email }: Props) => {
  return (
    <div className='mt-14 flex flex-col gap-2'>
      <div className='text-sm'>{t('unAuth.email')}</div>
      <div className='rounded border px-4 py-3.5 text-sm'>{email}</div>
    </div>
  )
}
export default VerifyEmail

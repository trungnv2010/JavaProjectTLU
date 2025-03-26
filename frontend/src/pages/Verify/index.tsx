import Title from '@/components/element/Title'
import LayoutWrapper from '@/components/Wrapper/LayoutWrapper'
import { t } from 'i18next'
import VerifyEmail from './components/VerifyEmail'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const VerifyPage = () => {
  const [value, setValue] = useState('')

  return (
    <LayoutWrapper className='h-screen w-screen'>
      <div className='mx-auto flex h-full max-h-[917px] w-full max-w-[600px] flex-col items-center justify-center rounded-[20px] bg-card'>
        <img width={260} height={195} src='/src/assets/verify.png' />
        <div className='w-full max-w-[448px]'>
          <Title content={t('unAuth.verifyOTP')} />
          <div className='text-center text-sm text-secondary-foreground'>{t('unAuth.subVerify')}</div>
          <VerifyEmail email='phankien.epu@gmail.com' />
          <InputOTP value={value} onChange={setValue} maxLength={6}>
            <InputOTPGroup className='mt-6 flex w-full justify-between'>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot className='h-[50px] w-[50px] rounded border' key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button className='mt-7 w-full'>{t('unAuth.verifyCode')}</Button>
          <div className='mt-6 flex items-center justify-center gap-1 text-sm'>
            <span>{t('unAuth.haveNotCode')}</span>
            <button className='p-0 text-error hover:underline'>{t('unAuth.resend')}</button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default VerifyPage

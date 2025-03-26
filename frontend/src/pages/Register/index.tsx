import { Form } from '@/components/ui/form'
import LayoutWrapper from '@/components/Wrapper/LayoutWrapper'
import InputField from './components/InputField'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, TRegisterSchema } from '@/schema/auth'
import Title from '@/components/element/Title'
import HaveAccount from './components/HaveAccount'
import { authApi } from '@/apis/auth'
import { useState } from 'react'
import { Loader } from 'lucide-react'

const Register = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  })

  const onSubmit: SubmitHandler<TRegisterSchema> = async (data) => {
    setLoading(true)
    try {
      await authApi.register(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      return error
    }
  }

  return (
    <LayoutWrapper className='h-screen w-screen'>
      <div className='mx-auto flex h-full max-h-[917px] w-full max-w-[600px] flex-col items-center justify-center rounded-[20px] bg-card'>
        <div className='w-full max-w-[448px]'>
          <Title content={t('unAuth.signUp')} />
          <div className='text-center text-sm text-secondary-foreground'>{t('unAuth.subTitle')}</div>
          <Form {...form}>
            <form className='mt-[54px] flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col space-y-6'>
                <InputField label={t('unAuth.fullName')} control={form.control} name='fullName' />
                <InputField label={t('unAuth.email')} control={form.control} name='email' />
                <InputField type='password' label={t('unAuth.password')} control={form.control} name='password' />
                <InputField
                  type='password'
                  label={t('unAuth.confirmPassword')}
                  control={form.control}
                  name='confirmPassword'
                />
              </div>
              <Button className='mt-10 h-12 w-full rounded font-semibold' size={'lg'} type='submit'>
                {loading ? <Loader className='animate-spin' size={20} /> : t('unAuth.login')}
              </Button>
              <HaveAccount />
            </form>
          </Form>
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default Register

import Title from '@/components/element/Title'
import { zodResolver } from '@hookform/resolvers/zod'
import LayoutWrapper from '@/components/Wrapper/LayoutWrapper'
import { loginSchema, TLoginSchema } from '@/schema/auth'
import { t } from 'i18next'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import InputField from './components/InputField'
import RememberAccount from './components/RememberAccount'
import ForgotPassword from './components/ForgotPassword'
import HaveNotAccount from './components/HaveNotAccount'
import { authApi } from '@/apis/auth'
import { useContext, useState } from 'react'
import { Loader } from 'lucide-react'
import { AuthContext } from '@/lib/provider/authProvider'
import { localStorageAuthService } from '@/common/storages/auth-storages'

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { dispatch } = useContext(AuthContext)
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit: SubmitHandler<TLoginSchema> = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      localStorageAuthService.setAccessToken(res.accessToken)
      dispatch({
        type: 'LOGIN',
        payload: {
          accessToken: res.accessToken,
          auth: res.user
        }
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      return error
    }
  }
  return (
    <LayoutWrapper className='grid h-screen w-screen items-center'>
      <div className='mx-auto flex h-full max-h-[917px] w-full max-w-[600px] flex-col items-center justify-center rounded-[20px] bg-card'>
        <div className='w-full max-w-[448px] px-4 sm:px-0'>
          <Title content={t('unAuth.login')} />
          <div className='text-center text-sm text-secondary-foreground'>{t('unAuth.subTitle')}</div>
          <Form {...form}>
            <form className='mt-[54px] flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col space-y-6'>
                <InputField label={t('unAuth.email')} control={form.control} name='email' />
                <InputField label={t('unAuth.password')} control={form.control} name='password' />
              </div>
              <div className='mt-3 flex items-center justify-between'>
                <RememberAccount />
                <ForgotPassword />
              </div>
              <Button className='mt-10 h-12 w-full rounded font-semibold' size={'lg'} type='submit'>
                {loading ? <Loader size={20} className='animate-spin' /> : t('unAuth.login')}
              </Button>
              <HaveNotAccount />
            </form>
          </Form>
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default LoginPage

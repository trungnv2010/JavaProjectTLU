import { t } from 'i18next'

const LoadingScreen = () => {
  return (
    <div className='w-screen h-screen bg-center bg-no-repeat bg-[url(/src/assets/image.png)] flex flex-col items-center justify-center gap-8'>
      <img className='object-cover h-[195px] w-[195px]' src={'/src/assets/loading.gif'} />
      <span className='font-bold italic text-[36px] leading-9'>{t('common.appTitle')}</span>
    </div>
  )
}

export default LoadingScreen

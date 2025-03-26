import { cookieApi } from '@/apis/cookieApi'
import { Switch } from '@/components/ui/switch'
import { CookieContext } from '@/lib/provider/cookieProvider'
import { TCookie } from '@/types/cookie'
import { useContext, useEffect, useState } from 'react'

type Props = {
  cookie: TCookie
}

const SwitchCookieCol = ({ cookie }: Props) => {
  const [isUse, setIsUse] = useState<boolean>(false)
  const { dispatch } = useContext(CookieContext)

  useEffect(() => {
    setIsUse(cookie.isUsed)
  }, [cookie])

  const handleCheckedChange = async (input: boolean) => {
    try {
      const res = await cookieApi.useCookie(cookie._id, input)
      dispatch({ type: 'UPDATE', payload: res })
    } catch (error) {
      return error
    }
  }

  return <Switch checked={isUse} onCheckedChange={handleCheckedChange} />
}
export default SwitchCookieCol

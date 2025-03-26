import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TAccountShopee } from '@/types/cookie'

type Props = {
  user: TAccountShopee
}

const UserInfoCol = ({ user }: Props) => {
  const avatar = user.avatar ? user.avatar : 'src/assets/user_shopee.png'
  return (
    <div className='flex items-start gap-1'>
      <Avatar>
        <AvatarImage src={avatar} alt={user.username} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col text-sm'>
        <span>{user.username || '--'}</span>
        <span className='text-[#22C55E]'>{user.phone || '--'}</span>
        <span className='text-muted-foreground'>{user.email || '--'}</span>
      </div>
    </div>
  )
}
export default UserInfoCol

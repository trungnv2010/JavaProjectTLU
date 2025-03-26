import { IMG_SHOPEE_URL } from '@/common/constants'
import { formatVND } from '@/lib/utils/number'
import { TItemGroup } from '@/types/cookie'

type Props = {
  data: TItemGroup[]
}

const ExpandItems = ({ data }: Props) => {
  return (
    <div className='h-full w-full bg-inherit px-[18px] py-5'>
      <div className='shadow-expand rounded-lg bg-card text-sm'>
        {data.map((item) => (
          <div className='border-t border-dashed p-3 first:border-t-0'>
            {item.items.map((item) => (
              <div className='flex items-center justify-between border-t border-dashed p-3 first:border-t-0'>
                <div className='flex items-center gap-5'>
                  <img className='h-[59px] w-[59px] rounded-lg object-cover' src={IMG_SHOPEE_URL(item.image)} />
                  <div>
                    <div>{item.name}</div>
                    <div className='text-muted-foreground'>{item.model_name}</div>
                  </div>
                </div>
                <div className='flex items-center gap-x-14 text-muted-foreground'>
                  <div>x{item.amount}</div>
                  <div>{formatVND(item.order_price / 100000)}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
export default ExpandItems

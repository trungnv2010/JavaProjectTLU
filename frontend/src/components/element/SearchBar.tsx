import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean
  className?: string
}

const SearchBar = ({ isLoading, className = '', ...props }: Props) => {
  return (
    <div
      className={cn(
        'flex h-[54px] w-full items-center gap-2 rounded-lg border px-3.5 text-muted-foreground',
        className
      )}
    >
      <Search className='flex-shrink-0' size={24} />
      <input className='w-full text-[15px] leading-[22px] outline-none' {...props} />
    </div>
  )
}
export default SearchBar

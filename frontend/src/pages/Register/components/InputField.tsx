import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TRegisterSchema } from '@/schema/auth'
import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { Control } from 'react-hook-form'

type Props = {
  control: Control<TRegisterSchema>
  name: keyof TRegisterSchema
  placeholder?: string
  label?: string
} & React.ComponentProps<'input'>

const InputField = ({ control, name, placeholder, label, type = 'text', ...props }: Props) => {
  const [hidden, setHidden] = useState<boolean>(true)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel className='font-medium capitalize'>{label}</FormLabel>}
          <div className='relative overflow-hidden'>
            <FormControl>
              <Input
                type={type === 'password' ? (hidden ? 'password' : 'text') : 'text'}
                className={cn('h-12 rounded px-4 py-3.5 outline-none', fieldState.error && 'border-error')}
                {...field}
                {...props}
                placeholder={placeholder}
              />
            </FormControl>
            {type === 'password' && (
              <Button
                onClick={() => setHidden(!hidden)}
                type='button'
                variant={'ghost'}
                className='absolute right-[1px] top-1/2 h-11 -translate-y-1/2'
              >
                {hidden ? <Eye className='' size={20} /> : <EyeClosed size={20} />}
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputField

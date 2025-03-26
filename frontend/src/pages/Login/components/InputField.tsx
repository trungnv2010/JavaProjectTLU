import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TLoginSchema } from '@/schema/auth'
import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { Control } from 'react-hook-form'

type Props = {
  control: Control<TLoginSchema>
  name: keyof TLoginSchema
  placeholder?: string
  label?: string
}

const InputField = ({ control, name, placeholder, label }: Props) => {
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
                type={name === 'password' ? (hidden ? 'password' : 'text') : 'text'}
                className={cn('h-12 rounded px-4 py-3.5 outline-none', fieldState.error && 'border-error')}
                {...field}
                placeholder={placeholder}
              />
            </FormControl>
            {name === 'password' && (
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

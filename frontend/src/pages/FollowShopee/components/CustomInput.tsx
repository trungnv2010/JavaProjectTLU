import { useState } from 'react'

type Props = {
  title?: string
  subTitle?: string
  placeholder?: string
}

export default function CustomInput({ title, subTitle, placeholder }: Props) {
  const [value, setValue] = useState('')

  return (
    <div className='flex flex-col space-y-2'>
      <label className='font-semibold text-black'>{title}</label>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className='rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      {value && <p className='flex items-center text-sm text-red-500'>{subTitle}</p>}
    </div>
  )
}

import { useState } from 'react'

export default function CustomCheckbox() {
  const [checked, setChecked] = useState(false)

  return (
    <label className='flex cursor-pointer items-center'>
      <input type='checkbox' checked={checked} onChange={() => setChecked(!checked)} className='hidden' />
      <span
        className={`mr-2 flex h-6 w-6 items-center justify-center rounded-md border-2 ${
          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
        }`}
      >
        {checked && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        )}
      </span>
    </label>
  )
}

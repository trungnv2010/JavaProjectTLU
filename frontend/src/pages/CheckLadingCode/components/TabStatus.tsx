import { TOption } from '@/types'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export interface Props {
  className?: string
  tabs: TOption[]
  defaultActiveTabIndex?: number
  onChange: (value: string) => void
}

const TabsStatus = ({ tabs, defaultActiveTabIndex = 0, onChange }: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[defaultActiveTabIndex].value)

  useEffect(() => {
    onChange(activeTab)
  }, [activeTab])

  return (
    <nav className='flex flex-wrap items-center gap-x-5 border-b px-5'>
      {tabs.map((tab) => (
        <Button
          type='button'
          variant={'ghost'}
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`relative h-12 text-sm font-medium transition-colors hover:bg-inherit ${
            activeTab === tab.value ? '' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <span className='flex items-center gap-2'>{tab.label}</span>
          {activeTab === tab.value && (
            <motion.div
              className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
              layoutId='activeTab'
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30
              }}
            />
          )}
        </Button>
      ))}
    </nav>
  )
}
export default TabsStatus

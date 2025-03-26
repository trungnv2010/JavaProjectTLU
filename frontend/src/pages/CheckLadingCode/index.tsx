import PageTitle from '@/components/element/PageTitle'
import { t } from 'i18next'
import FilterOption from './components/FilterOption'
import { useForm, FormProvider } from 'react-hook-form'
import { ladingCodeSFilterSchema, TLadingCodeFilterSchema } from '@/schema/ladingCode'
import { zodResolver } from '@hookform/resolvers/zod'
import ResultFilter from './components/ResultFilter'
import ResultData from './components/ResultData'
import { useContext, useEffect, useReducer, useState } from 'react'
import { CookieContext } from '@/lib/provider/cookieProvider'
import { shopeApi } from '@/apis/shope'
import ladingCodeReducer, { initialState } from '@/lib/reducer/ladingCodeReducer'
import DataTable from '@/components/element/DataTable'
import ladingCodeTable from './TableConfig/ladingCodeTable'
import { TParams } from '@/types/table'
import ExpandItems from './components/ExpandItems'
import { TLadingCode } from '@/types/cookie'
import LadingHeaderAction from './components/LadingHeaderAction'

const CheckLadingCode = () => {
  const methods = useForm<TLadingCodeFilterSchema>({
    resolver: zodResolver(ladingCodeSFilterSchema),
    defaultValues: {
      status: 'all'
    }
  })

  const [pagination, setPagination] = useState<TParams>({ page: 1, limit: 10 })
  const { state } = useContext(CookieContext)
  const [{ ladingList }, dispatch] = useReducer(ladingCodeReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [listSelected, setListSelected] = useState<TLadingCode[]>([])

  useEffect(() => {
    const cookieUsed = state.cookies.filter((item) => item.isUsed)
    if (cookieUsed.length === 0) {
      return
    }
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await shopeApi.getListLadingCode({
          ids: cookieUsed.map((item) => item._id),
          limit: pagination.limit,
          offset: pagination.page
        })
        dispatch({ type: 'GET_ALL', payload: res })
      } catch (error) {
        return error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [state.cookies, pagination])

  const handleCancelOrder = () => {
    console.log('Cancel order', listSelected)
  }

  return (
    <FormProvider {...methods}>
      <div className='mb-10 flex items-center justify-between'>
        <PageTitle content={t('ladingCode.ladingCode')} />
        <LadingHeaderAction />
      </div>
      <div className='flex flex-col gap-5 rounded-2xl border bg-card px-5 shadow-card'>
        <FilterOption />
        {ladingList.length > 0 && <ResultData total={ladingList.length} />}
        <ResultFilter onCancelOrder={handleCancelOrder} />
        <DataTable
          loading={loading}
          total={1000}
          pagination={pagination}
          className='h-[500px] [&_tbody>tr]:h-[104px]'
          data={ladingList}
          columns={ladingCodeTable()}
          setPagination={setPagination}
          renderSubComponent={(data) => <ExpandItems data={data.orders.product_info.item_groups} />}
          getRowsSelected={setListSelected}
        />
      </div>
    </FormProvider>
  )
}
export default CheckLadingCode

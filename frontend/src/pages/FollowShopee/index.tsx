import React, { useState } from 'react'
import ToggleButton from './components/ToggleButton'
import CustomCheckbox from './components/CustomCheckbox'
import CustomInput from './components/CustomInput'

const FollowShopee = () => {
  const [text, setText] = useState('')

  return (
    <div className='mx-auto min-h-screen max-w-6xl overflow-y-auto bg-gray-100 p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h1 className='mb-4 text-2xl font-bold'> TĂNG THEO DÕI - FOLLOW SHOPEE </h1>
        </div>
        <button className='rounded-lg border border-black px-4 py-2 text-sm text-black'>Lịch sử Order</button>
      </div>
      <nav className='mb-4 text-sm text-gray-500'>
        <span className='mr-2 text-base font-medium text-black'>Shopee</span> &#8226;{' '}
        <span className='ml-2 text-base'>Tăng theo dõi - Follow shopee</span>
      </nav>
      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-2'>
          <div className='mb-6 rounded-lg bg-white p-6 shadow'>
            <div className='flex items-center'>
              <h2 className='mr-3 font-medium'>Mua nhiều đơn: </h2>
              <ToggleButton />
            </div>
            <div className='mt-6'>
              <h2 className='mb-3 mr-3 font-medium'>Nhập link Shopee: </h2>
              <input
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Nhập đầy đủ link Shopee'
                className='w-5/6 rounded-md border border-inherit p-2'
              />
            </div>
            <div className='mt-6'>
              <h2 className='mb-3 mr-3 font-medium'>Loại follow: </h2>
              <div className='flex items-center gap-2'>
                <div className='rounded-full bg-green-400 p-2 text-sm text-white'>Đang hoạt động</div>
                <CustomCheckbox />
                <span>
                  <span className='mr-1 font-bold text-red-600'>Tăng lượt Follow Shopee SV5</span>
                  <span className='font-normal text-black'>(Ổn định + Giá rẻ)</span>
                </span>
              </div>
            </div>
            <div className='mt-6 rounded-md bg-[#FFF7F1] p-3'>
              <h2>
                Mã gói: <span className='text-red-500'>98249</span>
              </h2>
              <ul className='mt-2 list-inside list-disc text-gray-600'>
                <li>Tối thiểu/Tối đa: 50-10.000 Order đơn hoàn thành được lên đơn tiếp theo</li>
                <li>Tài nguyên Profile Vn</li>
              </ul>
            </div>
            <div className='mt-6'>
              <CustomInput
                title='Số lượng cần tăng:'
                subTitle='Lưu ý: Có thể Buff dư thêm 10-20% trên tổng số lượng để tránh tụt giảm chút ít '
              />
            </div>
            <div className='mt-6'>
              <CustomInput
                title='Giá tiền/1 theo dõi:'
                subTitle='Mẹo nhỏ cho bạn: Hệ thống ưu tiên chạy các job giá cao trước nên nếu bạn cần gấp thì có thể set giá job mình cao hơn 1 vài đồng để chạy nhanh nhất có thể'
              />
            </div>
            <div className='mt-6'>
              <CustomInput title='Ghi chú' placeholder='Nhập ghi chú về Order của bạn để tiện theo dõi' />
            </div>
          </div>
        </div>

        <div className='grid-col-3 grid gap-6'>
          <div className='rounded-lg bg-white p-4 shadow'>
            <h2 className='mb-3 font-semibold text-red-600'>Quý khách hàng xin lưu ý:</h2>
            <ul className='space-y-3 text-gray-700'>
              <li className='flex items-start'>
                <img className='mr-2 h-5 w-5 object-cover' src={'/src/assets/no.png'} />
                <span>
                  Không cài 2 đơn cùng 1 Link (ID) tại 1 thời điểm. Vui lòng đợi đơn cũ chạy xong để tránh bị thiếu.
                </span>
              </li>
              <li className='flex items-start'>
                <img className='mr-2 h-5 w-5 object-cover' src={'/src/assets/no.png'} />
                <span>Không đổi URL của Shopee trong quá trình chạy, có tính hệ thống sẽ không xử lý.</span>
              </li>
              <li className='flex items-start'>
                <img className='mr-2 h-5 w-5 object-cover' src={'/src/assets/no.png'} />
                <span>Không hủy đơn khi đã thực hiện Order thành công.</span>
              </li>
              <li className='flex items-start'>
                <img className='mr-2 h-5 w-5 object-cover' src={'/src/assets/order.png'} />
                <span>
                  Đơn sẽ lên ngay khi order, nếu hệ thống quá tải đơn sẽ bắt đầu trong 0-24h. Trường hợp cần lên đơn
                  nhanh, quý khách vui lòng liên hệ trực tiếp qua Zalo để được support nhanh nhất.
                </span>
              </li>
            </ul>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='rounded-lg bg-[#FFF7F1] p-6 shadow'>
              <div className='flex items-center justify-center'>
                <img className='mr-2 h-6 w-6 object-cover' src={'/src/assets/money.png'} />
                <p className='font-semibold text-red-600'>Tổng tiền: 56,899 VND</p>
              </div>
              <p className='mt-2 justify-center text-sm font-semibold'>
                Buff 400 Follow với giá 10000 đ/ 1 Follow Shopee
              </p>
            </div>

            <div className='flex items-center justify-center rounded-lg bg-black p-3'>
              <p className='text-white'>Xác nhận Order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowShopee

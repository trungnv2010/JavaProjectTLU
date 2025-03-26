import React from 'react';

const OrderDetails = () => {
    const order = {
        id: '#002859',
        Ordercode: "02942jh52PHIMDSE",
        products: [
            { name: 'Urban Explorer Sneakers', sku: '16H9UR6', quantity: 2, price: 600000 },
            { name: 'Classic Leather Loafers', sku: '16H9UR6', quantity: 1, price: 250000 },
            { name: 'Mountain Trekking Boots', sku: '16H9UR6', quantity: 1, price: 250000 },
        ],
        get total() {
            return this.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        },
        shippingFee: 30000,
        discount: -100000,
        tax: 150000,
        get grandTotal() {
            return this.total + this.shippingFee + this.discount + this.tax;
        },
        account: {
            name: 'Võ Thị Thu Thúy',
            email: 'thuyvothithu330884@gmail.com',
            phone: '0982579396',
        },
        shipping: {
            method: 'Standard Express',
            trackingNumber: 'SPX037739199373',
        },
        recipient: {
            name: 'Võ Thị Thu Thúy',
            address: '123 Châu Thị Vĩnh Tế, Ngô Hành Sơn, Đà Nẵng',
            phone: '0919429949',
        },
        paymentMethod: 'Credit Card',
        history: [
            { status: 'Đơn hàng sẽ sớm được giao', time: '12 THI 1145' },
            { status: 'Đơn hàng đã đến kho phân loại', time: '12 THI 1030' },
            { status: 'Đơn vị vận chuyển lấy hàng thành công', time: '11 THI 1200' },
            { status: 'Người gửi đang chuẩn bị hàng', time: '11 THI 1145' },
            { status: 'Đơn hàng đã được đặt', time: '10 THI 1030' },
        ],
        timestamps: {
            orderTime: '12 Aug 2022 10:00 PM',
            paymentTime: '11 Aug 2022 8:00 PM',
            pickupTime: '10 Aug 2022 8:00 PM',
            completionTime: '09 Aug 2022 7:00 PM',
        },
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold mb-4">  Chi tiết đơn hàng <span className="text-blue-500">{order.id}</span></h1>
                    <span className="text-sm font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">Chờ xác nhận</span>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
                    &#8856; Cancel Order
                </button>
            </div>
            <nav className="text-sm text-gray-500 mb-4">
                <span>Dashboard</span> &gt; <span>Check mã vận đơn</span> &gt; <span className="text-gray-900 font-semibold">Chi tiết đơn hàng</span>
            </nav>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold mb-4">Details</h2>
                        <p >Hoang Anh Shop</p>
                        {order.products.map((product, index) => (
                            <div key={index} className="flex justify-between border-b py-3">
                                <div className="flex items-center gap-4">
                                    <img src="" alt="" className="w-12 h-12 object-cover rounded-lg" />
                                </div>
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                </div>
                                <p className="text-sm">x{product.quantity}</p>
                                <p className="text-sm font-semibold">{product.price.toLocaleString()} VND</p>
                            </div>
                        ))}
                        <div className="mt-4 text-right">
                            <div className="grid grid-cols-2 gap-x-1 gap-y-1">
                                <p>Tổng tiền hàng: </p>
                                <p>{order.total.toLocaleString()} VND</p>
                                <p>Phí ship: </p>
                                <p>{order.shippingFee.toLocaleString()} VND</p>
                                <p>Giảm giá: </p>
                                <p>{order.discount.toLocaleString()} VND</p>
                                <p>Thuế:</p>
                                <p> {order.tax.toLocaleString()} VND</p>
                                <p className="font-bold text-lg">Tổng cộng: </p>
                                <p className="font-bold text-lg ">{order.grandTotal.toLocaleString()} VND</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow mt-6">
                        <h2 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h2>
                        <ul className="border-l-4 border-blue-500 pl-4">
                            {order.history.map((event, index) => (
                                <li key={index} className="mb-3">
                                    <p className="font-medium">{event.status}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-col-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow  ">
                        <button className="text-gray-500 flex items-center gap-1 text-sm ml-auto relative top-3 border border-gray-300 rounded px-2 ">
                            SAO CHÉP
                        </button>
                        <h2 className="text-lg font-semibold mb-2">Mã đơn hàng</h2>
                        <div className="flex justify-between items-center">
                            <p className='text-sm text-gray-500'>Mã đơn hàng</p>
                            <p>{order.Ordercode}</p>

                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Thông tin tài khoản</h2>
                            <div className="flex items-center gap-4">
                                <img src="" className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-medium">{order.account.name}</p>
                                    <p className="text-sm text-gray-500">{order.account.email}</p>
                                    <p className="text-sm text-green-500 font-semibold">{order.account.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Thông tin vận chuyển</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <p className='text-sm text-gray-500'>Ship by:</p>
                                <p className='text-sm'>{order.shipping.method}</p>
                                <p className='text-sm text-gray-500'>Mã tracking:</p>
                                <p className='text-sm underline'>{order.shipping.trackingNumber}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Thông tin nhận hàng</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <p className='text-sm text-gray-500'>Họ và tên:</p>
                                <p className='text-sm'>{order.recipient.name}</p>
                                <p className='text-sm text-gray-500'>Địa chỉ:</p>
                                <p className='text-sm'>{order.recipient.address}</p>
                                <p className='text-sm text-gray-500'>Số điện thoại:</p>
                                <p className='text-sm'>{order.recipient.phone}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Thanh toán</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <p className='text-sm text-gray-500'>Phương thức:</p>
                                <p className='text-sm'> {order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
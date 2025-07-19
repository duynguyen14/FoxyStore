import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../CartShopping/CheckoutSteps';
import AddressSection from './AddressSection';
import OrderSummary from './OrderSummary';
import ListProduct from './ListProduct';
import { request } from '../../../untils/request';
import AddressFormModal from '../Address/AddressFormModal';
import ListAddressPopUp from '../../../components/Popups/ListAddressPopUp';
import { order } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const data = JSON.parse(localStorage.getItem("cart") || "[]")
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  const token = localStorage.getItem('token');

  const [products, setProducts] = useState(data);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [productSizeDTOs, setProductSizeDTOs] = useState([]);

  // Tạo DTOs cho productSize
  useEffect(() => {
    const dtos = products.map(item => ({
      productSizeId: item.productSizeId,
      sizeName: item.sizeName,
      quantity: item.quantity,
    }));
    setProductSizeDTOs(dtos);
  }, [products]);

  // Fetch addresses khi component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await request.get('address', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addrs = response.data.result || [];
        setAddresses(addrs);

        // Chọn địa chỉ mặc định hoặc đầu tiên
        if (addrs.length > 0) {
          const defaultAddr = addrs.find(addr => addr.isDefault === true) || addrs[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
      }
    };

    if (token) {
      fetchAddresses();
    }
  }, [token]);

  // Xử lý tạo đơn hàng khi có responseCode = "00" và đã có địa chỉ chọn
  useEffect(() => {
    const createOrder = async () => {
      try {
        if (!selectedAddress) return;
        if (responseCode === '00') {
          const response = await request.post('bill/create',
            {
              productSizeDTOs,
              addressId: selectedAddress.id,
              paymentMethod: "QR",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          alert('Đặt hàng thành công!');
          navigate('/ordermanagement');
          localStorage.removeItem("cart");
          dispatch(order())
        }
      } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
      }
    };

    createOrder();
  }, [responseCode, selectedAddress, productSizeDTOs, selectedPaymentMethod, token, navigate]);

  // Thêm địa chỉ mới
  const handleAddAddress = async (newAddress) => {
    try {
      const response = await request.post('address', newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Thêm địa chỉ thành công');
      const updatedAddresses = response.data.result || [];
      setAddresses(updatedAddresses);
      setSelectedAddress(updatedAddresses[0]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
    }
  };

  // Tính tổng tiền
  const total = () => {
    return products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  };

  // Xử lý đặt hàng khi người dùng nhấn nút
  const handleOnclickOrder = async () => {
    if (!window.confirm('Xác nhận đơn đặt hàng')) return;
    if(!selectedAddress){
      alert("Bạn phải thiết lập địa chỉ trước khi đặt hàng");
      return;
    }
    try {
      if (selectedPaymentMethod === 'COD') {
        const response = await request.post('bill/create',
          {
            productSizeDTOs,
            addressId: selectedAddress.id,
            paymentMethod: selectedPaymentMethod,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert('Đặt hàng thành công');
        localStorage.removeItem("cart");
        navigate('/ordermanagement');
        dispatch(order())
      } else if (selectedPaymentMethod === 'QR') {
        const amount = total();
        const response = await request.post('bill/create/payment',
          {
            amount,
            language: 'vn',
            bankCode: 'NCB',
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTimeout(() => {
          window.location.href = response.data.result.url;
        }, 500);
      } else if (selectedPaymentMethod === 'BANK') {
        // Xử lý thanh toán chuyển khoản ngân hàng nếu có thêm logic
        alert('Chức năng thanh toán bằng tài khoản ngân hàng đang phát triển.');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
    }
  };

  // Xử lý chọn địa chỉ trong popup
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowSelectModal(false);
  };

  // Component hiển thị phương thức thanh toán
  // Component hiển thị phương thức thanh toán với UI cải tiến
  const PaymentMethodSection = () => {
    const paymentMethods = [
      {
        id: 'COD',
        name: 'Thanh toán khi nhận hàng',
        description: 'Thanh toán bằng tiền mặt khi nhận được hàng tại địa chỉ giao hàng',
        icon: '💵',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-700',
        iconBg: 'bg-yellow-100'
      },
      {
        id: 'QR',
        name: 'Thanh toán bằng QR Code',
        description: 'Quét mã QR để thanh toán nhanh chóng qua ví điện tử (MoMo, ZaloPay, VietQR)',
        icon: '📱',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        iconBg: 'bg-blue-100'
      },
      {
        id: 'BANK',
        name: 'Chuyển khoản ngân hàng',
        description: 'Chuyển khoản trực tiếp qua tài khoản ngân hàng của cửa hàng',
        icon: '🏦',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        iconBg: 'bg-green-100'
      },
    ];

    const getNotificationContent = () => {
      switch (selectedPaymentMethod) {
        case 'QR':
          return {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            icon: '💡',
            title: 'Thông tin thanh toán QR Code',
            content: 'Sau khi đặt hàng, bạn sẽ được chuyển hướng đến trang thanh toán và nhận mã QR để thanh toán qua các ví điện tử phổ biến.'
          };
        case 'BANK':
          return {
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            icon: '📧',
            title: 'Thông tin chuyển khoản',
            content: 'Thông tin tài khoản ngân hàng và hướng dẫn chuyển khoản sẽ được gửi qua email ngay sau khi đặt hàng thành công.'
          };
        case 'COD':
          return {
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-800',
            icon: '⚠️',
            title: 'Lưu ý thanh toán COD',
            content: 'Vui lòng chuẩn bị đúng số tiền khi nhận hàng. Nhân viên giao hàng sẽ không có tiền thối.'
          };
        default:
          return null;
      }
    };

    const notification = getNotificationContent();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-2xl">💳</span>
            Phương thức thanh toán
          </h3>
          <p className="text-sm text-gray-600 mt-1">Chọn cách thức thanh toán phù hợp với bạn</p>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div
                key={method.id}
                className={`
                relative rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md
                ${selectedPaymentMethod === method.id
                    ? `${method.borderColor} ${method.bgColor} shadow-md`
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                  }
              `}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start space-x-4">
                    {/* Radio Button */}
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                    </div>

                    {/* Icon */}
                    <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl
                    ${selectedPaymentMethod === method.id ? method.iconBg : 'bg-gray-200'}
                  `}>
                      {method.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <h4 className={`
                          text-base sm:text-lg font-semibold mb-1
                          ${selectedPaymentMethod === method.id ? method.textColor : 'text-gray-800'}
                        `}>
                            {method.name}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {method.description}
                          </p>
                        </div>

                        {/* Selected Indicator */}
                        {selectedPaymentMethod === method.id && (
                          <div className="mt-2 sm:mt-0 sm:ml-4">
                            <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${method.bgColor} ${method.textColor} border ${method.borderColor}
                          `}>
                              ✓ Đã chọn
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Border Effect */}
                {selectedPaymentMethod === method.id && (
                  <div className={`absolute inset-0 rounded-lg border-2 ${method.borderColor} pointer-events-none`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Method Notification */}
          {notification && (
            <div className={`
            mt-6 p-4 rounded-lg border transition-all duration-300
            ${notification.bgColor} ${notification.borderColor}
          `}>
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{notification.icon}</span>
                <div className="flex-1">
                  <h5 className={`font-semibold text-sm mb-1 ${notification.textColor}`}>
                    {notification.title}
                  </h5>
                  <p className={`text-sm leading-relaxed ${notification.textColor}`}>
                    {notification.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-500">🔒</span>
            <span>Thông tin thanh toán của bạn được bảo mật an toàn</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lg:flex border-y-[1px] border-gray-300 py-10">
      <div className="lg:basis-[70%] lg:pr-3">
        <CheckoutSteps currentStep={2} />
        <AddressSection
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectOther={() => setShowSelectModal(true)}
          handleAddAddress={handleAddAddress}
          setShowAddModal={setShowAddModal}
        />

        <PaymentMethodSection />

        <div className="my-5">
          <ListProduct products={products} />
        </div>
      </div>

      <div className="lg:basis-[30%]">
        <OrderSummary total={total} />
        <button
          className="w-full btn-secondary text-lg py-3 shadow-md my-5"
          onClick={handleOnclickOrder}
        >
          HOÀN THÀNH
        </button>
      </div>

      {showAddModal && (
        <AddressFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddAddress}
        />
      )}

      {showSelectModal && (
        <ListAddressPopUp
          addresses={addresses}
          onClose={() => setShowSelectModal(false)}
          onSelect={handleSelectAddress}
        />
      )}
    </div>
  );
}

export default Order;

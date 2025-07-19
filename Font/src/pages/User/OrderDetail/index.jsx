import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { request } from "../../../untils/request";
import { Package, MapPin, Phone, User, Calendar, CreditCard, X, AlertCircle, Truck } from "lucide-react";
import { header } from "framer-motion/client";

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + "₫";
    };

    useEffect(() => {
        if (!id) {
            setError("Không tìm thấy mã đơn hàng.");
            setLoading(false);
            return;
        }

        const fetchOrderDetail = async () => {
            try {
                const response = await request.get(`bill/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                setOrder(response.data.result);
                setLoading(false);
                // console.log(response.data.result.bill.status);
                // console.log(getStatusColor(response.data.result.bill.status))
                // console.log(getStatusColor("Đã hủy"))
            } catch (err) {
                setError("Lỗi khi lấy thông tin đơn hàng.");
                setLoading(false);
                console.log("error", err);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Chờ xác nhận":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Đã xác nhận":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Đang giao":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "Đã giao":
                return "bg-green-100 text-green-800 border-green-200";
            case "Đã huỷ":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleCancelOrder = async () => {
        try {
            if (!window.confirm("Bạn xác nhận huỷ đơn hàng này")) {
                return;
            }
            const response = await request.patch(`bill/detail/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            alert("huỷ đơn hàng thành công")
            setOrder(prev => ({
                ...prev,
                bill: {
                    ...prev.bill,
                    status: "Đã huỷ"
                }
            }));
        }
        catch (e) {
            console.log("error ", e)
        }
        // Handle cancel order logic here
        // console.log("Cancel order", id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
                </div>
            </div>
        );
    }

    const { address, bill, products } = order;

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                            <Package className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                                <p className="text-sm text-gray-500">#{id}</p>
                            </div>
                        </div>
                        <div className=" items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bill.status)}`}>
                                {bill.status}
                            </span>
                            {bill.status === "Chờ xác nhận" && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delivery Address */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <MapPin className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Địa chỉ giao hàng</h3>
                            </div>
                            <div className="space-y-1 text-sm text-gray-700">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{address.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{address.phoneNumber}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <span>{address.detailAddress}, {address.city}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Thông tin đơn hàng</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="font-semibold text-lg text-blue-600">{formatPrice(bill.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <Truck className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Sản phẩm đã đặt</h2>
                    </div>

                    {/* Products Header - Desktop only */}
                    <div className="hidden md:grid grid-cols-12 gap-4 pb-4 mb-4 border-b border-gray-200">
                        <div className="col-span-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Sản phẩm</div>
                        <div className="col-span-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wide">Số lượng</div>
                        <div className="col-span-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wide">Đơn giá</div>
                        <div className="col-span-2 text-right text-sm font-medium text-gray-500 uppercase tracking-wide">Thành tiền</div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={index} className=" rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Product Info */}
                                    <div className="md:col-span-6">
                                        <div className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`http://localhost:8080/images/${product.images[0]}.png`}
                                                    alt={product.productName}
                                                    className="w-20 h-20 md:w-44 md:h-56 object-cover rounded-md border border-gray-200"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-medium text-gray-900 mb-1">
                                                    {product.productName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Size: <span className="font-medium">{product.sizeName}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between md:justify-center items-center">
                                            <span className="text-sm text-gray-500 md:hidden">Số lượng:</span>
                                            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                                                {product.quantity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between md:justify-center items-center">
                                            <span className="text-sm text-gray-500 md:hidden">Đơn giá:</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between md:justify-end items-center">
                                            <span className="text-sm text-gray-500 md:hidden">Thành tiền:</span>
                                            <span className="text-base font-semibold text-blue-600">
                                                {formatPrice(product.price * product.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
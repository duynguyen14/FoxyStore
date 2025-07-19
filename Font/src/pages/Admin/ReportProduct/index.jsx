import React, { useState, useEffect } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Package, TrendingUp, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';
 import { request } from "../../../untils/request";

const ReportsDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [detailedRevenueData, setDetailedRevenueData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllReports();
  }, [dateRange]);

  // Lấy token từ localStorage (hoặc nơi bạn lưu)
  const token = localStorage.getItem("token");

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchInventoryReport(),
        fetchRevenueReport(),
        fetchDetailedRevenueReport(),
        fetchSummary()
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
    setLoading(false);
  };

  const fetchInventoryReport = async () => {
    try {
      const data = await request.get(`/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInventoryData(data.data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    }
  };

  const fetchRevenueReport = async () => {
    try {
      const data = await request.get(`/revenue`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRevenueData(data.data);
    } catch (error) {
      console.error('Error fetching revenue report:', error);
    }
  };

  const fetchDetailedRevenueReport = async () => {
    try {
      const data = await request.get(`/revenue/detail`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDetailedRevenueData(data.data);
    } catch (error) {
      console.error('Error fetching detailed revenue report:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await request.get(`/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSummary(data.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const downloadInventoryReport = async () => {
    try {
      const response = await request.get(`/inventory/export`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bao-cao-ton-kho.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading inventory report:', error);
    }
  };

  const downloadRevenueReport = async () => {
    try {
      const response = await request.get(`/revenue/export`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        },
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bao-cao-doanh-thu.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading revenue report:', error);
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'OUT_OF_STOCK': return 'text-red-600 bg-red-100';
      case 'LOW_STOCK': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM_STOCK': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH_STOCK': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'OUT_OF_STOCK': return 'Hết hàng';
      case 'LOW_STOCK': return 'Sắp hết';
      case 'MEDIUM_STOCK': return 'Vừa phải';
      case 'HIGH_STOCK': return 'Nhiều';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const stockStatusData = inventoryData.reduce((acc, item) => {
    const status = getStockStatusText(item.stockStatus);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(stockStatusData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  // Hàm cắt ngắn tên sản phẩm nếu quá dài
  const truncate = (str, n = 16) => (str && str.length > n ? str.slice(0, n) + '…' : str);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo quản lý cửa hàng</h1>
          <p className="text-gray-600">Tổng quan về tồn kho và doanh thu</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-3xl font-bold text-gray-900">{summary.totalProducts || 0}</p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
                <p className="text-3xl font-bold text-orange-600">{summary.lowStockProducts || 0}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu 30 ngày</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalRevenue30Days || 0)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đơn hàng 30 ngày</p>
                <p className="text-3xl font-bold text-purple-600">{summary.totalOrders30Days || 0}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={downloadInventoryReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Xuất báo cáo tồn kho</span>
              </button>
              <button
                onClick={downloadRevenueReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Xuất báo cáo doanh thu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
                { id: 'inventory', label: 'Quản lý kho', icon: Package },
                { id: 'revenue', label: 'Doanh thu', icon: DollarSign }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Stock Status Chart */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố trạng thái kho</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Trend */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">xu hướng doanh thu</h3>
                    <div style={{ width: '100%', height: 300, overflowX: 'auto' }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={revenueData}
                          margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                          style={{ overflow: 'visible' }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="reportDate"
                            angle={-30}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tick={{ fontSize: 12, wordBreak: 'break-all' }}
                          />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                          <Line type="monotone" dataKey="totalRevenue" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 sản phẩm bán chạy</h3>
                  <div style={{ width: '100%', height: 400, overflowX: 'auto' }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={detailedRevenueData.slice(0, 10)}
                        margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
                        style={{ overflow: 'visible' }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="productName"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tickFormatter={truncate}
                          tick={{ fontSize: 12, wordBreak: 'break-all' }}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                        <Bar dataKey="totalRevenue" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Báo cáo tồn kho chi tiết</h3>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hết hàng</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Sắp hết</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Vừa phải</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Nhiều</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48 max-w-xs whitespace-nowrap">Sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thể loại</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị tồn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventoryData.map((item) => (
                        <tr key={item.productId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap max-w-xs w-48 overflow-x-auto">
                            <div className="text-sm font-medium text-gray-900 truncate">{item.productName}</div>
                            <div className="text-sm text-gray-500">ID: {item.productId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.categoryName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalSold}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(item.stockStatus)}`}>
                              {getStockStatusText(item.stockStatus)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Báo cáo doanh thu chi tiết</h3>
                
                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h4 className="text-sm font-medium opacity-90">Tổng doanh thu</h4>
                    <p className="text-3xl font-bold">
                      {formatCurrency(detailedRevenueData.reduce((sum, item) => sum + item.totalRevenue, 0))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h4 className="text-sm font-medium opacity-90">Số lượng đã bán</h4>
                    <p className="text-3xl font-bold">
                      {detailedRevenueData.reduce((sum, item) => sum + item.quantitySold, 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <h4 className="text-sm font-medium opacity-90">Số đơn hàng</h4>
                    <p className="text-3xl font-bold">
                      {detailedRevenueData.reduce((sum, item) => sum + item.totalOrders, 0)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần bán đầu</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailedRevenueData.map((item) => (
                        <tr key={item.productId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                            <div className="text-sm text-gray-500">ID: {item.productId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.categoryName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantitySold}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(item.totalRevenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalOrders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.firstSaleDate).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
import { useState,useEffect,useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  ShoppingBag, Users, DollarSign, TrendingUp, Star, Truck, Package, BarChart2, LineChart as LineChartIcon, AreaChart as AreaChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { ChevronLeft, ChevronRight, Edit,Trash2 } from 'lucide-react';
import axios from 'axios';
import { request } from '../../../untils/request';




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Thêm gradient cho biểu đồ
const GradientDefs = () => (
  <defs>
    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#a78bfa" />
      <stop offset="100%" stopColor="#6366f1" />
    </linearGradient>
    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
    </linearGradient>
    <linearGradient id="barCategoryGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#34d399" />
      <stop offset="100%" stopColor="#10b981" />
    </linearGradient>
  </defs>
);
  
export default function Dashboard() {
  // State và ref cho scroll topproducts
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  // State cho biểu đồ doanh thu
  const [salesTimeFrame, setSalesTimeFrame] = useState('daily');
const [salesChartType, setSalesChartType] = useState('bar');
const [categoryView, setCategoryView] = useState('distribution');
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 280;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const token = localStorage.getItem("token");

  // api cho doanh thu và số đơn hàng
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrder: 0 });
  useEffect(() => {
    request.get("bill/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log("API response:", response.data); 
        setStats(response.data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, []);

  // top sản phẩm ratring cao 
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    request.get("products/tops", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      if(response.data.code ===1000){
        setTopProducts(response.data.result);
      }
    })
    .catch((error) => {
      alert("Lỗi khi lấy dữ liệu sản phẩm nổi bật",error);
    });
  }, []);
  // Recent 
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    request.get("bill/recent", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.data.code === 1000) {
          setRecentOrders(response.data.result);
          console.log("Đơn hàng gần đây:", response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy đơn hàng gần đây:", error);
      });
  }, []);
  // api đánh giá
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    request.get("reviews/recent", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.data.code === 1000) {
          setReviews(response.data.result);
          console.log("Đánh giá gần đây:", response.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy đánh giá gần đây:", error);
      });
  }, []);

   // State cho các loại biểu đồ
const [dailyData, setDailyData] = useState([]);
const [monthlyData, setMonthlyData] = useState([]);
const [quarterlyData, setQuarterlyData] = useState([]);
  // api cho chart
  useEffect(() => {
    // Doanh thu theo ngày
    request.get("chart/revenue/daily", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.code === 1000) {
          setDailyData(res.data.result.map(item => ({
            name: item.date,
            value: item.totalRevenue
          })));
        }
      });

    // Doanh thu theo tháng
    request.get("chart/revenue/monthly", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.code === 1000) {
          setMonthlyData(res.data.result.map(item => ({
            name: item.month,
            value: item.totalRevenue
          })));
        }
      });

    // Doanh thu theo quý
    request.get("chart/revenue/quarterly", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.code === 1000) {
          setQuarterlyData(res.data.result.map(item => ({
            name: item.quarter,
            value: item.totalRevenue
          })));
        }
      });
  }, []);
  // State cho dữ liệu danh mục
  const [categoryData, setCategoryData] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState([]);

  useEffect(() => {
    // Phân bố sản phẩm theo danh mục
    request.get("chart/catalog/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data && res.data.code === 1000 && Array.isArray(res.data.result)) {
          setCategoryData(
            res.data.result.map(item => ({
              name: item.catalogName,
              value: item.productCount
            }))
          );
        }
      });

    // Doanh thu theo danh mục
    request.get("chart/catalog/revenue", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data && res.data.code === 1000 && Array.isArray(res.data.result)) {
          setCategorySalesData(
            res.data.result.map(item => ({
              name: item.catalogName,
              value: item.totalRevenue
            }))
          );
        }
      });
  }, []);

  // Chọn dữ liệu dựa trên khung thời gian
 const getSalesData = () => {
  switch (salesTimeFrame) {
    case 'daily':
      return dailyData;
    case 'monthly':
      return monthlyData;
    case 'quarterly':
      return quarterlyData;
    default:
      return [];
  }
};
  // Chọn dữ liệu dựa trên loại danh mục
  const getCategoryData = () => {
    return categoryView === 'distribution' ? categoryData : categorySalesData;
  };

  // Render biểu đồ doanh thu dựa trên loại đã chọn
  const renderSalesChart = () => {
    const data = getSalesData();
     console.log("Sales chart data:", getSalesData());

    switch (salesChartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <GradientDefs />
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
  tickFormatter={value =>
    value >= 1e9
      ? (value / 1e9) + 'T'
      : value >= 1e6
      ? (value / 1e6) + 'tr'
      : value.toLocaleString('vi-VN')
  }
/>
            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'} />
            <Legend />
            {/* Sửa stroke về màu HEX, không dùng gradient */}
            <Line type="monotone" dataKey="value" name="Doanh thu" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5, fill: "#a78bfa" }} activeDot={{ r: 8 }} animationDuration={800} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <GradientDefs />
            <CartesianGrid strokeDasharray="3 3" />
           <YAxis
  tickFormatter={value =>
    value >= 1e9
      ? (value / 1e9) + 'T'
      : value >= 1e6
      ? (value / 1e6) + 'tr'
      : value.toLocaleString('vi-VN')
  }
/>
            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'} />
            <Legend />
            <Area type="monotone" dataKey="value" name="Doanh thu" stroke="#a78bfa" fill="url(#areaGradient)" strokeWidth={2} animationDuration={800} />
          </AreaChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <GradientDefs />
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
  tickFormatter={value =>
    value >= 1e9
      ? (value / 1e9) + 'T'
      : value >= 1e6
      ? (value / 1e6) + 'tr'
      : value.toLocaleString('vi-VN')
  }
/>
            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'} />
            <Legend />
            <Bar dataKey="value" name="Doanh thu" fill="#a78bfa" radius={[8, 8, 0, 0]} barSize={40} animationDuration={800} />
          </BarChart>
        );
    }
  };

  // Render biểu đồ danh mục
  const renderCategoryChart = () => {
    const data = getCategoryData().filter(item => item.value > 0);
    if (categoryView === 'distribution') {
      return (
        <PieChart>
          <GradientDefs />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            fill="#a78bfa"
            dataKey="value"
            label={({ 
              cx, cy, midAngle, innerRadius, outerRadius, percent, index
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 25; // Đẩy label ra ngoài hơn
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
              return (
                <text
                  x={x}
                  y={y}
                  fontSize={16}
                  textAnchor="middle"
                  fill={COLORS[index % COLORS.length]}
                  style={{ pointerEvents: 'none', fontWeight: 600 }}
                  dominantBaseline="central"
                >
                  {(percent * 100).toFixed(1)}%
                </text>
              );
            }}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} sản phẩm`} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 14, marginTop: 10 }}
          />
        </PieChart>
      );
    }
    return (
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <GradientDefs />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
                    <YAxis
  tickFormatter={value =>
    value >= 1e9
      ? (value / 1e9) + 'T'
      : value >= 1e6
      ? (value / 1e6) + 'tr'
      : value.toLocaleString('vi-VN')
  }

/>
        <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'} />
        <Legend />
        <Bar dataKey="value" name="Doanh thu" fill="#34d399" radius={[8, 8, 0, 0]} barSize={40} animationDuration={800} />
      </BarChart>
    );
  };

  // Render nút chuyển đổi dạng biểu đồ với icon
  const chartTypes = [
    { key: 'bar', icon: <BarChart2 className="w-5 h-5" />, label: 'Cột' },
    { key: 'line', icon: <LineChartIcon className="w-5 h-5" />, label: 'Đường' },
    { key: 'area', icon: <AreaChartIcon className="w-5 h-5" />, label: 'Vùng' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Doanh thu</p>
            <p className="text-2xl font-semibold">{stats.totalRevenue ? stats.totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 ₫"}</p>
            <p className="text-green-500 text-xs">↑ 12.5% so với tháng trước</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Đơn hàng</p>
            <p className="text-2xl font-semibold"> {stats.totalOrder ?? 0}</p>
            <p className="text-green-500 text-xs">↑ 8.2% so với tháng trước</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Khách hàng mới</p>
            <p className="text-2xl font-semibold">256</p>
            <p className="text-green-500 text-xs">↑ 5.3% so với tháng trước</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Tỷ lệ chuyển đổi</p>
            <p className="text-2xl font-semibold">3.2%</p>
            <p className="text-red-500 text-xs">↓ 0.5% so với tháng trước</p>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart with controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-700">Biểu đồ doanh thu</h2>
            <div className="flex items-center space-x-2">
              <select
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-400"
                value={salesTimeFrame}
                onChange={(e) => setSalesTimeFrame(e.target.value)}
              >
                <option value="daily">Theo ngày</option>
                <option value="monthly">Theo tháng</option>
                <option value="quarterly">Theo quý</option>
              </select>
              <div className="flex space-x-1 ml-2">
                {chartTypes.map((type) => (
                  <button
                    key={type.key}
                    className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center
                      ${salesChartType === type.key
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-gray-100 text-purple-600 border-transparent hover:bg-purple-100'}`}
                    onClick={() => setSalesChartType(type.key)}
                    title={`Biểu đồ ${type.label}`}
                  >
                    {type.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {renderSalesChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart with controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-700">Phân tích danh mục</h2>
            <select
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-400"
              value={categoryView}
              onChange={(e) => setCategoryView(e.target.value)}
            >
              <option value="distribution">Phân bố sản phẩm</option>
              <option value="sales">Doanh thu theo danh mục</option>
            </select>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {renderCategoryChart()}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* tops Products */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative w-full max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-700">Sản phẩm nổi bật</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các sản phẩm hàng đầu của cửa hàng</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
            <span>+ Thêm sản phẩm</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollLeft 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollRight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex flex-col min-w-[260px] max-w-[260px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost:8080/images/${product.image}.png`}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="260" height="192" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f3f4f6"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
                          ${product.name}
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.soldCount > 20 
                      ? 'bg-green-100 text-green-800' 
                      : product.soldCount > 10 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.soldCount > 20 ? 'Bán chạy' : product.soldCount > 10 ? 'Trung bình' : 'Ít bán'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{product.averageRating}</span>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="mb-3">
                  <div className="text-xl font-bold text-slate-700 mb-1">
                    {Number(product.price).toLocaleString("vi-VN", { 
                      style: "currency", 
                      currency: "VND" 
                    })}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Đã bán: {product.soldCount}</span>
                    <span className="text-gray-500">ID: #{product.id}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Edit size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button className="px-4 py-2.5 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1">
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for visual scroll indication */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        )}
      </div>
      
      {/* Scroll indicator dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(topProducts.length / 4) }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-purple-200 opacity-50"
          />
        ))}
      </div>
    </div>

      {/*Sản phẩm*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bán chạy  */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-700">Sản phẩm bán chạy</h2>
            <button className="text-purple-600 text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {topProducts
            .filter(product => product.soldCount > 20)
            .map((product, index) => (
              <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                <img src={`http://localhost:8080/images/${product.image}.png`} alt={product.name} className="w-16 h-16 rounded object-cover mr-4" />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex justify-between mt-1">
                     <span className="text-purple-600 font-medium">
                     {Number(product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      {product.soldCount} đã bán
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-700">Sản phẩm mới</h2>
            <button className="text-purple-600 text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="relative">
                  <img src={`http://localhost:8080/images/${product.image}.png`} alt={product.name} className="w-16 h-16 rounded object-cover mr-4" />
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded">Mới</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-purple-600 font-medium">{product.price}</span>
                    <span className="text-gray-500 text-sm">{product.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-700">Đơn hàng gần đây</h2>
            <button className="text-purple-600 text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {recentOrders.map((order, index) => (
    <tr key={index}>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-600">{order.billId}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{order.customerName}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {order.orderDate ? new Date(order.orderDate).toLocaleString("vi-VN") : ""}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
        {Number(order.orderValue).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {/* Nếu có trường trạng thái thì hiển thị, không thì để trống */}
          {order.status || "Chờ xử lý"}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {/* Shipping Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Trạng thái vận chuyển</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Đang vận chuyển</p>
                  <p className="text-sm text-gray-500">19 đơn hàng</p>
                </div>
              </div>
              <span className="text-blue-600 font-medium">24%</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-2 mr-3">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Đang xử lý</p>
                  <p className="text-sm text-gray-500">34 đơn hàng</p>
                </div>
              </div>
              <span className="text-yellow-600 font-medium">42%</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Đã giao hàng</p>
                  <p className="text-sm text-gray-500">27 đơn hàng</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">34%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Comments */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">Đánh giá từ khách hàng</h2>
          <button className="text-purple-600 text-sm hover:underline">Xem tất cả</button>
        </div>
        <div className="space-y-4">
          {reviews.map((comment, index) => (
            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center mb-2">
                {/* <img src={comment.avatar} alt={comment.customerName} className="w-10 h-10 rounded-full mr-3" /> */}
                <div>
                  <p className="font-semibold">{comment.customerName}</p>
                  <div className="flex items-center text-sm">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < comment.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-gray-500">
  {comment.reviewDate ? new Date(comment.reviewDate).toLocaleString("vi-VN") : ""}
</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{comment.reviewContent}</p>
              <p className="text-xs text-purple-600">Sản phẩm: {comment.productName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
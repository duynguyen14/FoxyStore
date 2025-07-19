import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { Download } from "lucide-react";
import { request } from "../../../untils/request";
const mockCategories = [
  { CategoryId: 1, Name: "Áo" },
  { CategoryId: 2, Name: "Quần" },
  { CategoryId: 3, Name: "Giày" },
];
const mockRegions = [
  { id: "hn", name: "Hà Nội" },
  { id: "hcm", name: "Hồ Chí Minh" },
  { id: "dn", name: "Đà Nẵng" },
];
const COLORS = ["#6366f1", "#34d399", "#fbbf24", "#f472b6", "#a78bfa"];
const OTHER_COLOR = "#cbd5e1";
const token =localStorage.getItem("token")
function RevenueManagement() {
  const [chartType, setChartType] = useState("bar");
  const [timeFrame, setTimeFrame] = useState("month");
  const [filter, setFilter] = useState({ category: "", region: "", year: "2025", month: "" });
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [showOthersDetail, setShowOthersDetail] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.year) params.append("year", filter.year);
    if (filter.month) params.append("month", filter.month);
    if (filter.category) params.append("category", filter.category);
    if (filter.region) params.append("region", filter.region);

    fetch(`http://localhost:8080/api/v1/bill/admin/revenue`,{
      method:"GET", 
      headers:{
          Authorization: `Bearer ${token}`
        }
    })
      .then(res => res.json())
      .then(data => {
        const productMap = new Map();
        const revenueByMonth = Array(12).fill(0);
        let total = 0;

        data.result.forEach(bill => {  
          const billDate = new Date(bill.time);
          const billYear = billDate.getFullYear().toString();
          const billMonth = billDate.getMonth() + 1;

          if (filter.year && billYear !== filter.year) return;
          if (filter.month && Number(filter.month) !== billMonth) return;

          bill.billDetails?.forEach(detail => {
            const name = detail.productName;
            const quantity = detail.quantity || 0;
            const price = detail.price || 0;
            const revenue = quantity * price;

            revenueByMonth[billMonth - 1] += revenue;
            total += revenue;

            if (productMap.has(name)) {
              const existing = productMap.get(name);
              existing.sold += quantity;
              existing.revenue += revenue;
              productMap.set(name, existing);
            } else {
              productMap.set(name, { name, sold: quantity, revenue });
            }
          });
        });

        const result = Array.from(productMap.values()).sort((a, b) => b.sold - a.sold);
        setTopProducts(result);
        setTotalRevenue(total);

        const revenueData = revenueByMonth.map((revenue, i) => ({
          name: `T${i + 1}`,
          revenue
        }));
        setMonthlyRevenue(revenueData);
      })
      .catch(err => console.error("Lỗi khi fetch hóa đơn:", err));
  }, [filter.year, filter.month, filter.category, filter.region]);

  const getRevenueData = () => {
    if (timeFrame === "month") return monthlyRevenue;
    if (timeFrame === "quarter") {
      const quarters = [0, 0, 0, 0];
      monthlyRevenue.forEach((item, index) => {
        const q = Math.floor(index / 3);
        quarters[q] += item.revenue;
      });
      return quarters.map((r, i) => ({ name: `Q${i + 1}`, revenue: r }));
    }
    if (timeFrame === "year") {
      return [{ name: filter.year, revenue: totalRevenue }];
    }
    return [];
  };

  const handleExport = () => {
    alert("Đã xuất báo cáo doanh thu (demo)");
  };

  const renderRevenueChart = () => {
    const data = getRevenueData();
    if (chartType === "line") {
      return (
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={90} tickFormatter={v => v.toLocaleString("vi-VN") + " đ"} />
          <Tooltip formatter={v => v.toLocaleString("vi-VN") + " đ"} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: "#a78bfa" }} />
        </LineChart>
      );
    }
    if (chartType === "area") {
      return (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={90} tickFormatter={v => v.toLocaleString("vi-VN") + " đ"} />
          <Tooltip formatter={v => v.toLocaleString("vi-VN") + " đ"} />
          <Legend />
          <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#a78bfa" fill="#c7d2fe" strokeWidth={2} />
        </AreaChart>
      );
    }
    return (
      <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width={90} tickFormatter={v => v.toLocaleString("vi-VN") + " đ"} />
        <Tooltip formatter={v => v.toLocaleString("vi-VN") + " đ"} />
        <Legend />
        <Bar dataKey="revenue" name="Doanh thu" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
      </BarChart>
    );
  };

  // Dữ liệu Top sản phẩm và phần Khác
  const top5Products = topProducts.slice(0, 5);
  const otherProducts = topProducts.slice(5);
  const othersSold = otherProducts.reduce((sum, p) => sum + p.sold, 0);
  // const othersRevenue = otherProducts.reduce((sum, p) => sum + p.revenue, 0);

  const pieData = [...top5Products];
  if (otherProducts.length > 0) {
    pieData.push({
      name: "Khác",
      sold: othersSold,
      isOther: true,
    });
  }

  const renderCells = pieData.map((entry, index) => {
    if (entry.isOther) return <Cell key={`cell-other`} fill={OTHER_COLOR} />;
    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Quản lý doanh thu</h2>
          <button
            className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition-all font-semibold"
            onClick={handleExport}
          >
            <Download size={20} className="mr-2" /> Xuất báo cáo
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-6 mb-6 items-end bg-white rounded-2xl shadow-md p-6">
          {/* Chọn loại sản phẩm */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-indigo-700">Loại sản phẩm</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-48 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={filter.category}
              onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Tất cả</option>
              {mockCategories.map(cat => (
                <option key={cat.CategoryId} value={cat.CategoryId}>
                  {cat.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Năm */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-indigo-700">Năm</label>
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-4 py-2 w-32 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={filter.year}
              onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
              min="2000"
              max="2100"
            />
          </div>

          {/* Loại biểu đồ */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-indigo-700">Loại biểu đồ</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-32 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={chartType}
              onChange={e => setChartType(e.target.value)}
            >
              <option value="bar">Cột</option>
              <option value="line">Đường </option>
              <option value="area">Diện tích</option>
            </select>
          </div>

          {/* Khung thời gian */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-indigo-700">Khung thời gian</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-40 shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={timeFrame}
              onChange={e => setTimeFrame(e.target.value)}
            >
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
        </div>

        {/* Biểu đồ doanh thu */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <ResponsiveContainer width="100%" height={350}>
            {renderRevenueChart()}
          </ResponsiveContainer>
        </div>

        {/* Top sản phẩm bán chạy */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Top sản phẩm bán chạy</h3>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Danh sách sản phẩm */}
            <div className="flex-1">
              <ul className="divide-y divide-gray-200">
                {top5Products.map((prod, i) => (
                  <li key={prod.name} className="py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{prod.name}</span>
                    </div>
                    <span className="text-indigo-600 font-semibold">
                      {prod.sold.toLocaleString("vi-VN")} cái
                    </span>
                  </li>
                ))}

                {otherProducts.length > 0 && (
                  <li
                    className="py-3 flex justify-between items-center cursor-pointer hover:bg-indigo-50 rounded-lg px-3"
                    onClick={() => setShowOthersDetail(!showOthersDetail)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: OTHER_COLOR }}
                      ></div>
                      <span className="font-medium">Khác ({otherProducts.length} sản phẩm)</span>
                    </div>
                    <span className="text-indigo-600 font-semibold">
                      {othersSold.toLocaleString("vi-VN")} cái
                    </span>
                  </li>
                )}
              </ul>

              {/* Chi tiết sản phẩm khác */}
              {showOthersDetail && otherProducts.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg max-h-60 overflow-y-auto shadow-inner">
                  <h4 className="font-semibold mb-2 text-indigo-700">Chi tiết sản phẩm khác</h4>
                  <ul className="divide-y divide-indigo-200">
                    {otherProducts.map(prod => (
                      <li key={prod.name} className="py-2 flex justify-between">
                        <span>{prod.name}</span>
                        <span className="font-semibold">{prod.sold.toLocaleString("vi-VN")} cái</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Biểu đồ Pie */}
            <div className="w-full md:w-96 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="sold"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    fill="#8884d8"
                    label={({ percent }) => `(${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {renderCells}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString("vi-VN") + " cái"} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tổng doanh thu */}
          <div className="mt-6 text-right font-bold text-xl text-indigo-700">
            Tổng doanh thu: {totalRevenue.toLocaleString("vi-VN")} VNĐ
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueManagement;

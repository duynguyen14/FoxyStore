import React, { useState } from "react";
import { Heart, Trash2, Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock sản phẩm yêu thích (demo)
const mockFavorites = [
	{
		ProductId: 45,
		Name: "Áo sơ mi trắng",
		Price: 350000,
		Image: "https://via.placeholder.com/120x120?text=Áo+1",
	},
	{
		ProductId: 25,
		Name: "Quần jean xanh",
		Price: 450000,
		Image: "https://via.placeholder.com/120x120?text=Quần+1",
	},
	{
		ProductId: 33,
		Name: "Váy hoa nhí",
		Price: 520000,
		Image: "https://via.placeholder.com/120x120?text=Váy+1",
	},
	{
		ProductId: 49,
		Name: "Áo khoác kaki",
		Price: 650000,
		Image: "https://via.placeholder.com/120x120?text=Khoác+1",
	},
	{
		ProductId: 57,
		Name: "Đầm dự tiệc",
		Price: 890000,
		Image: "https://via.placeholder.com/120x120?text=Đầm+1",
	},
	{
		ProductId: 68,
		Name: "Áo phông basic",
		Price: 210000,
		Image: "https://via.placeholder.com/120x120?text=Phông+1",
	},
	{
		ProductId: 79,
		Name: "Quần short kaki",
		Price: 320000,
		Image: "https://via.placeholder.com/120x120?text=Short+1",
	},
	{
		ProductId: 86,
		Name: "Áo len cổ lọ",
		Price: 410000,
		Image: "https://via.placeholder.com/120x120?text=Len+1",
	},
	{
		ProductId: 96,
		Name: "Chân váy chữ A",
		Price: 370000,
		Image: "https://via.placeholder.com/120x120?text=Chân+váy+1",
	},
	{
		ProductId: 101,
		Name: "Áo sơ mi caro",
		Price: 390000,
		Image: "https://via.placeholder.com/120x120?text=Áo+caro",
	},
];

function formatPrice(price) {
	return price.toLocaleString("vi-VN") + " đ";
}

function FavoriteProducts() {
	const [favorites, setFavorites] = useState(mockFavorites);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	// Xem chi tiết sản phẩm: chuyển hướng đến trang chi tiết sản phẩm
	const handleView = (product) => {
		navigate(`/product/${product.ProductId}`);
	};

	// Xóa khỏi yêu thích
	const handleRemove = (productId) => {
		setFavorites(favorites.filter((p) => p.ProductId !== productId));
		setMessage("Đã xóa sản phẩm khỏi danh sách yêu thích.");
		setTimeout(() => setMessage(""), 2000);
	};

	// Thêm vào giỏ hàng
	const handleAddToCart = (product) => {
		setMessage(`Đã thêm "${product.Name}" vào giỏ hàng.`);
		setTimeout(() => setMessage(""), 2000);
	};

	return (
		<div className="min-h-screen w-full bg-white px-1 md:px-5 lg:px-0 lg:ml-10 rounded-lg mt-10 relative font-Montserrat text-gray-800">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
					<Heart size={30} className="text-pink-400" /> Sản phẩm yêu thích
				</h2>
				{message && (
					<div className="mb-6 px-6 py-3 rounded-xl bg-gray-100 text-gray-600 border border-gray-200 shadow text-base font-medium">
						{message}
					</div>
				)}
				{favorites.length === 0 ? (
					<div className="text-center text-gray-400 py-24">
						<Heart size={60} className="mx-auto mb-6 text-pink-200" />
						<div className="text-xl">Chưa có sản phẩm yêu thích nào.</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{favorites.map((product) => (
							<div
								key={product.ProductId}
								className="bg-white rounded-2xl shadow p-7 flex flex-col items-center relative transition hover:scale-[1.03] hover:shadow-lg border border-gray-100"
								style={{ minHeight: 340, fontFamily: "inherit" }}
							>
								<img
									src={product.Image}
									alt={product.Name}
									className="w-40 h-40 object-cover rounded-xl mb-5 border border-gray-200"
									style={{ background: "#f7f7fb" }}
								/>
								<div className="font-semibold text-base text-gray-800 mb-2 text-center line-clamp-2">
									{product.Name}
								</div>
								<div className="text-gray-700 font-bold text-lg mb-5">
									{formatPrice(product.Price)}
								</div>
								<div className="flex gap-4 mt-auto w-full justify-center">
									<button
										className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium shadow transition text-base"
										style={{ fontFamily: "inherit" }}
										onClick={() => handleView(product)}
										title="Xem chi tiết"
									>
										<Eye size={22} />
									</button>
									<button
										className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-green-600 hover:bg-green-100 font-medium shadow transition text-base"
										style={{ fontFamily: "inherit" }}
										onClick={() => handleAddToCart(product)}
										title="Thêm vào giỏ"
									>
										<ShoppingCart size={22} />
									</button>
									<button
										className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 text-red-500 hover:bg-red-100 font-medium shadow transition text-base"
										style={{ fontFamily: "inherit" }}
										onClick={() => handleRemove(product.ProductId)}
										title="Xóa khỏi yêu thích"
									>
										<Trash2 size={22} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default FavoriteProducts;

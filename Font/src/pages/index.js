import UserLayout from "../components/Layout/DefautLayout/UserLayout";
import OtherLayout from "../components/Layout/OtherLayout";
// login
import Login from "./Login";
import OAuthRedirect from '../untils/OAuthRedirect.jsx';

// user
import Home from "./User/Home";
import Profile from "./User/Profile";
import Register from "./User/Register";
import Product from "./User/Product";
import CartShopping from "./User/CartShopping";
import OrderManagementUser from "./User/OrderManagementUser/index.jsx";
import Order from "./User/Order/index.jsx";
import CategoryLayout from "../components/Layout/DefautLayout/CategoryLayout/index.jsx";
import Address from "./User/Address/index.jsx";
import Category from "./User/Category/index.jsx";

// admin
import DashboardAdmin from "./Admin/Dashboard";
import ProfileAdmin from "./Admin/Profile";
import AdminLayout from "../components/Layout/DefautLayout/AdminLayout";
import Users from "./Admin/Users";
import Products from "./Admin/Products";
import Categories from "./Admin/Categories";
import Catalogs from "./Admin/Catalogs";
import Orders from "./Admin/Orders";
import Feedback from "./Admin/Feedback";
import Coupon from "./Admin/Coupon";
import Payment from "./Admin/Payment";
import Revenue from "./Admin/Revenue";
import Messages from "./Admin/Messages";
import Employees from "./Admin/Employees";
import ReportProduct from "./Admin/ReportProduct";
import { label, path } from "framer-motion/client";
import OrderManagement from "./Admin/Orders";
import FavoriteProducts from "./User/Product/favorite.jsx";
import OrderDetail from "./User/OrderDetail/index.jsx";
import WishListProduct from "./User/WishListProduct/indes.jsx";





const PublicPage=[
    // user
    {path :"/",component: Home, layout: UserLayout },
    {path :"/product/:id",component: Product, layout: UserLayout },
    {path:"/order",component:Order, layout:UserLayout},
    {path :"/cartShopping",component: CartShopping, layout: UserLayout },
    {path :"/register",component: Register, layout: UserLayout },
    {path :"/login",component: Login, layout: UserLayout },

    {path:"/category/:id",component :Category , layout: CategoryLayout},
    {path:"/category",component :Category , layout: CategoryLayout},

    {path :"/order/:id",component: OrderDetail, layout: OtherLayout },
    {path :"/profile",component: Profile, layout: OtherLayout },
    {path:"/ordermanagement", component: OrderManagementUser ,layout: OtherLayout},
    {path:"/address",component :Address , layout:OtherLayout},
    {path:"/wishlist",component :WishListProduct , layout:OtherLayout},
    {path :"/oauth2/redirect",component: OAuthRedirect, layout: null },

    // admin
    {path :"/admin",component: DashboardAdmin, layout: AdminLayout },
    {path :"/admin/account",component: ProfileAdmin, layout: AdminLayout },
    {path :"/admin/users",component: Users, layout: AdminLayout },
    {path :"/admin/products",component: Products, layout: AdminLayout },
    {path :"/admin/categories",component: Categories, layout: AdminLayout },
    {path :"/admin/catalogs",component: Catalogs, layout: AdminLayout },
    {path :"/admin/orders",component: Orders, layout: AdminLayout },
    {path :"/admin/feedback",component: Feedback, layout: AdminLayout },
    {path :"/admin/coupon",component: Coupon, layout: AdminLayout },
    {path :"/admin/payment",component: Payment, layout: AdminLayout },
    {path :"/admin/revenue",component: Revenue, layout: AdminLayout },
    {path :"/admin/messages",component: Messages, layout: AdminLayout },
    {path :"/admin/employees",component: Employees, layout: AdminLayout },
    {path :"/admin/report-product",component: ReportProduct, layout: AdminLayout },
    

]

const PrivatePage=[

]

export {PublicPage,PrivatePage}
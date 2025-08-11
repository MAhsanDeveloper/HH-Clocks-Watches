import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import OrderManager from "./admin/OrderManager";
// import WhatsappButton from "./components/WhatsappButton";

const AdminHome = lazy(() => import("./admin/AdminHome"));
const ShopManager = lazy(() => import("./admin/ShopManager"));
const ContactManager = lazy(() => import("./admin/ContactManager"));
const adminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;
const adminPanelPath = import.meta.env.VITE_ADMIN_PANEL_PATH;
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const ProtectedAdminRoute = lazy(() =>
  import("./components/ProtectedAdminRoute")
);
const CartPage = lazy(() => import("./pages/CartPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/shop",
    element: <Home scrollTo="shop" />,
  },
  {
    path: "/contact",
    element: <Home scrollTo="contact" />,
  },
  {
    path: "/about",
    element: <Home scrollTo="about" />,
  },

  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
  },
  {
    path: "/item/:id",
    element: <ItemDetails />,
  },

  {
    path: adminLoginPath,
    element: (
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: adminPanelPath,
    element: (
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: "shop", element: <ShopManager /> },
      { path: "contact", element: <ContactManager /> },
      { path: "orders", element: <OrderManager /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
    {/* <WhatsappButton /> */}
  </>
);

export default App;

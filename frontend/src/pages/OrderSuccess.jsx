import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-700 mb-6">Your order has been successfully placed.</p>
   <Link
  to="/shop"
  className="text-white bg-black px-6 py-2 rounded hover:bg-gray-800 transition"
>
  Continue Shopping
</Link>

    </div>
  );
};

export default OrderSuccess;

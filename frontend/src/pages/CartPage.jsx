import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(storedCart);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateLocalStorage(updatedCart);
    toast.success("Item removed");
  };

  const changeQuantity = (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  const getTotalPrice = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim() || form.name.trim().length < 3) {
      toast.error("Please enter a valid name (min 3 characters).");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 11-digit phone number.");
      return;
    }

    if (!form.address.trim() || form.address.trim().length < 10) {
      toast.error("Please enter a valid shipping address (min 10 characters).");
      return;
    }

    if (form.email && !emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cartItems: cart }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cartItems");
        setForm({
          name: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          paymentMethod: "cod",
        });
        navigate("/order-success");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  if (cart.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Your cart is empty
        </h2>
        <Link
          to="/shop"
          className="text-white bg-black px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Go to Shop
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10 space-y-8">
<div className="relative flex items-center">
  <button
    onClick={() => navigate(-1)}
    className="text-sm md:text-base text-gray-600 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded transition"
  >
    ← Back
  </button>
  <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl md:text-4xl font-bold text-gray-800">
    Your Cart
  </h1>
</div>



        {/* Cart Items */}
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-center border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div className="flex items-center gap-4 w-full md:w-2/3">
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-sm">
                    Rs {item.price} × {item.quantity} ={" "}
                    <strong>
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => changeQuantity(item._id, -1)}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <FaMinus />
                </button>
                <span className="w-6 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => changeQuantity(item._id, 1)}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-right text-lg  font-semibold">
          Total:{" "}
          <span className="text-green-700 text-2xl font-bold">
            Rs {getTotalPrice().toFixed(2)}
          </span>
          <span className="bg-green-500 mt-2 mx-2 w-fit rounded text-white text-right px-3 py-2 font-semibold z-10">
            Free Delivery
          </span>
        </div>

        {/* Order Summary & Checkout */}
        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-700">
              Billing Information
            </h3>
            <div className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name*"
                value={form.name}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number*"
                value={form.phone}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="email"
                name="email"
                placeholder="Email (Optional)"
                value={form.email}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded outline-none focus:ring-2 focus:ring-black"
              />

              <textarea
                name="address"
                placeholder="Shipping Address*. Add street, house number, city, "
                rows={3}
                value={form.address}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded resize-none outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                name="notes"
                placeholder="Additional Notes (Optional)"
                rows={2}
                value={form.notes}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded resize-none outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Payment Method
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="accent-green-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-8 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

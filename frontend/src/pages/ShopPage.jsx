import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ShopPage = () => {
  const [items, setItems] = useState([]);

 const fetchShop = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/shop`, {
      withCredentials: true,
    });
    setItems(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Failed to fetch shop items", err);
  }
};


  useEffect(() => {
    fetchShop();
  }, []);

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const finalPrice = item.hasDiscount
      ? Math.round(item.price - (item.price * item.discountRate) / 100)
      : item.price;

    const itemIndex = existingCart.findIndex(
      (cartItem) => cartItem._id === item._id
    );

    if (itemIndex !== -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({
        ...item,
        quantity: 1,
        price: finalPrice,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    toast.success("Item added to cart");
  };

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-6 sm:px-10">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">
        HH Luxury Watches
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto place-items-center">
        {items.map((item) => {
          const finalPrice = item.hasDiscount
            ? Math.round(item.price - (item.price * item.discountRate) / 100)
            : item.price;

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 w-full max-w-[280px]"
            >
              <Link to={`/item/${item._id}`}>
                <div className="relative">
                  {item.hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                      {item.discountRate}% OFF
                    </span>
                  )}
                  {item.mainImage && (
                    <img
                      src={`${baseURL}${item.mainImage}`}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
                    {item.name}
                  </h3>

                  {item.hasDiscount ? (
                    <>
                      <p className="text-sm text-gray-500 line-through">
                        Rs {item.price}
                      </p>
                      <p className="text-green-600 text-base font-semibold">
                        Rs {finalPrice}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 text-base font-semibold">
                        Rs {item.price}
                      </p>
                      <p className="text-sm text-green-500 mt-1">Free Delivery</p>
                    </>
                  )}
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShopPage;

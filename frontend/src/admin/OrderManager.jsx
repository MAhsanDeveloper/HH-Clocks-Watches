/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Order Manager</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Address</th>
              <th className="p-3">Total (PKR)</th>
              <th className="p-3">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{order.customerName || "N/A"}</td>
                <td className="p-3">{order.customerEmail || "N/A"}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">{order.address}</td>
                <td className="p-3">
                  {order.totalAmount?.toLocaleString() || 0}
                </td>
                <td className="p-3">
                  <ul className="list-disc ml-4 space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
                    )) || <li>No items</li>}
                  </ul>
                  <a
                    href={`${baseURL}/api/orders/${order._id}/invoice`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 underline"
                  >
                    Download Invoice
                  </a>
                  <a
                    href={`${baseURL}/api/orders/${order._id}/packaging-slip`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 underline"
                  >
                    Download Packaging Slip
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No orders placed yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default OrderManager;

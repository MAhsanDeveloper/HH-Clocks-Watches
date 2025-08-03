import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const ShopManager = () => {
  const [item, setItem] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    mainImage: null,
    mainImagePreview: null,
    previewImages: [],
    previewPreviews: [],
    hasDiscount: false,
    discountRate: 0,
    available: 0,
    sold: 0,
    inStock: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    imagePreview: null,
    hasDiscount: false,
    discountRate: 0,
    available: 0,
  });

  const fetchShopItem = async () => {
    const res = await axios.get(`${baseURL}/api/shop`);
    setItem(res.data);
  };

  const addItem = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("description", newItem.description);
      formData.append("hasDiscount", newItem.hasDiscount);
      formData.append("discountRate", newItem.discountRate);
      formData.append("available", newItem.available);
      if (newItem.mainImage) formData.append("mainImage", newItem.mainImage);
      newItem.previewImages.forEach((file) =>
        formData.append("previewImages", file)
      );

      await axios.post(`${baseURL}/api/shop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Item added");

      setNewItem({
        name: "",
        price: "",
        description: "",
        mainImage: null,
        mainImagePreview: null,
        previewImages: [],
        previewPreviews: [],
        hasDiscount: false,
        discountRate: 0,
        available: 0,
        sold: 0,
        inStock: true,
      });

      fetchShopItem();
    } catch {
      toast.error("Failed to add item");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/shop/${id}`, {
        withCredentials: true,
      });
      toast.success("Item deleted");
      fetchShopItem();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${baseURL}/api/shop/${id}`, editForm, {
        withCredentials: true,
      });
      toast.success("Item updated");
      fetchShopItem();
      setEditingId(null);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem((prev) => ({
        ...prev,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handlePreviewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewItem((prev) => ({
      ...prev,
      previewImages: files,
      previewPreviews: previews,
    }));
  };

  useEffect(() => {
    fetchShopItem();
  }, []);

  return (
    <div className="bg-amber-600 text-white p-6 rounded-xl mx-auto max-w-screen-2xl">
      <h2 className="text-3xl font-bold mb-6">Manage Shop</h2>

      {/* New Item Form */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-8">
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="p-2 rounded border outline-none text-black"
        />
        <input
          type="text"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="p-2 rounded border outline-none text-black"
        />
        <input
          type="text"
          placeholder="Sold"
          value={newItem.sold}
          onChange={(e) => setNewItem({ ...newItem, sold: e.target.value })}
          className="p-2 rounded border outline-none text-black"
        />
        <input
          type="number"
          placeholder="Available Stock"
          value={newItem.available}
          onChange={(e) =>
            setNewItem({ ...newItem, available: Number(e.target.value) })
          }
          className="p-2 rounded border outline-none text-black"
        />

             <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={newItem.hasDiscount}
            onChange={(e) =>
              setNewItem({ ...newItem, hasDiscount: e.target.checked })
            }
          />
          Apply Discount
        </label>
        <input
          type="number"
          placeholder="Discount %"
          value={newItem.discountRate}
          disabled={!newItem.hasDiscount}
          onChange={(e) =>
            setNewItem({ ...newItem, discountRate: Number(e.target.value) })
          }
          className="p-2 rounded border outline-none text-black"
        />

        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          className="p-2 rounded border outline-none text-black col-span-full"
        />

   
        <label className="bg-white text-amber-700 px-4 py-2 rounded cursor-pointer hover:bg-amber-100 text-sm font-medium text-center">
          Main Image
          <input type="file" onChange={handleMainImage} className="hidden" />
        </label>
        {newItem.mainImagePreview && (
          <img
            src={newItem.mainImagePreview}
            className="w-24 h-24 object-cover rounded border"
          />
        )}

        <label className="bg-white text-amber-700 px-2 py-2 rounded cursor-pointer hover:bg-amber-100 text-sm font-medium text-center">
          Preview Images (max 3)
          <input
            type="file"
            onChange={handlePreviewImages}
            className="hidden"
            multiple
          />
        </label>
        <div className="flex gap-2">
          {newItem.previewPreviews.map((url, i) => (
            <img key={i} src={url} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>

        <button
          onClick={addItem}
          className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-2 rounded font-bold cursor-pointer"
        >
          Add Item
        </button>
      </div>

      {/* List Items */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {item.map((item) => (
          <div
            key={item._id}
            className="bg-white text-black p-4 rounded-lg shadow-md flex flex-col relative"
          >
            {item.hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                {item.discountRate}% OFF
              </div>
            )}

            {editingId === item._id ? (
              <>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full font-bold text-lg border rounded px-2 py-1 mb-2"
                />
                <input
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="w-full text-sm border rounded px-2 py-1"
                />
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    checked={editForm.hasDiscount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        hasDiscount: e.target.checked,
                      })
                    }
                  />
                  Apply Discount
                </label>
                <input
                  type="number"
                  value={editForm.discountRate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      discountRate: Number(e.target.value),
                    })
                  }
                  className="border rounded p-1 text-sm"
                />
                <input
                  type="number"
                  value={editForm.available}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      available: Number(e.target.value),
                    })
                  }
                  className="border rounded p-1 text-sm mt-2"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {item.mainImage && (
                  <img
                    src={`${baseURL}${item.mainImage}`}
                    alt={item.name}
                    className="w-full h-40 object-fill rounded mb-2"
                  />
                )}
                <h3 className="font-bold text-lg">{item.name}</h3>
                {item.hasDiscount ? (
                  <>
                    <p className="text-sm text-red-600 line-through">
                      Rs {item.price}
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      Rs {item.price - (item.price * item.discountRate) / 100}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-700">Rs {item.price}</p>
                )}
                <p className="text-xs mt-1">
                  {" "}
                  <span
                    className={item.inStock ? "text-green-700" : "text-red-600"}
                  >
                    {item.inStock
                      ? `In Stock (${item.available})`
                      : "Out of Stock"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">Sold: {item.sold}</p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setEditingId(item._id);
                      setEditForm({
                        name: item.name,
                        price: item.price,
                        hasDiscount: item.hasDiscount,
                        discountRate: item.discountRate,
                        available: item.available,
                      });
                    }}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopManager;

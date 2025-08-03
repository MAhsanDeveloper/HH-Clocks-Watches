import Cart from "../models/cart.model.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId }] });
    } else {
      const index = cart.items.findIndex((item) => item.productId == productId);
      if (index >= 0) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ productId });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId != productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart" });
  }
};

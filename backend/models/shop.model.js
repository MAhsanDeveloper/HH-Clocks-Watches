import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mainImage: { type: String }, // replaces old 'image'
    previewImages: [String],     // new: up to 3 previews
    description: { type: String },
    model: { type: String },
    hasDiscount: { type: Boolean, default: false },
    discountRate: { type: Number, default: 0 },
      available: { type: Number, default: 0 }, 
    sold: { type: Number, default: 0 },     
    inStock: { type: Boolean, default: true } 
  },
  { timestamps: true }
);



const Shop = mongoose.model("Shop", shopSchema);
export default Shop;

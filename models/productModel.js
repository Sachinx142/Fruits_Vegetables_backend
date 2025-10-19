const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName : { type: String, default: null },
    productSlug: { type: String, default: null },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryModel",
      default: null,
    },
    subcategoryId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'subCategoryModel',
     default:null
    },
    actualPrice: { type: Number, default: null },
    discountedPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: null },
    stock: { type: Number, default: null },
    description: { type: String, default: null },
    productImage: { type: String, default: null },  
    seoTitle: { type: String, default: null },
    metaKeywords: { type: String, default: null },
    metaDescription: { type: String, default: null },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("productModel", productSchema);
module.exports = productModel

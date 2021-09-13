var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 250 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  brand: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  price: { type: Number, max: 100000, min: 1 }, //Price needs to be divided by 100 for cents
  productImage: { type: String, maxLength: 100 },
});

ProductSchema.virtual("url").get(function () {
  return "/product/" + this._id;
});

module.exports = mongoose.model("Product", ProductSchema);

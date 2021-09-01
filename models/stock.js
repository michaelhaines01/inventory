var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StockSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true, maxLength: 100 },
  inventory: { type: Number, required: true, max: 100, min: 0 },
});

StockSchema.virtual("url").get(function () {
  return "/stock/" + this._id;
});

module.exports = mongoose.model("Stock", StockSchema);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 250 },

  brandimage: { type: String },
});

BrandSchema.virtual("url").get(function () {
  return "/brands/" + this._id;
});

module.exports = mongoose.model("Brand", BrandSchema);

const { Schema, model } = require("mongoose");

const sellerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "seller",
  },
  status: {
    type: String,
    default: "pending",
  },
  payment: {
    type: String,
    default: "inactive",
  },
  method: {
    type: String,
    required: true,
  },
  shopInfo: {
    type: Object,
    default: {},
  },
},{timestamps: true});

module.exports = model("Seller", sellerSchema);

const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
},{timestamps: true});

categorySchema.index({
    category: 'text'
})

module.exports = model("Category", categorySchema);

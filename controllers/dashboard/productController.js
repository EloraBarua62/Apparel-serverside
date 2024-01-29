const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utiles/response");

class productController {
  product_add = async (req, res) => {
    const { id } = req;
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, field, files) => {
      let {
        name,
        category,
        description,
        shopName,
        brand,
        stock,
        price,
        discount,
      } = field;
      let { images } = files;

      console.log(category);
      name = name[0].trim();
      const slug = name.split(" ").join("-");

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        let allImagesUrl = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i].filepath, {
            folder: "products",
          });

          allImagesUrl = [...allImagesUrl, result.url];
        }

        const product = await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName: shopName[0].trim(),
          category: category[0].trim(),
          description: description[0].trim(),
          brand: brand[0].trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImagesUrl,
        });
        responseReturn(res, 201, { message: "products added successfully" });
      } catch (error) {
        responseReturn(res, 500, {
          error: error.message,
        });
      }
    });
  };

  product_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    console.log(page, searchValue, parPage);

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalproducts = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();

        responseReturn(res, 200, { totalproducts, products });
      }
        else if (searchValue === "" && page && parPage) {
          const products = await productModel
            .find({})
            .skip(skipPage)
            .limit(parPage)
            .sort({ createdAt: -1 });
          const totalProducts = await productModel.find({}).countDocuments();

          responseReturn(res, 200, { totalProducts, products });
        }
      else {
        const products = await productModel
          .find({ sellerId: id })
          .sort({ createdAt: -1 });
        const totalproducts = await productModel
          .find({ sellerId: id })
          .countDocuments();

        responseReturn(res, 200, { totalproducts, products });
      }
    } catch (error) {
      console.log(error);
    }
  };

  product_update = async (req, res) => {
    const id = req.params.productId;
    let { name, description, category, discount, price, stock, brand, images } =
      req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");

    try {
      await productModel.findByIdAndUpdate(id, {
        name,
        description,
        discount,
        category,
        price,
        stock,
        brand,
        slug,
        images,
      });

      const product = await productModel.findById(id);
      responseReturn(res, 200, { product, message: "Product update success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new productController();

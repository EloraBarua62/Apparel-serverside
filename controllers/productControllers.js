const sqldb = require("../utiles/database");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");

const create = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    let {
      product_name,
      color,
      brand_id,
      size,
      category_id,
      sub_category_id,
      sku,
      description,
      unit_price,
      discount,
      in_stock,
      on_order,
      reorder_level,
    } = fields;
    let { product_image } = files;




    product_name = product_name[0];
    color = JSON.parse(color[0]);
    brand_id = brand_id[0];
    size = size[0];
    category_id = category_id[0];
    sub_category_id = sub_category_id[0];
    sku = sku[0];
    description = description[0];
    unit_price = unit_price[0];
    discount = discount[0];
    in_stock = in_stock[0];
    on_order = on_order[0];
    reorder_level = reorder_level[0];


    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });

    const imageUrls = [];
    if (Array.isArray(product_image)) {
      for (const image of product_image) {
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: `product/${product_name}`,
      });
      imageUrls.push(result.url);
      }
    } else {
      const result = await cloudinary.uploader.upload(product_image.filepath, {
      folder: `product/${product_name}`,
      });
      imageUrls.push(result.url);
    }

    // const result = await cloudinary.uploader.upload(product_image.filepath, {
    //   folder: "product",
    // });

    console.log(imageUrls, color)
    try {
      const data_insert = `INSERT INTO products (product_name,
      color,
      brand_id,
      size,
      category_id,
      sub_category_id,
      sku,
      description,
      unit_price,
      discount,
      in_stock,
      on_order,
      reorder_level,
      product_image)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const data = await sqldb
        .promise()
        .query(data_insert, [
          product_name,
          JSON.stringify(color),
          brand_id,
          size,
          category_id,
          sub_category_id,
          sku,
          description,
          unit_price,
          discount,
          in_stock,
          on_order,
          reorder_level,
          JSON.stringify(imageUrls),
        ]);

      console.log(data);
      if (data[0].affectedRows > 0)
        responseReturn(res, 201, {
          message: "Product created",
        });
      else {
        responseReturn(res, 404, { error: "failed to create product" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "server error" });
    }
  });
};


const list_display = async (req, res) => {
  try {
    const {categories, sizes, colours, ratings, brands, query} = req.query;
    console.log(categories, sizes, colours, ratings, brands, query);

    let search = `SELECT * FROM products WHERE 1=1`;
    if (categories) {
      search += ` AND category_id IN (${categories.split(',').map(cat => `'${cat}'`).join(',')})`;
    }
    if (sizes) {
      search += ` AND size IN (${sizes.split(',').map(size => `'${size}'`).join(',')})`;
    }
    if (colours) {
      search += ` AND color IN (${colours.split(',').map(colour => `'${colour}'`).join(',')})`;
    }
    if (ratings) {
      search += ` AND rating IN (${ratings.split(',').map(rating => `'${rating}'`).join(',')})`;
    }
    if (brands) {
      search += ` AND brand_id IN (${brands.split(',').map(brand => `'${brand}'`).join(',')})`;
    }
    if (query) {
      search += ` AND (product_name LIKE '%${query}%' OR description LIKE '%${query}%')`;
    }
    const data = await sqldb.promise().query(search);
    console.log(data[0]);
    if (data[0].length)
      responseReturn(res, 201, {
        product_list: data[0],
        message: "product data loaded successfully",
      });
    else {
      responseReturn(res, 404, { error: "failed to load product" });
    }
  } catch (error) {
    responseReturn(res, 404, { error: error.message });
  }
};

module.exports = { create, list_display };

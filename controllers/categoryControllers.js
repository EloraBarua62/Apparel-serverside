const sqldb = require("../utiles/database");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");

const create = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    let { category_name } = fields;
    let { category_image } = files;
    category_name = category_name[0];
    category_image = category_image[0];

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });

    const result = await cloudinary.uploader.upload(category_image.filepath, {
      folder: "category",
    });
    try {
      const data_insert = `INSERT INTO categorys (category_name, category_image)
        VALUES (?,?)`;

      const data = await sqldb
        .promise()
        .query(data_insert, [category_name, result.url]);

      console.log("print 67 line", data);
      if (data[0].affectedRows > 0)
        responseReturn(res, 201, {
          message: "category created",
        });
      else {
        responseReturn(res, 404, { error: "failed to create category" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "server error" });
    }
  });
};

const list_display = async (req, res) => {
  try {
    // const search = `SELECT * FROM categorys`;

    const search = `SELECT categorys.category_id, category_name, category_image, categorys.created_at, categorys.updated_at, sub_category_id ,sub_category_name, sub_category_image FROM categorys LEFT OUTER JOIN sub_categorys ON (categorys.category_id = sub_categorys.category_id)`;
    const data = await sqldb.promise().query(search);

    const length = data[0].length;
    let final_result = data[0];
    if (length >= 2) {
      let outer_array = [],
        inner_array_name = [final_result[0].sub_category_name],
        inner_array_image = [final_result[0].sub_category_image];
      for (let i = 1; i < length; i++) {
        if (
          final_result[i].category_name === final_result[i - 1].category_name
        ) {
          inner_array_name.push(final_result[i].sub_category_name);
          inner_array_image.push(final_result[i].sub_category_image);
        } else {
          const keep_data = {
            category_id: final_result[i - 1].category_id,
            category_name: final_result[i - 1].category_name,
            category_image: final_result[i - 1].category_image,
            sub_category_name: inner_array_name,
            sub_category_image: inner_array_image,
            created_at: final_result[i - 1].created_at,
            updated_at: final_result[i - 1].updated_at,
          };
          outer_array.push(keep_data);
          inner_array_name = [final_result[i].sub_category_name];
          inner_array_image = [final_result[i].sub_category_image];
        }
      }
      const last_data = {
        category_id: final_result[length - 1].category_id,
        category_name: final_result[length - 1].category_name,
        category_image: final_result[length - 1].category_image,
        sub_category_name: inner_array_name,
        sub_category_image: inner_array_image,
        created_at: final_result[length - 1].created_at,
        updated_at: final_result[length - 1].updated_at,
      };
      outer_array.push(last_data);
      final_result = outer_array;
      outer_array = [];
      inner_array_name = [];
      inner_array_image = [];
    }

    if (data.length)
      responseReturn(res, 201, {
        category_list: final_result,
        message: "category data loaded successfully",
      });
    else {
      responseReturn(res, 404, { error: "failed to load category" });
    }
  } catch (error) {
    responseReturn(res, 404, { error: error.message });
  }
};

const sub_category_create = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    let { sub_category_name, category_id } = fields;
    let { sub_category_image } = files;
    sub_category_name = sub_category_name[0];
    category_id = category_id[0];
    sub_category_image = sub_category_image[0];

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });

    console.log(sub_category_name, category_id);
    const result = await cloudinary.uploader.upload(
      sub_category_image.filepath,
      {
        folder: "category",
      }
    );
    try {
      const data_insert = `INSERT INTO sub_categorys (sub_category_name, category_id, sub_category_image)
        VALUES (?,?,?)`;

      const data = await sqldb
        .promise()
        .query(data_insert, [sub_category_name, category_id, result.url]);

      console.log(data);
      if (data[0].affectedRows > 0)
        responseReturn(res, 201, {
          message: "sub-category created",
        });
      else {
        responseReturn(res, 404, { error: err.message });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  });
};

module.exports = { create, list_display, sub_category_create };

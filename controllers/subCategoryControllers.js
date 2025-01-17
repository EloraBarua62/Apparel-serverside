const sqldb = require("../utiles/database");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");

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

const list_display = async (req, res) => {
  // const categoryId = req.params.id;

  const query = `SELECT * FROM sub_categorys`;

  try {
    const data = await sqldb.promise().query(query);

    console.log(data[0])
    if (data[0].length)
      responseReturn(res, 200, {
        sub_category: data[0],
        message: "sub-category data loaded successfully",
      });
    else {
      responseReturn(res, 404, { error: "sub-category not found" });
    }
  } catch (error) {
    responseReturn(res, 500, { error: error.message });
  }
};

module.exports = { sub_category_create, list_display };

const sqldb = require("../utiles/database");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");

const create = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    let {
      brand_name,
      brand_status,
      brand_details,
    } = fields;
    let { logo_image, background_image } = files;
    brand_name = brand_name[0];
    brand_status = brand_status[0];
    brand_details = brand_details[0];
    logo_image = logo_image[0];
    background_image = background_image[0];

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });

    const logo = await cloudinary.uploader.upload(logo_image.filepath, {
      folder: "brand",
    });
    const background = await cloudinary.uploader.upload(background_image.filepath, {
      folder: "brand",
    });
    try {
      const data_insert = `INSERT INTO brands (brand_name, brand_status, brand_details, logo_image, background_image)
        VALUES (?,?,?,?,?)`;

      const data = await sqldb
        .promise()
        .query(data_insert, [
          brand_name,
          brand_status,
          brand_details,
          logo.url,
          background.url,
        ]);

      console.log("print 67 line", data);
      if (data[0].affectedRows > 0)
        responseReturn(res, 201, {
          message: "brand created",
        });
      else {
        responseReturn(res, 404, { error: "failed to create brand" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "server error" });
    }
  });
};

const list_display = async (req, res) => {
  try{
    const data = await sqldb.promise().query(`SELECT * FROM brands`)

    if (data.length)
      responseReturn(res, 201, {
        brand_list: data[0],
        message: "brand data loaded successfully",
      });
    else {
      responseReturn(res, 404, { error: "failed to load brand" });
    }
  }
  catch(error){
    responseReturn(res, 500, {error: error.message})
  }
}


// const sub_category_create = async (req, res) => {
//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     let { sub_category_name, category_id } = fields;
//     let { sub_category_image } = files;
//     sub_category_name = sub_category_name[0];
//     category_id = category_id[0];
//     sub_category_image = sub_category_image[0];

//     cloudinary.config({
//       cloud_name: process.env.cloud_name,
//       api_key: process.env.api_key,
//       api_secret: process.env.api_secret,
//       secure: true,
//     });

//     console.log(sub_category_name, category_id);
//     const result = await cloudinary.uploader.upload(
//       sub_category_image.filepath,
//       {
//         folder: "category",
//       }
//     );
//     try {
//       const data_insert = `INSERT INTO sub_categorys (sub_category_name, category_id, sub_category_image)
//         VALUES (?,?,?)`;

//       const data = await sqldb
//         .promise()
//         .query(data_insert, [sub_category_name, category_id, result.url]);

//       console.log(data);
//       if (data[0].affectedRows > 0)
//         responseReturn(res, 201, {
//           message: "sub-category created",
//         });
//       else {
//         responseReturn(res, 404, { error: err.message });
//       }
//     } catch (error) {
//       responseReturn(res, 500, { error: error.message });
//     }
//   });
// };

module.exports = { create, list_display};

const sqldb = require("../utiles/database");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");

const create = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
      let {
        email,
        shop_name,
        shop_details,
        shop_location,
        contact,
        bank_name,
        branch_name,
        account_no,
        facebook,
        instagram,
      } = fields;
      let { image_show } = files;

      email = email[0];
      shop_name = shop_name[0];
      shop_details = shop_details[0];
      shop_location = shop_location[0];
      contact = contact[0];
      bank_name = bank_name[0];
      branch_name = branch_name[0];
      account_no = account_no[0];
      facebook = facebook[0];
      instagram = instagram[0];
      image_show = image_show[0];

      
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      const result = await cloudinary.uploader.upload(image_show.filepath, {
        folder: "shop",
      });
      try {
      const data_insert = `INSERT INTO shops (email, shop_name, shop_details, shop_location, contact, bank_name, branch_name, account_no, facebook, instagram, image_show)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

      const data = await sqldb
        .promise()
        .query(data_insert, [
          email,
          shop_name,
          shop_details,
          shop_location,
          contact,
          bank_name,
          branch_name,
          account_no,
          facebook,
          instagram,
          result.url
        ]);

        console.log('print 67 line',data)
        if (data[0].affectedRows > 0)
          responseReturn(res, 201, {
            message: "shop created",
          });
        else {
          responseReturn(res, 404, { error: "failed to create shop" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: "server error" });
      }
  });
};

const list_display = async (req, res) => {
  try {
    console.log('shop request')
    const search = `SELECT * FROM shops`;
    const data = await sqldb.promise().query(search);
    console.log(data)
    if (data.length)
      responseReturn(res, 201, {
        shop_list: data[0],
        message: "shops data loaded successfully",
      });
    else {
      responseReturn(res, 404, { error: "failed to load shops" });
    }
  } catch (error) {
    responseReturn(res, 404, { error: error.message });
  }
};

module.exports = { create, list_display };

const categoryModel = require("../../models/categoryModel");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../../utiles/response");

class categoryControllers {
  category_add = async (req, res) => {
    
    const form = new formidable.IncomingForm();
   
    form.parse(req, async (err, fields, files) => {
      
      if (err) {
        responseReturn(res, 404, { error: "someting error" });
      } else {
        let { category, sub_category } = fields;
        let { image } = files;
        console.log(category[0], sub_category[0], image[0])
        category = category[0].trim();
        sub_category = sub_category[0];
        image = image[0];
        
        const slug = category.split(" ").join("-");
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });
        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "category",
          });
          if (result) {
            const single_category = await categoryModel.create({
              category,
              sub_category,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              single_category,
              message: "category and success",
            });
          } else {
            responseReturn(res, 404, {error: "Image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 500, {
            error: "Internal server error",
          });
        }
      }
    });
  };

  category_get = async(req, res) => {
    const {page, searchValue, parPage} = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1)

    try {
      if(searchValue){
        const categories = await categoryModel.find({
          $text: {$search: searchValue}
        }).skip(skipPage).limit(parPage).sort({createdAt: -1})
        const totalCategory = await categoryModel.find({
          $text: { $search: searchValue }
        }).countDocuments()

        responseReturn(res, 200 , {totalCategory, categories})
      }
      else{
        const categories = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({})
          .countDocuments()


        responseReturn(res, 200, { totalCategory, categories });

      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new categoryControllers();

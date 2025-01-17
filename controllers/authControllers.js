const formidable = require("formidable");
const adminModel = require("../models/adminModel");
const sellerCustomerModel = require("../models/sellerCustomerModel");
const sellerModel = require("../models/sellerModel");
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/tokenCreate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { getUser } = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

class authControllers {
  // get_user = (req, res) => {
  //   let data = [];
  //   try {
  //     data = getUser();
  //     console.log(data)
  //     responseReturn(res, 200, { userInfo: data });
  //   } catch (error) {
  //     responseReturn(res, 500, { message: "Internal server error" });
  //   }
  // }
  // admin signup
  admin_signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const getUser = await adminModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, {
          error: "Email already exist, try with another email address",
        });
      } else {
        const admin = await adminModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "menually",
        });

        const token = await createToken({ id: admin.id, role: admin.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
        });
        responseReturn(res, 201, { token, message: "admin sinup success" });
      }
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  // Admin login
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(req.body);
    try {
      const admin = await adminModel.findOne({ email }).select("+password");

      if (admin) {
        const match = await bcrypt.compare(password, admin.password);

        if (match) {
          const token = await createToken({
            id: admin._id.valueOf(),
            role: admin.role,
          });

          console.log(admin.name);
          const name = admin.name;
          const email = admin.email;
          res.cookie("accessToken", token);
          responseReturn(res, 200, {
            token,
            userInfo: { name, email },
            message: "Login success",
          });
          console.log(req.cookies.accessToken);
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // seller login
  seller_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const seller = await sellerModel.findOne({ email }).select("+password");

      if (seller) {
        const match = await bcrypt.compare(password, seller.password);

        if (match) {
          const token = await createToken({
            id: seller._id.valueOf(),
            role: seller.role,
          });

          const credential = {
            name: seller.name,
            email: seller.email,
            image: seller.image,
            role: seller.role,
            status: seller.status,
            payment: seller.payment,
            method: seller.method,
            shopInfo: seller.shopInfo,
          };
          res.cookie("accessToken", token);
          responseReturn(res, 200, {
            token,
            userInfo: credential,
            message: "Login success",
          });
          // console.log(req.cookies.accessToken);
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, {
          error: "Email already exist, try with another email address",
        });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "menually",
          shopInfo: {},
        });
        await sellerCustomerModel.create({
          myId: seller.id,
        });

        const token = await createToken({ id: seller.id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
        });
        responseReturn(res, 201, { token, message: "sinup success" });
      }
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  // User Info
  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else console.log("seller info");
    } catch (error) {}
  };
  
  
  profile_image_upload = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    const {id} = req;
    form.parse(req, async (err, _ , files) => {
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
      secure: true,
    });
     

    const {image} = files;
    console.log(image[0].filepath)
    try {
      const result = await cloudinary.uploader.upload(image[0].filepath, {
        folder: "profile",
      });

      if(result){
        await sellerModel.findByIdAndUpdate(id, {
          image: result.url
        })
        const userInfo = await sellerModel.findById(id);
        responseReturn(res, 201, {
          message: "image upload successfully",
          userInfo,
        });
      }
      else{
        responseReturn(res, 404, {error: 'failed to upload image'})
      }
    } catch (error) {
        responseReturn(res, 500, { message: "Internal server error" });
    }
     
    })
  };
}




module.exports = new authControllers();

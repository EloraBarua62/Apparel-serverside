const adminModel = require("../models/adminModel");
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/tokenCreate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const admin = await adminModel.findOne({ email }).select("+password");

      
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        
        
        if (match) {
          const token = await createToken({
            id: admin._id.valueOf(),
            role: admin.role,
          });


          console.log(admin.name)
          const name = admin.name;
          const email = admin.email;
          res.cookie("accessToken", token);
          responseReturn(res, 200, { token, userInfo : {name , email}, message: "Login success" });
          console.log(req.cookies.accessToken);
        } 
        else {
          responseReturn(res, 404, { error: "Password wrong" });
        }


      } 
      
      else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } 
    catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
    
  };





  // User Info
  getUser = async(req, res) => {
    const {id, role} = req;

    try {
      if(role === 'admin'){
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      }
      else
      console.log("seller info");
    } catch (error) {
      
      
    }
  }
}

module.exports = new authControllers();

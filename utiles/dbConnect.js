// import mongoose
const mongoose = require("mongoose");

// db connection
module.exports.dbConnect = async() => {
    try{
        await mongoose.connect(process.env.DATABASE , {
            useNewURLParser: true})
            console.log("database connect")
        }
    catch(error){
        console.log(error.message)
    }
}
 


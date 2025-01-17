const sqldb = require("../utiles/database");
const { responseReturn } = require("../utiles/response");

const get_user = async (req, res) => {
  try {
    const search = "SELECT * FROM users";
    const data = await sqldb.promise().query(search);
    if (!data) responseReturn(res, 400, { mesage: "No data available" });
    else {
      responseReturn(res, 200, { userInfo: data[0] });
    }
  } catch (error) {
    responseReturn(res, 500, { error: "server error" });
  }
};

const signup = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(email,role);
  try {
    const search = `
      INSERT INTO users (email, password, role)
      SELECT ?,?,?
      WHERE NOT EXISTS (
      SELECT 1
      FROM users
      WHERE email = ? );`;

    const data = await sqldb
      .promise()
      .query(search, [email,password,role, email]);
    console.log(data);
    
  } catch (error) {
    responseReturn(res, 500, { error: error.message });
  }
};

module.exports = { get_user, signup };

const sqldb = require("../utiles/database");

const getUser = async () => {
  try {
    const search = "SELECT * FROM user";
    // const data = await sqldb.pro
  } catch (error) {
    return error;
  }
  
};
// const getUser = async () => {
//   let query = "SELECT * FROM user";
//   const result = await sqldb
//     .execute(query)
//     .then(([rows, fileData]) => {
//       console.log(rows)
//       return rows;
//     })
//     .catch((err) => {
//       return result;
//     });
// };
module.exports =  {getUser};

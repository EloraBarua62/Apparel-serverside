const mysql = require('mysql2');

// Createpool is used to make a permanent connection so that app doesn't need to start and end connection each time it need to do some query,
//  while createconnection is disrupted connection and we need to start, end the connection during any query
const sqldb = mysql.createPool({
  host: "localhost",
  database: "apparel",
  user: "root",
  password: "Elora62Barua@",
});

sqldb.getConnection((err, connection) => {
  if (err) throw err;
  else {
    const shop_table = `
      CREATE TABLE IF NOT EXISTS shops (
        shop_id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(45) NOT NULL UNIQUE,
        shop_name TEXT NOT NULL,
        shop_details LONGTEXT NOT NULL,
        shop_location LONGTEXT NOT NULL,
        contact TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        branch_name TEXT NOT NULL,
        account_no TEXT NOT NULL,
        facebook TEXT NOT NULL,
        instagram TEXT NOT NULL,
        image_show TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
        FOREIGN KEY (email)  
        REFERENCES users (email)    
        );`


    const category_table = `CREATE TABLE IF NOT EXISTS categorys (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        category_name TEXT NOT NULL,
        category_image TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    
        );`
    
    const sub_category_table = `CREATE TABLE IF NOT EXISTS sub_categorys (
        sub_category_id INT PRIMARY KEY AUTO_INCREMENT,
        sub_category_name TEXT NOT NULL,
        sub_category_image TEXT NOT NULL, 
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,   
        FOREIGN KEY (category_id)  
        REFERENCES categorys (category_id) 
        );`;

    const brand_table = `CREATE TABLE IF NOT EXISTS brands (
        brand_id INT PRIMARY KEY AUTO_INCREMENT,
        brand_name TEXT NOT NULL,
        brand_status TEXT NOT NULL,
        brand_details TEXT NOT NULL,
        logo_image TEXT NOT NULL, 
        background_image TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    
        );`;

    const product_table = `CREATE TABLE IF NOT EXISTS products (
      product_id INT PRIMARY KEY AUTO_INCREMENT,
      product_name TEXT NOT NULL,
      color JSON NOT NULL,
      brand_id INT,
      size TEXT NOT NULL, 
      category_id INT,
      sub_category_id INT,
      sku TEXT NOT NULL, 
      description TEXT NOT NULL, 
      unit_price TEXT NOT NULL, 
      discount TEXT NOT NULL, 
      in_stock TEXT NOT NULL, 
      on_order TEXT NOT NULL, 
      reorder_level TEXT NOT NULL, 
      product_images JSON NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categorys (category_id),
      FOREIGN KEY (sub_category_id) REFERENCES sub_categorys (sub_category_id),
      FOREIGN KEY (brand_id) REFERENCES brands (brand_id)
      );`;
    
    connection.query(shop_table, (err, result) => {
      if (err) throw err;
      console.log("shops table created", result);
    });
        
    connection.query(category_table, (err, result) => {
      if (err) throw err;
      console.log("categorys table created", result);
    });
    connection.query(sub_category_table, (err, result) => {
      if (err) throw err;
      console.log("sub categorys table created", result);
    });
    connection.query(brand_table, (err, result) => {
      if (err) throw err;
      console.log("brand table created", result);
    });
    connection.query(product_table, (err, result) => {
      if (err) throw err;
      console.log("product table created", result);
    });
  }
});
// Promise is used to avoid callback function, to easily handle async functionality in structured way
module.exports = sqldb;
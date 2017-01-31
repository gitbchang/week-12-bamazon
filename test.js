var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",
    password: "162605",
    database: "bamazon"
});

// CONNECT TO THE DATABASE
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    connection.query("SELECT * FROM products prod JOIN departments dep ON prod.department_name=dep.department_name WHERE item_id=1", function(err, res){
      if(err) console.log(err);

      console.log(res[0]);
      console.log(res[0].total_sales);
    });

});

var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('easy-table');

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
    // Run Customer view function
    supervisorView();
});


function supervisorView(){
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department"],
      name: "superChoice"
    }
  ]).then(function(user){
    if(user.superChoice === "View Product Sales by Department"){
      viewSalesByDept();
    }
    else if(user.superChoice === "Create New Department"){
      createDept();
    }
  });
}


function viewSalesByDept(){
  connection.query("SELECT dep.department_id,dep.department_name, dep.over_head_costs, prod.product_sales, (prod.product_sales - dep.over_head_costs) AS total_profit FROM departments dep LEFT JOIN products prod ON dep.department_name=prod.department_name GROUP BY prod.department_name ORDER BY dep.department_id", function(err, res){
    if(err) console.log(err);

    // console.log(res);
    console.log(table.print(res));
    supervisorView();
  });
}

function createDept(){
    inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the new Department?",
        name: "dep_Name"
      },
      {
        type: "input",
        message: "What is the overhead cost for this department?",
        name: "dep_over_cost",
        validate: function(str) {
                // only accept numbers
                return !(isNaN(str));
            }
      }
    ]).then(function(user){
      var newDept = user.dep_Name;
      var newDeptOver = user.dep_over_cost;
      connection.query("INSERT INTO departments SET ?", {
        department_name: newDept,
        over_head_costs: newDeptOver
      }, function(err, res){
        if(err) console.log(err);

        console.log("New Department has been added!");
        supervisorView();
      });
    });
}

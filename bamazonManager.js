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
    managerView();
});

function managerView(){
  inquirer.prompt([{
      type: "list",
      message: "What would you like to do?",
      choices: ["See All Items For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
      name: "managerAction"
  }]).then(function(user) {
      switch(user.managerAction){
          case "See All Items For Sale":
            listItems();
          break;
          case "View Low Inventory":
            viewLowInventory();
          break;
          case "Add to Inventory":
            addToInventory();
          break;
          case "Add New Product":
            addProduct();
          break;
          default:
          console.log("Sorry");
          break;
      }

  });
}

function listItems(){
    connection.query("select item_id, product_name, price FROM products WHERE stock_quantity > 0",
    function(err, res) {
        console.log("====================================================" + "\r\n");
        console.log("Item ID |  Product Name  | Price");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("====================================================" + "\r\n");
        // Return manager to main menu
        managerView();
    });
}

function viewLowInventory(){
    connection.query("select * FROM products WHERE stock_quantity < 5",    function(err, res) {
        console.log("====================================================" + "\r\n");
        console.log("Item ID |  Product Name  | Price  |  Stock Quantity");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("====================================================" + "\r\n");
        // Return manager to main menu
        managerView();
    });
}

function addToInventory() {
    // UPDATE `bamazon`.`products` SET `stock_quantity`='4' WHERE `item_id`='9';
    connection.query("select * FROM products",
        function(err, res) {
            console.log("====================================================" + "\r\n");
            // console.log("Item ID |  Product Name  | Price");
            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
            // }
            console.log(table.print(res));
            console.log("====================================================" + "\r\n");
        });
    inquirer.prompt([{
        type: "input",
        message: "Please Input the ID of the item you would like to update" + "\r\n",
        name: "itemID",
        validate: function(str) {
            // only accept numbers
            return !(isNaN(str));
        }
    }, {
        type: "input",
        message: "Enter amount of re-stocking shipment",
        name: "restockAmount",
        validate: function(str) {
            // only accept numbers
            return !(isNaN(str));
        }
    }]).then(function(user) {
        var itemID = user.itemID;
        var addStock = user.restockAmount;
        connection.query("SELECT * FROM products WHERE ?", {
                item_id: user.itemID
            },
            function(err, res) {
                if (err) console.log(err);
                // Getting the current stock of whatever item
                var currentStock = res[0].stock_quantity;
                // Update the stock_quantity
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: (currentStock + addStock)
                }, {
                    item_id: itemID
                }], function(err, res) {
                    if (err) console.log(err);
                    console.log("Item has been restocked");
                    connection.query("SELECT * FROM products WHERE ?", {
                            item_id: itemID
                        },
                        function(err, res) {
                            console.log(res[0].item_id + " | " + res[0].product_name + " | " + res[0].stock_quantity + "\r\n");
                            managerView();

                        });
                });
            });



    });


}

function addProduct() {
    // INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('Testing', 'Electronics', '4.99', '0');
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the new product?",
        name: "name_of_product"
    }, {
        type: "input",
        message: "What department does this product belong in?",
        name: "departmentName"
    }, {
        type: "input",
        message: "Price of the new product?",
        name: "productPrice"
    }, {
        type: "confirm",
        message: "Is this new Product in stock?",
        name: "productInStock"
    }, {
        type: "input",
        message: "What is the initial stock of this product?",
        name: "stockAmount",
        validate: function(str) {
            // only accept numbers
            return !(isNaN(str));
        },
        when: function(answers) {
            return answers.productInStock === true;
        }
    }]).then(function(user) {
        var productName = user.name_of_product;
        var departmentName = user.departmentName;
        var productPrice = user.productPrice;
        var stockAmount;
        if (user.productInStock === false) {
            stockAmount = 0;
        } else {
            stockAmount = user.stockAmount;
        }

        connection.query("INSERT INTO products SET ?", {
            product_name: productName,
            department_name: departmentName,
            price: productPrice,
            stock_quantity: stockAmount
        }, function(err, res) {
            if (err) console.log(err);
            console.log("System has been updated!");
            console.log("====================================================" + "\r\n");
            managerView();

        });



    });




}

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
    customerView();
});


function customerView() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["See All Items For Sale", "Buy a Product"],
        name: "seeOrBuy"
    }]).then(function(user) {
        if (user.seeOrBuy === "See All Items For Sale") {
            listItems();
        } else if (user.seeOrBuy === "Buy a Product") {
            buyProduct();
        }

    });


}

function listItems() {
    connection.query("select item_id, product_name, price FROM products",
        function(err, res) {
            console.log("====================================================" + "\r\n");
            // console.log("Item ID |  Product Name  | Price");
            // for (var i = 0; i < res.length; i++) {
            //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
            // }
            console.log(table.print(res));
            console.log("====================================================" + "\r\n");
            // Return customer to main menu
            customerView();
        });

}




function buyProduct() {
    inquirer.prompt([{
            type: "input",
            message: "Please enter the ID of the product you would like to purchase",
            name: "productID"
        },
        {
            type: "input",
            message: "How many units of this product would you like to purchase?",
            name: "buyQuantity"
        }
    ]).then(function(user) {
        var itemQuantity = user.buyQuantity;
        var productID = user.productID;
        // check if there is enough product to sell
        connection.query("select * FROM products WHERE item_id=?", [user.productID],
            function(err, res) {
                var purchaseItem = res[0].product_name;
                var itemPrice = res[0].price;
                var currentRev = res[0].product_sales;
                var departmentName = res[0].department_name;
                // also the total revenue
                var finalPrice = itemPrice * itemQuantity;
                if (err) console.log(err);
                // console.log(res[0].stock_quantity);
                // console.log(itemQuantity);
                if (res[0].stock_quantity < itemQuantity) {
                    console.log("Insufficient Quantity!");
                    customerView();
                } else {
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: (res[0].stock_quantity - itemQuantity),
                        product_sales: (currentRev + finalPrice)
                    }, {
                        item_id: productID
                    }], function(err, res) {
                        if (err) console.log(err);
                        // console.log(res);
                        console.log("====================================================" + "\r\n");
                        console.log("Thank you for your purchase of " + purchaseItem + " | " + "Quantity: " + itemQuantity);
                        console.log("Order Total: $" + finalPrice);
                        console.log("====================================================" + "\r\n");

                    });
                    // Update the Department Total Sales
                    connection.query("SELECT * FROM departments WHERE department_name=?", [departmentName],
                    function(err, res){
                        if(err) console.log(err);
                        var currentTotalSales = res[0].total_sales;
                            connection.query("UPDATE departments SET ? WHERE ?", [{
                                total_sales: (currentTotalSales + finalPrice)
                            }, {
                                department_name: departmentName
                            }], function(err, res){
                                if(err) console.log(err);

                                console.log("Department - Total Sales has been updated");
                                customerView();
                            });
                    });
                }
            });
    });
}

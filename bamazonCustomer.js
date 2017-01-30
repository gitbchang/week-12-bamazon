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
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
            }
            console.log("====================================================" + "\r\n");
            // Return customer to main menu
            customerView();
        });

}




function buyProduct() {

}

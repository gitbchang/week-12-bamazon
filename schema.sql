CREATE DATABASE Bamazon;
USE Bamazon;

CREATE TABLE products(
	item_id integer(11) not null auto_increment primary key,
    product_name varchar(50),
    department_name varchar(50),
    price decimal(10,4),
    stock_quanity integer(11)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Amazon Echo Dot", "Electronics", 49.99, 10000),
("Cards Against Humanity", "Toys & Games", 29.99, 5000),
("1984 (Signet Classics)", "Books", 19.99, 15000),
("GoPro Hero 5", "Camera & Photo", 349.99, 3500),
("Colgate Total Whitening Toothpase", "Beauty", 4.94, 30000),
("Philips Sonicare Electric Toothbrush", "Beauty", 19.99, 45000),
("GoYoga All Purpose Yoga Mat", "Sports & Outdoors", 19.99, 13500),
("Camelbak Water Bottle", "Sports & Outdoors", 14.99, 29000),
("Amazon Fire Tablet", "Electronics", 49.99, 14000),
("Bose QuietComfort 35 Wireless Headphones", "Electronics", 349.99, 2500),
("Samsung 55 inch 4k ULTRA HDTV", "Electronics", 799.99, 100);


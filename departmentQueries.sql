SELECT * FROM bamazon.departments;

select DISTINCT department_name FROM products;

SELECT * FROM departments dep
JOIN products prod 
ON dep.department_name=prod.department_name;

select * FROM departments group by department_name;


SELECT dep.department_id, dep.department_name, dep.over_head_costs, prod.product_sales, (prod.product_sales - dep.over_head_costs) AS total_profit FROM departments dep
JOIN products prod 
ON dep.department_name=prod.department_name
GROUP BY prod.department_name;





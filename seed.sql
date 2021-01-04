USE employee_db;

INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 55000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Engineering Lead", 160000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Service Manager", 50000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Product Specialist", 35000, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Frank", "Stabapolis", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Winston", "Johnson", 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("John", "Kuhlman", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Liam", "Bambery", 3, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jason", "Herlack", null, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Lizzy", "Mueller", 5, 6);

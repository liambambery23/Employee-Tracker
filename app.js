const inquirer = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");
const { start } = require("repl");



const connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "junie",
    database: "employee_db",
});

connection.connect (function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    mainMenu()
});

function mainMenu() {
    inquirer.prompt([
      {
          type: "list",
          message: "What would you like to do?",
          name: "operation",
          choices: [
              "View all employees",
              "View all roles",
              "View all departments",
              "Add employee",
              "Update employee role",
              "Add role",
              "Add department",
          ]
      }  
    ])
    .then(function(val) {
        switch (val.operation) {
            case "View all employees":
                viewEmployees();
                break;

            case "View all roles":
                viewRoles();
                break;

            case "View all departments":
                viewDepartments();
                break;

            case "Update employee role":
                updateEmployee();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Add role":
                addRole();
                break;

            case "Add department":
                addDeparment();
        }
    })
};

function viewEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

function viewRoles() {
    connection.query("SELECT  role.id, role.title, role.department_id, department.name AS Title FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

function viewDepartments() {
    connection.query("SELECT MIN(id) AS id, name FROM department GROUP BY name",
    function (err, res) {
        if (err) throw err
        console.table(res);;
        mainMenu();
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter the employees first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter the employees last name"
        },
        {
            name: "role",
            type: "input",
            message: "Enter the employees role ID"
        },
        {
            name: "manager",
            type: "input",
            message: "What is the employee ID of this persons manager?"
        },
    ])
    .then (function(val) {
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: val.firstName,
            last_name: val.lastName,
            role_id: val.role,
            manager_id: val.manager,
        },
        function (err) {
            if (err) throw err;
            console.log("New Employee Added!");
            mainMenu();
        }
    );
    });
};




function updateEmployee() {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "input",
            message: "Enter the employees ID"
        },
        {
            name: "roleId",
            type: "input",
            message: "Choose a role"
        },
        
    ]).then(function(data){
        var query = connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: data.roleId
              },
              {
                id: data.employeeId
              }
            ],
            function(err, res) {
              if (err) throw err;
              console.log("Employee updated!");
              mainMenu();
            }
          );
        
    })
    
};



function addRole() {
    inquirer.prompt([
        {
            name: "role",
            type: "input",
            message: "What is the new role you would like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "department",
            type: "input",
            message: "Enter the department ID",
        },
    ])
    .then (function(val) {
        connection.query("INSERT INTO role SET ?",
        {
            title: val.role,
            salary: val.salary,
            department_id: val.department,
        },
        function (err) {
            if (err) throw err;
            console.log("New Role Added!");
            mainMenu();
        }
    );
    });
}

function addDeparment() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the new department you would like to add?"
        }
    ])
    .then (function(val) {
        connection.query("INSERT INTO department SET ?",
        {
            name: val.department,
        },
        function (err) {
            if (err) throw err;
            console.log("New Department Added!");
            mainMenu();
        }
    );
    });
};
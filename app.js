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
              "View all employees by role",
              "View all employees by department",
              "Update employees",
              "Add employee",
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

            case "View all employees by role":
                viewRoles();
                break;

            case "View all employees by department":
                viewDepartments();
                break;

            case "Update employees":
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
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

function viewRoles() {
    connection.query("SELECT role.title, role.department_id, department.name AS Title FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

function viewDepartments() {
    connection.query("SELECT * FROM department",
    function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

let roleArray = [];
function chooseRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    });
    return roleArray;
}

let managersArray = [];
function chooseManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err;
        for (let i =0; i < res.length; i++) {
            managersArray.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    return managersArray;
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
            type: "list",
            message: "Select the employees role",
            choices: chooseRole()
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employees manager?",
            choices: chooseManager()
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
    console.log("This works")
};

function addRole() {
    console.log("This works")
};

function addDeparment() {
    console.log("This works")
};
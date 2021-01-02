const inquirer = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");
const { start } = require("repl");
const { listenerCount, allowedNodeEnvironmentFlags } = require("process");

const connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "junie",
    database: "employee_db",
});

connection.connect (function(err) {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);
    start()
});

function start() {
    inquirer.prompt([
      {
          type: listenerCount,
          message: "What would you like to do?",
          name: "operation",
          choices: [
              "View all employees",
              "View all employees by role",
              "View all employees by departments",
              "Update employee",
              "Add employees",
              "Add role",
              "Add department",
          ]
      }  
    ])
    .then(function(val) {
        switch (val.choice) {
            case "View all employees":
                viewEmployees();
            break;

            case "View all employees by role":
                viewRoles();
            break;

            case "View all employees by department":
                viewDeparments();
            break;

            case "Update employess":
                updateEmployee();
            break;

            case "Add Employee":
                addEmployee();
            break;

            case "Add role":
                addRole();
            break;

            case "Add department":
                addDeparment();
            break;
        }
    })
};


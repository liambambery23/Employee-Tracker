const inquirer = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");
const { start } = require("repl");
var employIdArr=[];


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
    connection.query("SELECT * FROM role_id", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].id);
        }
    });
    return roleArray;
}

let managersArray = [];
function chooseManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL", function (err, res) {
        if (err) throw err;
        for (let i =0; i < res.length; i++) {
            managersArray.push(res[i].manager_id);
        }
    });
    return managersArray;
};
//make sure to create manager id and role id prior to creating employee
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
            message: "Enter the employees role ID",
            // choices: ["1","2"]//chooseRole()
        },
        {
            name: "manager",
            type: "input",
            message: "What is the employees manager ID?",
            // choices:["1","2"] //chooseManager()
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

function getEmployeeId(){
    //make a communcation to db.. grab all employeeid
    // connection.query("SELECT * FROM employee",
    // function (err, res) {
    //     if (err) throw err;
    //    // console.log(res)

    //     for(var i=0; i<res.length;i++){
    //         employIdArr.push(res.id)
    //     }
    //     return employIdArr;
    //      //store it into a cleaner array (map)
    //     //  var employeIdArr = res.map( (curremploy =>({
    //     //     name: curremploy.first_name + " "+ curremploy.last_name,
    //     //    value:curremploy.id  
    //     //  })))
    //     //  return employeIdArr;
      
    // });

   
 

   
    
}

function updateEmployee() {
    inquirer.prompt([
        {
            name: "roleId",
            type: "input",
            message: "Choose a role"
        },
        {
            name: "employeeId",
            type: "input",
            message: "Enter the employees ID"
        },
    ]).then(function(data){
        console.log(data)
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
              console.log("employee updated!");
              mainMenu();
            }
          );
        
    })
    //get employeeID
    //  connection.query("SELECT * FROM employee",
    // function (err, res) {
    //     if (err) throw err;
    //    // console.log(res)
    //    for(var i=0;i<res.length;i++){
    //        employIdArr.push(res.id);
    //    }
    //    console.log(employIdArr);
    // });
   //console.log(getEmployeeId());
   //then call inquirer
   //with id ask all the update q's
//    var employee= await viewEmployees();
//    var allEmployee= employee.map(({id, first_name})=>({
//        name: first_name,
//        value:id
//    }));

//    console.log(allEmployee)
    
};

function showDept() {
    connection.query("SELECT * FROM department",
    function (err, res) {
        if (err) throw err;
        console.table(res);
    }
    )};

function addRole() {
    showDept();
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
            // choices: ["1","2"]//chooseRole()
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
    console.log("This works")
};
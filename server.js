const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "Wildcats123!",
    database: "employee_tracker_db"
});

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            return;
         }

    console.log(`Connected to the employee_tracker_db database.`);
    optionPrompt();
});


function optionPrompt(){
    inquirer.prompt([
    {
        type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: [
            "View All Departments.",
            "View All Roles.",
            "View All Employees.",
            "Add a Department.",
            "Add a Role.",
            "Add an Employee.",
            "Update an Employee Role.",
            "Exit"
        ]
    }
    ]).then((res) =>{
        console.log(res.userChoice);
        switch(res.userChoice){
            case "View All Departments.":
                viewAllDepartments();
                break;
            case "View All Roles.":
                viewAllRoles();
                break;
            case "View All Employees.":
                viewAllEmployees();
                break;
            case "Add a Department.":
                addDepartment();
                break;
            case "Add a Role.":
                addRole();
                break;
            case "Add an Employee.":
                addEmployee();
                break;
            case "Update an Employee Role.":
                updateRole();
                break;
            case "Exit":
                createConnection.end();
                break;
        }

    }).catch((err) => {
        if(err)throw err;
    });
}

function viewAllDepartments(){
    let query =
    `SELECT * FROM department`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(rows);
        optionPrompt();
    });
}

function viewAllRoles(){
    let query = `
        SELECT
            role.id,
            role.title,
            role.salary,
            department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
        `;

    db.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(rows);
        optionPrompt();
    });
}

function viewAllEmployees(){
    let query = `
        SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            role.title AS title,
            department.name AS department,
            role.salary AS salary,
            CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager.first_name,' ', manager.last_name) ELSE NULL END AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
        `;
    
    db.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(rows);
        optionPrompt();
    });
}





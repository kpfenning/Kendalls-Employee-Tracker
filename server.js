const inquirer = require('inquirer');
const mysql = require('mysql2');





const db = mysql.createConnection({
    host: 'localhost',
    port: "3001",
    user: "root",
    password: "Wildcats123!",
    database: "employee_tracker_db"
},
    console.log(`Connected to the employee_tracker_db database.`),

    optionPrompt()
);


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
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateRole();
                break;
            case 'Exit':
                createConnection.end();
                break;
        }

    }).catch((err) => {
        if(err)throw err;
    });
}

function viewAllDepartments(){
    let query =
    ``
}

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

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        }
    ]).then((res) => {
        let query =
            `INSERT INTO department SET ?`;
            db.query(query, {name: res.name},(err, res) => {
                if(err) {
                    console.error(err);
                    return;
                }
                optionPrompt();
            });
    });
}

function addRole(){
    db.query(`SELECT * FROM department`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        const departmentChoice = results.map(row => ({
            name: row.name,
            value: row.id
        }));

    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department",
            message: "What department does the role belong to?",
            choices: departmentChoice
        }
    ]).then((res) => {
        let query = `INSERT INTO role SET ?`;

        db.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        }, (err, res) => {
            if(err) {
                console.error(err);
                return;
            }
            optionPrompt();
        });
    });
    });
};

function addEmployee(){
    db.query(`SELECT * FROM role`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        const roleChoices = results.map(row => ({
            name: row.title,
            value: row.id
        }));

    db.query(`SELECT * FROM employee`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        const managerChoices = results.map(row => ({
            name: `${row.first_name} ${row.last_name}`,
            value: row.id
        }));
        
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?" 
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managerChoices 
            }
        ]).then((res) => {
            let query = `INSERT INTO employee SET ?`;

            db.query(query, {
                first_name: res.first_name,
                last_name: res.last_name,
                role_id: res.role,
                manager_id: res.manager
            }, (err, res) => {
                if(err) {
                    console.error(err);
                    return;
                }
                optionPrompt();
            });
        });
        });
    });
}





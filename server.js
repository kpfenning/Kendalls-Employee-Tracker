//requires inquirer and mysql
const inquirer = require('inquirer');
const mysql = require('mysql2');

//creating connection to mysql and database
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "Wildcats123!",
    database: "employee_tracker_db"
});
    //Connect to database and starts optionPrompt function
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            return;
         }

    console.log(`Connected to the employee_tracker_db database.`);
    optionPrompt();
});

// Function that prompts the user to choose one of the following
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
    // based on which prompt the user clicks it starts the function that corresponds
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

// function to view all departments
function viewAllDepartments(){
    // selects all departments from database
    let query =
    `SELECT * FROM department`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(rows);
        //shows the prompt options after completed
        optionPrompt();
    });
}

// function to view all roles
function viewAllRoles(){
    // selects id, title, & salary from role table, then department name from department table & joins it on role table
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

// function to view all employees
function viewAllEmployees(){
    // selects id & name from employee table, then title from role table, then department name from department table, finally salary from role table and adds to employee table
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

// function to add a department
function addDepartment(){
    // prompts the user to input the name of the new department
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        }
        // inserts department name into department table
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
// function to add a role
function addRole(){
    // selects all from department table
    db.query(`SELECT * FROM department`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        // only pulls the department name and id in order to show in prompt
        const departmentChoice = results.map(row => ({
            name: row.name,
            value: row.id
        }));
        // prompts user to input the role name and salary, then asks what department the role belongs to
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

        // adds role to database
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

// function to add an employee
function addEmployee(){
    // selects all from role table
    db.query(`SELECT * FROM role`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        // only pulls role title and id in order to show in prompt
        const roleChoices = results.map(row => ({
            name: row.title,
            value: row.id
        }));
    // selects all from employee table
    db.query(`SELECT * FROM employee`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        // only pulls the managers and id in order to show in prompt
        const managerChoices = results.map(row => ({
            name: `${row.first_name} ${row.last_name}`,
            value: row.id
        }));

        // prompts user to input employee name, their role, and manager
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

            //inserts into database
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

// function to update role
function updateRole() {
    //selects all from employee table
    db.query(`SELECT * FROM employee`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        // pulls only the employee name and id in order to show in prompt
        const employeeChoices = results.map(row => ({
            name:`${row.first_name} ${row.last_name}`,
            value: row.id
        }));
    // selects all from role table
    db.query(`SELECT * FROM role`, (err, results) => {
        if(err) {
            console.error('Error querying database');
            return;
        }
        // pulls only role title and id in order to show in prompt
        const roleList = results.map(row => ({
            name: row.title,
            value: row.id
        }));

        // prompts the user to choose the employee they want to update and then what role they want to reassign to them.
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "What employee's role do you want to update?",
                choices: employeeChoices
            },
            {
                type: "list",
                name: "updatedRole",
                message: "Which role do you want to assign the selected employee?",
                choices: roleList
            },
        // updates database
        ]).then((answers) => {
            const employeeId = answers.employee;
            const newRoleId = answers.updateRole;

            const query = `UPDATE employee SET role_id = ? WHERE id = ?`;

            db.query(query, [newRoleId, employeeId], (err,res) => {
                if(err) {
                    console.error('Error updating employee');
                    return;
                }
                optionPrompt();
            });
        });
    });
});
}
       




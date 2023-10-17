const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: "3001",
    user: "root",
    password: "Wildcats123!",
    database: "employee_tracker_db"
},
    console.log(`Connected to the employee_tracker_db database.`)
);

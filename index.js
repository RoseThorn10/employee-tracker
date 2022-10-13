const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'myemployees_db'
    },
    console.log(`Connected to the myemployees_db database.`)
);

const { getSelection, mainQuestions, mainMessage } = require('./questions');

function viewDepartments() {
    // formatted table showing department names and department ids
    const query = 'SELECT * FROM department'
    db.query(query, function (err, res) {
        console.table(res);
        doMain();
    });
    console.log("Departments");
};

function viewRoles() {
    // job title, role id, the department that role belongs to, and the salary for that role
    const query = 'SELECT * FROM role'
    db.query(query, function (err, res) {
        console.table(res);
        doMain();
    });
    console.log("Roles");
};

function viewEmployees() {
    // formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    const query = 'SELECT * FROM employee'

    db.query(query, function (err, res) {
        console.table(res);
        doMain();
    });

    // db.promise().query(query).then( ([rows,fields]) => {
    //     console.table(rows);
    //     doMain();
    // }).catch(console.log);
};

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'What department would you like to add?',
            name: 'newDepartment'
        })
        .then(function (res) {
            const newDepartment = res.newDepartment;
            const query = `INSERT INTO DEPARTMENT (name) VALUES ('${newDepartment}')`;
            db.query(query, function (err, res) {
                if (err) throw err;
            });
            console.table(res);
            doMain();
        })
}

function addRole() {

    var query = 'select name, id from department';
    var deptNames = [];
    var deptIDs = [];

    db.promise().query(query).then(([rows, fields]) => {
        console.log('length: ' + rows.length);

        for (i = 0; i < rows.length; i++) {
            deptNames.push(rows[i].name);
            deptIDs.push(rows[i].id);
        }

        inquirer.prompt([
            {
                type: 'input',
                message: 'What role would you like to add?',
                name: 'newRole'
            },
            {
                type: 'input',
                message: 'What is the salary?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'What department is it in?',
                choices: deptNames,
                name: 'dept'
            }
        ])
            .then(function (res) {

                const newRole = res.newRole;
                const newSalary = res.salary;
                const deptID = deptIDs[deptNames.indexOf(res.dept)];
                console.log(`'${newRole}', ${newSalary}, ${deptID}`);
                query = `INSERT INTO ROLE (title, salary, department_id) VALUES ('${newRole}', ${newSalary}, ${deptID})`;
                db.query(query, function (err, res) {
                    if (err) throw err;
                });
                console.table(res);
                doMain();
            });

    }).catch(console.log);

}




// function addEmployee() {

const addEmployee = () => {
    let titleArray = [];
    let mgrArray = [];
    //        db.query('select title, id from role', (err, result) => {
    //            if (err) throw err;
    db.query('select title, id from role', (err, result) => {
        if (err) throw err;
        titleArray = result.map(e => JSON.stringify(e));
        console.log(titleArray);
        db.query('select id, first_name, last_name from employee', (err, result) => {
            if (err) throw err;
            mgrArray = result.map(e => JSON.stringify(e));
            console.log(mgrArray);


            inquirer.prompt([
                {
                    type: 'input',
                    message: `What is employee's first name?`,
                    name: 'first_name'
                },
                {
                    type: 'input',
                    message: `What is employee's last name?`,
                    name: 'last_name'
                },
                {
                    type: 'list',
                    message: `What is the employee's role?`,
                    name: 'role_title',
                    choices: titleArray
                },
                {
                    type: 'list',
                    message: `Who is the employee's manager?`,
                    name: 'manager_id',
                    choices: mgrArray
                }

            ]).then((ans) => {
                let role_id = parseInt(JSON.parse(ans.role_title).id);
                let manager_id = parseInt(JSON.parse(ans.manager_id).id);
                //console.log(JSON.parse(ans.role_title).id)
                let query = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES ('${ans.first_name}', '${ans.last_name}', ${role_id}, ${manager_id})`
            });

        });
    });

    console.log('Add Employee');
    doMain();
}


function updateEmployee() {
    // go get all employees
    db.query('SELECT * FROM employee', function (err, employees) {
        if (err) throw err;
        console.log(employees)
        // map employees to employeeChoice obj
        // dummy var
        const employeeObjects = employees.map(function (employee) {
            const name = employee.first_name + " " + employee.last_name;
            const value = employee.id;

            const employeeObject = {
                name: name,
                value: value
            }

            return employeeObject;
        })

            console.log(employeeOptions);
        // go get all of the roles
        db.query('SELECT * FROM role', function (err, roles) {
            if (err) throw err;
            console.log(roles);
            const roleOptions = roles.map(function (role) {
                const name = role.title; // get the title from the role obj
                const value = role.id; // ge the id from the role obj
                // create a new obj w/ that data
                const roleOption = {
                    name: name,
                    value: value
                }

                return roleOption;
            })

            console.log(roleOptions)

            // ask the user which emp to update
            // and which role to updat
            inquirer.prompt([{
                type: 'list',
                message: 'Which employee are you updating',
                choices: employeeObjects,
                name: 'newEmployeeId'
            },
            {
                type: 'list',
                message: 'What is the new role?',
                choices: roleOptions,
                name: 'newRoleId'
            }]).then(function (answer) {
                console.log(answer.newRoleId)
                console.log(answer.newEmployeeId)
                // use mysql2 to update the roleId in the employee
                db.query(`UPDATE employee SET role_id = ${answer.newRoleId.value} WHERE id = ${answer.newEmployeeId.value}')`)
            })

        })
    })


    //     // get employee
    //     // get roles
    //     let empNames = [];

    //    inquirer.prompt({
    //     type: 'list',
    //     message: 'Which employee would you like to update?',
    //     choices: empNames
    //    })



    console.log('Update');
    doMain();

}

function quit() {
    console.log('Bye!');
    return 'Bye!';
}

const funcs = [viewDepartments, viewRoles, viewEmployees, addDepartment,
    addRole, addEmployee, updateEmployee, quit];


function doMain() {
    console.log('Do Main');
    getSelection(mainQuestions, mainMessage).then((val) => {

        funcs[val]();

    });
}

doMain();







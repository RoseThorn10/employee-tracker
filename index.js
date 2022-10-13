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
    const query = 'SELECT name as Name FROM department'
    db.query(query, function (err, res) {
        console.table(res);
        doMain();
    });
};

function viewRoles() {
    // job title, role id, the department that role belongs to, and the salary for that role
    const query = 'SELECT r.title as Title, r.salary as Salary, d.name as Dept FROM role r, department d where r.department_id = d.id'
    db.query(query, function (err, res) {
        console.table(res);
        doMain();
    });
    console.log("Roles");
};

function viewEmployees() {
    // formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    const query = `SELECT concat(e1.first_name, ' ', e1.last_name) as Name, r.title as Role from employee e1, role r where e1.role_id = r.id`;

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

    db.promise().query('select id, title from role').then(result => {
        let roleTitleArray = result[0].map(e => e.title);
        let roleIdArray = result[0].map(e => e.id);

        db.promise().query('select first_name, last_name, id from employee').then(result2 => {
            let mgrNameArray = result2[0].map(m => `${m.first_name} ${m.last_name}`);
            let mgrIdArray = result2[0].map(m => m.id);

            mgrNameArray.push('None');
            mgrIdArray.push('');

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
                    choices: roleTitleArray
                },
                {
                    type: 'list',
                    message: `Who is the employee's manager?`,
                    name: 'manager_name',
                    choices: mgrNameArray
                }

            ]).then((ans) => {
                let first = ans.first_name;
                let last = ans.last_name;

                let role_id = parseInt(roleIdArray[roleTitleArray.indexOf(ans.role_title)]);

                let mgrIndex = mgrNameArray.indexOf(ans.manager_name);
                let manager_id = (mgrIndex == mgrNameArray.length - 1) ? null : parseInt(mgrIdArray[mgrIndex]);

                query = `insert into employee (first_name, last_name, role_id, manager_id) VALUES ('${first}', '${last}', ${role_id}, ${manager_id})`;

                db.promise().query(query).then((response) => {
                    console.log('inserted employee');
                }).catch(err => {
                    console.log('Unable to insert employee');
                });

                doMain();

            });
        });
    });

}


function updateEmployee() {
    //     // get employee
    //     // get roles
    //     let empNames = [];
    db.promise().query('select first_name, last_name, id from employee').then(result2 => {
        let empNameArray = result2[0].map(m => `${m.first_name} ${m.last_name}`);
        let empIdArray = result2[0].map(m => m.id);

        db.promise().query('select id, title from role').then(result => {
            let roleTitleArray = result[0].map(e => e.title);
            let roleIdArray = result[0].map(e => e.id);

            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    name: 'employee',
                    choices: empNameArray
                },
                {
                    type: 'list',
                    message: `Select the employee's new role.`,
                    choices: roleTitleArray,
                    name: 'role'
                }]).then((ans) => {
                    let role_id = parseInt(roleIdArray[roleTitleArray.indexOf(ans.role)]);
                    let employee_id = parseInt(empIdArray[empNameArray.indexOf(ans.employee)]);

                    query = `update employee SET role_id = ${role_id} WHERE id = ${employee_id}`;

                    db.promise().query(query).then((response) => {
                        console.log('inserted employee');
                    }).catch(err => {
                        console.log('Unable to insert employee');
                    });
    
                    doMain();
            });

        });

    });

}


function quit() {
                console.log('Bye!');
                process.exit();
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







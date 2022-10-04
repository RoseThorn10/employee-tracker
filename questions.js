const inquirer = require('inquirer');
const { listenerCount } = require('mysql2/typings/mysql/lib/Connection');

function start() {
    let startQues = [{
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        name: 'action'
    }]
}

inquirer.prompt(startQues)
    .then(response => {
        switch(response.action) {
            case 'View all departments':
                break;

            case 'View all roles':
                break;

            case 'View all employees':
                break;
            
            case 'Add a department':
                break;

            case 'Add a role':
                break;

            case 'Add an employee':
                break;

            case 'Update an employee':
                break;

        }
    })
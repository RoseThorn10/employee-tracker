const mysql2 = require('mysql2');
const consoleTable = require('console.table');

const { getSelection, mainQuestions, mainMessage } = require('./questions');

function viewDepartments() {

    console.log("Departments");
};

function viewRoles() {
    console.log("Roles");
};

function viewEmployees() {
    console.log("Employees");
};

const funcs = [viewDepartments, viewRoles, viewEmployees];


getSelection(mainQuestions, mainMessage).then(val => {
    
    funcs[val]();

});







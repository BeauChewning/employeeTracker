const { prompt } = require('inquirer');
const db = require('./db/index');
require('console.table');


loadMainPrompts();

function loadMainPrompts() {
    prompt([
        {
            type: "list",
            name: 'choice',
            message: 'what would you like to do?',
            choices: [
                {
                    name: 'view all employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'view all departments',
                    value: ' VIEW_ALL_DEPARTMENTS'
                },
                {
                    name: 'view all roles',
                    value: 'VIEW_ALL_ROLES'
                },
                {
                    name: 'add a department',
                    value: 'ADD_A_DEPARTMENT'
                },
                {
                    name: 'add a role',
                    value: 'ADD_A_ROLE'
                },
                {
                    name: 'add employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'update employee role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'quit',
                    value: 'QUIT'
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        console.log(choice)

        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_ALL_DEPARTMENTS":
                viewAllDepartments();
                break;
            case "VIEW_ALL_ROLES":
                viewAllRoles();
                break;
            case "ADD_A_DEPARTMENT":
                addDepartment();
                break;
            case "ADD_A_ROLE":
                addRole();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "QUIT":
                quit();


        }
    })

}

function viewEmployees() {
    db.findAllEmployees()
        .then(([row]) => {
            let employees = row;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts());
 }

function viewAllDepartments() {
    db.findAllDepartments()
        .then(([row]) => {
            let departments = row;
            console.log('\n');
            console.table(departments);
        })
        .then(() => loadMainPrompts());
}

function viewAllRoles() {
    db.findAllRoles()
        .then(([row]) => {
            let roles = row;
            console.log('\n');
            console.table(roles);
        })
        .then(() => loadMainPrompts());
}

function addDepartment(){
    db.findAllDepartments()
    .then(([row]) => {
        let departments = row;
        const departmentChoices = departments.map(({id, name}) => ({
            name: `${name}`,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "departmentId",
                maessage: "what department do you want to add?",
                choices: departmentChoices
            }
        ])
        .then(res => db.addDepartments(res.departmentId))
        .then(() => console.log("added department"))
        .then(() => loadMainPrompts())
    })
}



function addRole(){
    db.findAllRoles()
    .then(([row]) => {
        let roles = row;
        const roleChoices = roles.map(({id, title}) => ({
            name: `${title}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "roleId",
                message: "what role do you want to add",
                choices: roleChoices
            }
        ])
        .then(res => db.addRole(res.roleId))
        .then(() => console.log("updated role"))
        .then(() => loadMainPrompts())
    })
}



function addEmployee(){
db.findAllEmployees()
    .then(([row]) => {
        let employees = row;
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "what employee do you want to add",
                choices: employeeChoices
            }
        ])
        .then(res => db.addRole(res.roleId))
        .then(() => console.log("updated role"))
        .then(() => loadMainPrompts())
    })
}



function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([row]) => {
            let employees = row;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "which role do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.findAllRoles()
                        .then(([row]) => {
                            let roles = row;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "whose role do you want to assign the employee?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("updated role"))
                                .then(() => loadMainPrompts())
                        });
                });
        })
}

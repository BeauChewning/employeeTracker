const { prompt } = require('inquirer');
const db = require('./db/index');
require('console.table');
const connection = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2')

const bd = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'rootroot',
      database: 'employee_db'
    },
    console.log(`Connected to employee database.`)
  );



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
                    value: 'VIEW_ALL_DEPARTMENTS'
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

function addDepartment() {
    db.findAllDepartments()
        .then(([row]) => {
            let departments = row;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: `${name}`,
                value: id
            }));

            prompt([
                {
                    type: "input",
                    name: "departmentId",
                    maessage: "what department do you want to add?",

                }
            ])
                .then(res => db.addDepartments(res.departmentId))
                .then(() => console.log("added department"))
                .then(() => loadMainPrompts())
        })
}



function addRole() {
   inquirer
   .prompt([
       {
           name: 'name',
           type: 'input',
           message: "what do you want to name the new role?"
       },
       {
           name: 'salary',
           type: 'input',
           messages: "what is the salary for this role?"
       }
   ]).then((answer)=>{
       const arr = [answer.name, answer.salary];
       bd.query('SELECT * FROM department',(err,res)=>{
           if(err) throw err;
           const departments = res.map(({ id, name }) => ({
               name: name, 
               value: id
           }));
           inquirer
           .prompt([
               {
                  name: "department",
                  type: "list",
                  message: "what department does the role belong to",
                  choices: departments
               }
           ]).then((answer)=>{
               arr.push(answer.department)
               bd.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${arr[0]}', '${arr[1]}', '${arr[2]}')`, function (err, results) {
                if(err){
                    throw err;
                }
                loadMainPrompts()
            });
           
           })
       })
   })
}



function addEmployee() {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "what is the employee's first name?"
            },
            {
                name: 'last_name',
                type: 'input',
                message: "what is the employee's first name?"
            },
        ]).then(answer => {
            const name = [answer.first_name, answer.last_name]
            bd.query('SELECT roles.id, roles.title FROM roles', (err, res) => {
                if (err) throw err;
                const roles = res.map(({ id, title }) => ({ name: title, value: id }));
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's role?",
                            choices: roles
                        }
                    ]).then(roleChoice => {
                        const role = roleChoice.role;
                        name.push(role);
                        bd.query('SELECT * FROM employee', (err, res) => {
                            if (err) throw err;
                            const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: "Who is the employee's manager?",
                                        choices: managers
                                    }
                                ]).then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    name.push(manager);
                                    bd.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${name[0]}', '${name[1]}', '${name[2]}', '${name[3]}')`, function (err, results) {
                                        if(err){
                                            throw err;
                                        }
                                    });
                                            console.log("An Employee has been added!")
                                            loadMainPrompts();
                                        })
                                })
                        })
                    })
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
                    message: "whos role do you want to update?",
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
                                    message: "what role do you want to assign the employee?",
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

function quit() {
    connection.end();
}

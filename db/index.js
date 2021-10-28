const connection = require('./connection')

// "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name, manager,last_name;"
class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findAllEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );

    }

    findAllDepartments() {
       
        return this.connection.promise().query(
            "SELECT * FROM department;"
        );
    }

    findAllRoles() {
        return this.connection.promise().query(
            "SELECT * FROM roles;"
        );

    }
    addDepartments(addDept) {
        return this.connection.promise().query(
            `INSERT INTO department (name) VALUES ('${addDept}')`
        );
    }
    addRole(addRol) {
        return this.connection.promise().query(
            `INSERT INTO roles (title) VALUES ('${addRol}')`
        );

    }
    addEmployee(addEmp) {
        return this.connection.promise().query(
            `INSERT INTO employee (name) VALUES ('${addEmp}')`
        );


    }
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id =?",
            [roleId, employeeId]
        );

    }


}

module.exports = new DB(connection);
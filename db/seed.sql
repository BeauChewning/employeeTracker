use employee_db;

INSERT INTO department
(name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles
    (title, salary, department_id)
VALUES
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Accountant", 125000, 3),
("Lawyer", 200000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Beau", "Chewning", 4),
    ("Brian", "Gearty", 3),
    ("Joe", "Shmoe", 2),
    ("Karen", "Gates", 1);
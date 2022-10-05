INSERT INTO department (name)
VALUES ("UI/UX"),
       ("Sales"), 
       ("QA");

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 130000, 1),
       ('Lead', 130000, 2),
       ('Head', 130000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Clark',' Kent', 1),
       ('Diana', 'Prince', 2),
       ("Tim", "Drake", 3); 

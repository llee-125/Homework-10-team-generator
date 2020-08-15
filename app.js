const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "main.html");

const render = require("./lib/htmlRenderer");

const employeeArray = [];
let id = 0;

function createEmployee() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "type",
        message: "What type of employee would you like to create?",
        choices: ["Manager", "Engineer", "Intern"],
      },
      {
        type: "input",
        name: "Fname",
        message: "Please enter employee's First Name:",
      },
      {
        type: "input",
        name: "Lname",
        message: "Please enter employee's Last Name:",
      },
      {
        type: "input",
        name: "email",
        message: "Please enter employee's Email:",
      },
      {
        type: "input",
        name: "office",
        message: "What is the manager's Office Number?",
        when: (answers) => answers.type === "Manager",
      },
      {
        type: "input",
        name: "github",
        message: "Please enter engineer's github User Name.",
        when: (answers) => answers.type === "Engineer",
      },
      {
        type: "input",
        name: "school",
        message: "Enter intern's school name:",
        when: (answers) => answers.type === "Intern",
      },
    ])
    .then((res) => {
      if (res.type === "Manager") {
        employeeArray.push(
          new Manager(res.Fname, res.Lname, id, res.email, res.office)
        );
        id++;
      } else if (res.type === "Engineer") {
        employeeArray.push(
          new Engineer(res.name, res.Lname, id, res.email, res.github)
        );
        id++;
      } else if (res.type === "Intern") {
        employeeArray.push(
          new Intern(res.name, res.Lname, id, res.email, res.school)
        );
        id++;
      }

      inquirer
        .prompt({
          type: "confirm",
          name: "addAnother",
          message: "Would you like to add another employee?",
        })
        .then((res) => {
          if (res.addAnother) {
            createEmployee();
          } else {
            const data = render(employeeArray);
            fs.writeFile("./output/team.html", data, (err) => {
              if (err) {
                throw err;
              } else {
                console.log("Saved!");
              }
            });
          }
        });
    });
}

createEmployee();

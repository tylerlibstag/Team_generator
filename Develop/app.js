const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employeeInfo = []

const questions = [

    {
        message: "Which type of employee are you?",
        name: "role",
        type: "list",
        choices: ['Manager', "Intern", "Engineer"]
    },
    {
        message: "What is the employee name?",
        name: "name",
        type: "input"
    },
    {
        message: "what is the employee id?",
        name: "id",
        type: "input"
    },
    {
        message: "what is the employee email",
        name: "email",
        type: "input"
    }


];

function moreQuestions(role, questionText, questionName, previousData) {
    const question = [
        {
            message: questionText,
            name: questionName,
            type: "input",

        },
    ]
    inquirer.prompt(question).then((answer) => {

        const { name, id, email } = previousData;

        let employeeData;

        switch (role) {
            case 'Manager':
                employeeData = new Manager(name, id, email, answer[questionName]);
                break;
            case 'Engineer':
                employeeData = new Engineer(name, id, email, answer[questionName]);
                break;
            case 'Intern':
                employeeData = new Intern(name, id, email, answer[questionName]);
                break;
        }
        employeeInfo.push(employeeData);
        console.log("this is employee info", employeeInfo)
        moreTeamates()

    })

}
function moreTeamates() {
    const extraQuestion = [
        {
            message: "would you like to add another team member",
            name: "new_member",
            type: "confirm",

        },
    ]
    inquirer.prompt(extraQuestion).then((answer) => {
        if (answer.new_member === true) {
            init();
        }
        else {
            const html = render(employeeInfo);
            writeHTMLtoFile(html);
        }
    })
}
function init() {

    inquirer.prompt(questions)
        .then((inquirerData) => {
            const { role } = inquirerData;
            switch (role) {

                case 'Engineer':
                    moreQuestions(role, "github", "Enter the Engineer's Github profile username", inquirerData);
                    break;
                case 'Manager':
                    moreQuestions(role, "officeNumber", "Enter the Manager's office number?", inquirerData);
                    break;
                case 'Intern':
                    moreQuestions(role, "school", "Enter where the intern goes to school", inquirerData);
                    break;
            }
        })
        .catch((err) => {
            console.log(err);
        })


}

// const writeHTMLtoFile = (html) => {
const writeHTMLtoFile = () => {

    fs.writeFile(outputPath, render(employeeInfo), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("Data successfully written to team.html file.");

    });

};
init();





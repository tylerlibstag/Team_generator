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
        
        switch(role) {
            case 'Manager':
                employeeData = new Manager(name, id, email, answer);
            break;
            case 'Engineer':
                employeeData = new Engineer(name, id, email, answer);
            break;
            case 'Intern':
                employeeData = new Intern(name, id, email, answer);
            break;
        }
        employeeInfo.push(employeeData);
        console.log("this is employee info",employeeInfo)
        writeHTMLtoFile() 

    })
    
}

function init() {

    inquirer.prompt(questions)
        .then((inquirerData) => {
            const { role } = inquirerData;
            switch (role) {
                case 'Manager':
                    moreQuestions(role, "officeNumber", "Enter the Manager's office number?", inquirerData);
                    break;
                case 'Engineer':
                    moreQuestions(role, "github", "Enter the Engineer's Github profile username", inquirerData);
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



// function promptUser(answers){
//     const html = generateREADME(answers);
//     fs.writeFileSync("html", html,"utf-8");
// }
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

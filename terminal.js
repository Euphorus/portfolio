//todo: add some themes and see if you can make the help function work, cause it isn't working, what the fuck man??

//VARIABLE
let pastCommands = [];
let timesPressedUp = 0;

//Event listeners
document.addEventListener("keydown", (e) => {
    if(e.key == "Enter")
    {
        timesPressedUp = 0;
        addComment();
        //Makes the input field always appear on screen.Important.
        document.querySelector(".comment-div").scrollIntoView();
    } else if (e.key == "ArrowUp")
    {
        if(pastCommands.length > timesPressedUp) (timesPressedUp++);
        let lastCommand = pastCommands[pastCommands.length - timesPressedUp];
        document.querySelector(".user-command").value = lastCommand;
        if(document.querySelector(".user-command").value == "undefined"){
           document.querySelector(".user-command").value = "";
        }
    } else if (e.key == "ArrowDown")
    {
        if(timesPressedUp == 0){
            document.querySelector(".user-command").value = "";
            if(document.querySelector(".user-command").value == "undefined"){
                document.querySelector(".user-command").value = "";
            }
        } else if (0 < timesPressedUp) {
            timesPressedUp--;
            let lastCommand = pastCommands[pastCommands.length - timesPressedUp];
            document.querySelector(".user-command").value = lastCommand;
            if(document.querySelector(".user-command").value == "undefined"){
                document.querySelector(".user-command").value = "";
            }
        }
    } else if (e.key == "Tab")
    {
        e.preventDefault();
        let ongoingInput = document.querySelector(".user-command").value;
        let dict = typeof commandDict[currentlyIn] == "object" ? Object.keys(commandDict[currentlyIn]) : commandDict[currentlyIn];
        ongoingInput === "" ? document.querySelector(".user-command").value = "" : dict.map((cmd) => {
            if(cmd.startsWith(ongoingInput)) document.querySelector(".user-command").value = cmd;
        })
    }
})

export let commentsDiv = document.querySelector(".comments");

let themes = ["Some cool themes for you guys: ", "default", "light"];
let rootCmds = {
    "about" : `<div>Hey, I'm Yuvraj Kumpavat! I'm a final year, soon-to-graduate, student pursuing BSc in Games Design and Proramming. Simplicity is the key!</div>`,
    "education" : ["Games Design and Programming - University of Staffordshire"],
    "skills" : `<div><p>Languages: English(native), Hindi(native)</p>
                <p>Programming Languages: C, C++, Python</p>
                <p>Frameworks & Libraries: SDL, SFML, Unity, Unreal</p>
                <p>Developer Tools: Git/Github</p>
                <p>OS: Windows, Linux</p></div>`,
    "interests" : `<div>I like coding, skateboarding, gaming & reading manga (currently reading Akira Vol.4)</div>`,
    "information" : `<div>I just wanted a make a simple terminal portfolio, inspired by lot of dev's website which looks simple or hi-tech Terminal.
                    <br/><br/>
                    So to combine my love for Linux and Simplicity, I used vanilla JavaScript, HTML and CSS to create this website.<br/>
                    I'm a simple man, I love simple stuff.<br/></div>`,
    "certificates" : ["Learn C - Codecademy", "Learn C++ - Codecademy", "Learn Linear Algebra - Codecademy"],
    "experience" : ["Lead Senior Programmer for Collaborative Games Development 2025", "Gameplay Programmer for Global Games Jam 2025"],
    "get linkedin" : "https://www.linkedin.com/in/yuvraj-singh-kumpavat/",
    "get itch.io" : "https://yuvraj24.itch.io",
    "get github" : "https://github.com/Euphorus",
    "get resume" : "assets/Yuvraj_Kumpavat_Resume.pdf",
    "cd themes" : "Here are some themes you can change into: ",
};

let mainCMD = ["clear", "ls", "cd ..", "help"];
let allCMD = [...mainCMD, ...Object.keys(rootCmds), ...themes];
let currentlyIn = "root";
let commandDict = {
    "root" : rootCmds,
    "themes" : themes,
};


let userCommandDiv = document.querySelector(".user-command");
userCommandDiv.addEventListener("focus", (e) => {
    e.preventDefault();
})

function addComment() {
    let newComment = document.createElement("div");
    newComment.classList.add(".user-comment");

    //Get user comment + add it to the chat screen
    let userCommandDiv = document.querySelector(".user-command");
    let userCommand = document.querySelector(".user-command").value.trim();
    let directory = document.querySelector(".directory");
    if(userCommand === ""){
        commentsDiv.innerHTML += `<div>Please enter a command.</div>`;
        return;
    }
    pastCommands.push(userCommand);
    newComment.innerText = `> ${userCommand}`;
    commentsDiv.appendChild(newComment);

    if(allCMD.includes(userCommand)){
        if(userCommand == "clear"){
            commentsDiv.innerHTML = "";
        } else if (userCommand == "help") {
            let currentDirArray = currentlyIn === "root" ? [...Object.keys(rootCmds), ...mainCMD] : [...themes, ...mainCMD];
            commentsDiv.innerHTML += `<ul> ${currentDirArray.map((command) => {
                return `<li class="ls-item"> ${command}</li>`;
            }).join("")} </ul>`;
        } else if (userCommand == "ls") {
            if(currentlyIn === "themes") {
                commentsDiv.innerHTML += `<div class="ls-cont"> ${[...themes, "root"].map((theme) => {
                    return `<div class="ls-item">${theme}</div>`;
                }).join("")} </div>`;
            } else {
                commentsDiv.innerHTML += `<div class="ls-cont"> ${Object.keys(rootCmds).map((command) => {
                    return `<div class="ls-item">${command}</div>`;
                }).join("")} </div>`;
            }
        } else if (userCommand == "cd ..") {
            if(currentlyIn == "root") {
                commentsDiv.innerHTML += `<div>Already in the root directory.</div>`;
                userCommandDiv.value = "";
                return;
            }

            currentlyIn = "root";
            let directories = directory.innerText.split("/");
            directories.pop();
            directory.innerHTML = "";
            directory.innerHTML = directories.map((x) => {
                if(x !== "") return ` /${x}`;
            }).join('');
        } else if(currentlyIn === "root" && Object.keys(rootCmds).includes(userCommand) || themes.includes(userCommand)) {
            if(userCommand.startsWith("get ")) {
                window.open(rootCmds[userCommand]);
                return;
            } else if (userCommand === "experience" || userCommand === "certificates" || userCommand === "education") {
                commentsDiv.innerHTML += `<ul>${rootCmds[userCommand].map((x) => {
                    return `<li>${x}</li>`;
                }).join("")}</ul>`;
                userCommandDiv.value = "";
                return;
            } if (userCommand === "cd themes") {
                currentlyIn = "themes";
                directory.innerHTML += "/themes";
                commentsDiv.innerHTML += `<ul.${themes.map((theme) => {
                    return `<li>${theme}</li>`;
                }).join("")}</ul>`;
            } else if (currentlyIn === "themes" && themes.includes(userCommand)) {
                changeTheme(userCommand);
            } else {
                commentsDiv.innerHTML += rootCmds[userCommand];
            }
        } else if (currentlyIn === "themes" && Object.keys(rootCmds).includes(userCommand)) {
            handleInvalidCommand(userCommand);
        }
    }
    else {
        handleInvalidCommand(userCommand);
    }
    userCommandDiv.value = "";
}

function changeTheme(theme){
    let domBody = document.querySelector("body");
    let pastTheme = domBody.className;
    theme == "light" ? commentsDiv.innerHTML += `<div>"${theme}" theme selected. Protect thy eyes!</div>` : commentsDiv.innerHTML += `<div>"${theme}" theme selected.</div>`;
    domBody.classList.remove(pastTheme);
    domBody.classList.add(theme);
}

function handleInvalidCommand(cmmd){
    commentsDiv.innerHTML += `<div>the term <span class="green">'${cmmd}"</span> is not recognized as the name of command. Please type <span class="red">help</span> to see a list of possible commands.</div>`;
}
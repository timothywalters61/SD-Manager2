const auth = firebase.auth();
const db = firebase.firestore();
const projectID = localStorage.getItem("docID");
const ownerID = localStorage.getItem("ownerID");
const currentSprintID = localStorage.getItem("currentSprintID");
const userStoryID = localStorage.getItem("userStoryID");

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("user logged in: ", user);
        //console.log(data);

        //back button

        const backButton = document.querySelector("#backButton");
        backButton.addEventListener('click', () => {
            window.location.href = "Sprint.html";
        });

        //only team members can open this page

        db.collection("projects").doc(projectID)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if (doc.data().team.includes(user.email)) {
                        console.log("in the team");
                    } else {
                        window.location.href = "userHome.html";
                    }
                } else {
                    console.log("project does not exist");
                }
            });

        //set up sidenav

        var data = [user.displayName, user.email];
        setUpSideNav(data);

        //populate team dropdown

        db.collection("projects").doc(projectID)
            .onSnapshot(function (doc) {
                if (doc.exists) {
                    setUpTeam(doc.data().Team);

                    //display user story heading

                    const userStoryTitle = document.querySelector('#Title');

                    db.collection("projects").doc(projectID).collection("backlog").doc(userStoryID).get().then((doc) => {
                        let html = `<p>${doc.data().name}: ${doc.data().description}</p>`;
                        userStoryTitle.innerHTML = html;
                    });

                    //display tasks

                    const taskList = document.querySelector("#taskList");
                    let taskListHTML = '';

                    db.collection("projects").doc(projectID).collection("sprints").doc(currentSprintID).collection("backlog").doc(userStoryID).collection("tasks").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const li = `
                            <li>           
                                <h3>${doc.data().name}</h3>
                            </li>
                            `;
                            taskListHTML = taskListHTML + li;
                        });
                        if (taskListHTML.length === 0) {
                            console.log("no tasks");
                        } else {
                            taskList.innerHTML = taskListHTML;
                        }
                    });

                    //git and links

                    const gitLink = document.querySelector('#gitLink');

                    let git = `<a href="${doc.data().repository}">Git</a>`;

                    gitLink.innerHTML = git;

                } else {
                    console.log("project does not exist");
                }
            });
    } else {
        console.log("user logged out");
        window.location.href = "index.html";
    }
});

//logout

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();

    auth.signOut().then(() => {
        //console.log("user has signed out");
    })
        .catch(function (error) {
            console.log("user failed to sign out because of error: ", error);
            alert(error.message);
        });
});
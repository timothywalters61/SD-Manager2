var firebaseConfig = {
    apiKey: "AIzaSyB1akwPd-xOMCgU9_Bc6OqdTObTp10Sb5k",
    authDomain: "scrum-manager-91e13.firebaseapp.com",
    databaseURL: "https://scrum-manager-91e13.firebaseio.com",
    projectId: "scrum-manager-91e13",
    storageBucket: "scrum-manager-91e13.appspot.com",
    messagingSenderId: "332929508306",
    appId: "1:332929508306:web:5f1773dc956813db641e0b"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const ownerID = localStorage.getItem("ownerID");
const projectName = localStorage.getItem("docName");
projectID = localStorage.getItem("docID");

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("user logged in: ", user);

        //only owner can view this page

        if (user.uid != ownerID) {
            window.location.href = "userHome.html";
        }

        //heading

        const projectTitle = document.querySelector("#PageHeading");
        let heading = `<p>Project: ${projectName}</p>`;
        projectTitle.innerHTML = heading;

        //set up team

        db.collection("projects").doc(projectID)
        .onSnapshot(function (doc) {
            if (doc.exists) {
                setUpTeam(doc.data().Team);

                //git and links

                const gitLink = document.querySelector('#gitLink');

                console.log(doc.data().repository);
                let git = `<a href="${doc.data().repository}">Git</a>`;

                gitLink.innerHTML = git;

            } else {
                console.log("project does not exist");
            }
        });

        db.collection("users").doc(user.uid).get().then(function(doc) {
            let notifs = doc.data().notifications;
            console.log(notifs.length);

            let notifBadge = document.getElementById('notifications');
            notifBadge.innerText = notifs.length +" Notifications";
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        //set up invite badge

        const inviteBadge = document.querySelector("#inviteBadge");
        let numinvites = localStorage.getItem("invitesNum");
        let html = `<span class="badge">${numinvites}</span> Invites`;
        inviteBadge.innerHTML = html;

        let invitesArray = [];
        let invitesId = [];

        db.collection("Invites").where("inviteToID", "==", user.uid)
            .onSnapshot(function (snapshot) {
                if(numinvites != snapshot.docs.length){

                    for(let i = 0; i < snapshot.docs.length; i++){
                        invitesArray.push(snapshot.docs[i].data());
                        invitesId.push(snapshot.docs[i].id);
                    }
                    
                    stringInv = JSON.stringify(invitesArray);
                    saveInvites(stringInv);
    
                    stringInvID = JSON.stringify(invitesId);
                    saveInvitesID(stringInvID);
    
                }
                if (snapshot.docs != 0) {
                    let html = `<span class="badge">${snapshot.docs.length}</span> Invites`;
                    inviteBadge.innerHTML = html;
                } else {
                    console.log("invites do not exist");
                    let html2 = '<span class="badge">0</span> Invites';
                    inviteBadge.innerHTML = html2;
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


function saveInvites (data) {
    console.log("in");
    localStorage.setItem("invitesTesting", data);
}

function saveInvitesID (data) {
    console.log("in");
    localStorage.setItem("invitesID", data);
}
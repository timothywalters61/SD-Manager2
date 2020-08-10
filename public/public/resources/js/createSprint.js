// start sprint for project

const startSprint = document.querySelector("#sprint-form");
startSprint.addEventListener('submit', (e) => {
    e.preventDefault();
    const sprintName = startSprint['sprint-name'].value;
    const startDate = startSprint['startDate'].value;
    const endDate = startSprint['endDate'].value;
    var today = Date.now;

    if (startDate < today) {
        toast("startdate already past");
    }



    db.collection("projects").doc(projectID).collection("sprints").add({
            name: sprintName,
            start: startDate,
            end: endDate
        })
        .then((doc) => {
            localStorage.setItem("currentSprintID", doc.id);
            db.collection("projects").doc(projectID).update({
                    "Sprints": "started"
                })
                .then(() => {
                    startSprint.reset();
                    window.location.href = "Sprint.html";
                });
        })
        .catch((error) => {
            alert("an error occured", error);
        });

});
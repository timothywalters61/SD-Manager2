const addStory = document.querySelector("#userStory-form");

addStory.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = addStory['storyTitle'].value;
    const description = addStory['storyDescription'].value;
    const acceptance = addStory['Acceptance'].value;
    const points = addStory['points'].value;

    db.collection("projects").doc(projectID).collection("backlog").add({
        name: title,
        description: description,
        acceptance: acceptance,
        SprintID: currentSprintID,
        points: points
    }).then((doc) => {
        db.collection("projects").doc(projectID).collection("sprints").doc(currentSprintID).collection("backlog").doc(doc.id)
            .set({
                name: title,
                description: description,
                acceptance: acceptance,
                SprintID: currentSprintID,
                points: points
            }).then(() => {
                addStory.reset();
                alert("user story added");
                window.location.reload(true);
            });
    });
});
const ID = document.querySelector('#projectTitle');

getDoc('projects', projectID)
	.then(function (doc) {
		if (doc.exists) {
			//console.log(doc);
			ID.innerHTML = doc.data().name;
		} else {
			console.log('document does not exist');
			window.location.href = 'userHome.html';
		}
	})
	.catch(function (error) {
		alert('project could not be retrieved because of error: ', error);
	});

getCollectionReference('projects/' + projectID + '/sprints').onSnapshot((snapshot) => {
	snapshot.forEach(doc => {
		createSprintButton(doc);
	});
}).catch((error) => {
	alert('Sprints could not be retrieved because of error: ', error)
});
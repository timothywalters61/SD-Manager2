/**
 * @description This file contains all the functions that use the 'projects' document in
 *              the database.
 */

const admin = require('firebase-admin');
const docs = require('./docs');
const errors = require('./errors');
const functions = require('firebase-functions');

/* =========================================== Exports ============================================= */
/**
 * Creates a project document in the projects collection and the user's subcollection.
 */
exports.createProject = functions.https.onCall((data, context) => {
	var projectName = data.pn;
	var description = data.de;
	var uid = context.auth.uid;

	var projectData = {
		name: projectName,
		description: description
	};
	var projectid = '';
	console.log('Creating project document');
	return createProjectDocument(projectData)
		.then(value => {
			projectid = value.id;
			console.log('Adding project to user document');
			return addProjectToUserDocument(
				projectid,
				projectName,
				description,
				'product_owner',
				uid
			);
		})
		.then(value => {
			return admin.auth().getUser(uid);
		})
		.then(user => {
			console.log('Adding first member member to project');
			return addMemberToProject(
				user.displayName,
				user.email,
				projectid,
				'product_owner',
				uid
			);
		})
		.catch(errors.onError);
});

exports.getUserProjectsList = functions.https.onCall((data, context) => {
	var uid = context.auth.uid;

	return getUserProjects(uid)
		.then(querySnapshot => {
			result = [];
			querySnapshot.forEach(doc => {
				var data = doc.data();
				entry = {
					id: doc.id,
					name: data.name
				};
				result.push(entry);
			});
			return result;
		})
		.catch(errors.onError);
});
/* ========================================= Local Functions ======================================= */
/**
 * Creates a member document in the members subcollection of a project
 * @param {string} displayName
 * @param {string} email
 * @param {string} projectid
 * @param {string} role
 * @param {string} uid
 */
function addMemberToProject(displayName, email, projectid, role, uid) {
	var data = createProjectMemberObject(displayName, email, role);

	return docs.createDoc('projects/' + projectid + '/members/' + uid, data);
}

/**
 * Creates a project document in a user's projects subcollection
 * @param {string} projectid
 * @param {string} projectName
 * @param {string} projectDescription
 * @param {string} projectRole
 * @param {string} uid
 */
function addProjectToUserDocument(
	projectid,
	projectName,
	projectDescription,
	projectRole,
	uid
) {
	var data = {
		name: projectName,
		description: projectDescription,
		role: projectRole
	};

	return docs
		.createDoc('users/' + uid + '/projects/' + projectid, data)
		.then(value => {
			return {
				isEqual: value.isEqual,
				writeTime: value.writeTime,
				id: projectid
			};
		});
}

/**
 * Creates a document in the Projects collection with data as its content
 * @param {object} data
 */
function createProjectDocument(data) {
	return docs.addDoc('projects', data);
}

/**
 * Creates the data object that will be used as a project member object
 * @param {string} displayName
 * @param {string} email
 * @param {string} role
 */
function createProjectMemberObject(displayName, email, role) {
	return {
		display_name: displayName,
		email: email,
		role: role
	};
}

/**
 * Returns a collection snapshot of a user's projects
 * @param {string} uid
 */
function getUserProjects(uid) {
	return docs.getCollection('users/' + uid + '/projects');
}
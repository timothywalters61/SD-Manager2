/**
 * @description This file contains all functions that will be used to simplify
 *              the code.
 */

/* =============================== Getters ================================ */
/**
 * Returns the value of the element specified by id
 * @param {String} id
 */
function getElementValue(id) {
	return document.getElementById(id).value;
}

/**
 * Returns the selected option's value of a select element specified by id
 * @param {string} id
 */
function getSelectElementValue(id) {
	var el = document.getElementById(id);
	return el.options[el.selectedIndex].value;
}

/**
 * Returns the current URL pathname
 */
function getPathname() {
	return location.pathname;
}

/* =============================== Setters ================================ */
/**
 * Sets the background colour of the DOM element specified to the colour specified
 * @param {String} id
 * @param {String} colour
 */
function setBackgroundColour(id, colour) {
	document.getElementById(id).style.background = colour;
}

/**
 * Sets the value of the element specified by id to val
 * @param {String} id
 * @param {String} val
 */
function setElementValue(id, val) {
	document.getElementById(id).value = val;
}

/**
 * Sets the current URL pathname to 'pathname'
 * @param {String} pathname
 */
function setPathname(pathname) {
	location.pathname = pathname;
}

/* ================================ Validators ============================= */

/**
 * Returns true if the value selected in the element is in the list of options
 * @param {*} id
 */
function validateAccType(id) {
	var val = getSelectElementValue(id);
	return val == 'student' || val == 'tutor' || val == 'lecturer';
}

/**
 * Returns true if email address in the input element is valid
 * @param {string} id
 */
function validateEmail(id) {
	var val = getElementValue(id);
	var atindex = val.indexOf('@');
	var dotindex = val.lastIndexOf('.');

	return (
		!val == '' && validateString(val) && atindex > 0 && dotindex > atindex
	);
}

/**
 * Returns true if both elements are valid and have the same value
 * @param {string} pass
 * @param {string} repass
 */
function validatePass(pass, repass) {
	pval = getElementValue(pass);
	rval = getElementValue(repass);

	return validateString(rval) && validateString(pval) && pval == rval;
}

/**
 * Returns true if 'str' is valid
 * @param {String} str
 */
function validateString(str) {
	return str.length > 0;
}

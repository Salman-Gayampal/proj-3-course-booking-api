const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const Course = require('../models/Course');


//Check if the email already exists
module.exports.checkEmailExists = (reqBody) => {

	// The result is sent back to the frontend via the "then" method found in the route file
	return User.find({ email: reqBody.email }).then(result => {

		// The "find" method returns a record if a match is found
		if (result.length > 0) {
			return true

			// No duplicate email found
			// The user is not yet registered in the database
		} else {
			return false
		}

	})

}


//User Registration
module.exports.registerUser = (reqBody) => {

	// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
	// Uses the information from the request body to provide all the necessary information
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		// 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
		password: bcrypt.hashSync(reqBody.password, 10)
		//hashSync(<dataToBeHash>, <saltRound>)
	})

	// Saves the created object to our database
	return newUser.save().then((user, error) => {

		// User registration failed
		if (error) {
			return false

			// User registration successful
		} else {
			return true
		}

	})
};

//User login
module.exports.loginUser = (reqBody) => {

	// The "findOne" method returns the first record in the collection that matches the search criteria
	// We use the "findOne" method instead of the "find" method which returns all records that match the search criteria
	return User.findOne({ email: reqBody.email }).then(result => {

		// User does not exist
		if (result == null) {
			return false

			// User exists
		} else {

			// Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
			// The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password)
			//compareSync(<dataToCompare>, <encryptedPassword>)

			// If the passwords match/result of the above code is true
			if (isPasswordCorrect) {

				// Generate an access token
				// Uses the "createAccessToken" method defined in the "auth.js" file
				// Returning an object back to the frontend application is common practice to ensure information is properly labeled and real world examples normally return more complex information represented by objects
				return { access: auth.createAccessToken(result) }

				// Passwords do not match
			} else {
				return false//
			}
		}

	})
};

// S38 Activity Solution:
// Retrieve user details
module.exports.getProfile = (userData) => {

	return User.findById(userData.id).then(result => {
		console.log(userData)
		if (result == null) {
			return false
		} else {
			console.log(result)

			result.password = "*****";

			// Returns the user information with the password as an empty string
			return result;

		}
	});

};

// User enrollment
module.exports.enroll = async (data) => {

	let isAdmin = data.userData.isAdmin;

	if (!isAdmin) {
		const isUserUpdated = await User.findById(data.userId).then(user => {

			user.enrollments.push({ courseId: data.courseId })

			return user.save().then((user, error) => {
				if (error) {
					return false
				} else {
					return true
				}
			})

		})

		const isCourseUpdated = await Course.findById(data.courseId).then(course => {
			course.enrollees.push({ userId: data.userId })

			return course.save().then((course, error) => {
				if (error) {
					return false
				} else {
					return true
				}
			})
		})
		if (isUserUpdated && isCourseUpdated) {
			return true //"User successfully enrolled"
		} else {
			return false //"Client cannot enroll. Error encountered."
		}
	} else {
		return "Admin not allowed to enroll courses. Oki?"
	}
};
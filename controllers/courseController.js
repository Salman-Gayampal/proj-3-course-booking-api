const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../auth');

// Create a new course
module.exports.addCourse = (reqBody, userData) => {

    return User.findById(userData.userId).then(result => {
        if (userData.isAdmin == false) {
            return "You are not an Admin"
        } else {
            // Create a variable "newCourse" and instantiate a new "Course" object using the mongoose model.
            // Uses the information from the request body to provide all the neceaary information
            let newCourse = new Course({
                name: reqBody.name,
                description: reqBody.description,
                price: reqBody.price
            });

            // Saves the created object to our DB using .save()
            return newCourse.save().then((course, error) => {
                // Course creation failed
                if (error) {
                    return false
                    // Course creation successful 
                } else {
                    return "Course creation successful" //true
                }
            })
        }
    })
};

// Controller function for retreiving all courses
module.exports.getAllCourses = (data) => {
    if (data.isAdmin) {
        return Course.find({}).then(result => {
            return result
        })
    } else {
        return false
    }
};

// Retrieves All Active Courses
module.exports.getAllActive = () => {
    return Course.find({ isActive: true }).then(result => {
        return result
    })
};


// Retrieve a Specific Course
module.exports.getCourse = (reqParams) => {
    return Course.findById(reqParams.courseId).then(result => {
        return result
    })
};

// Updating a course
module.exports.updateCourse = (reqParams, reqBody, data) => {

    if (data) {

        let updatedCourse = {
            name: reqBody.name,
            description: reqBody.description,
            price: reqBody.price
        }
        // Syntax: findByIdAndUpdate(document ID, updatesToBeApplied)
        //
        return Course.findByIdAndUpdate(reqParams.courseId, updatedCourse).then((updatedCourse, error) => {
            if (error) {
                return false
            } else {
                return true
            }
        })

    } else {
        return "You are not an Admin!"
    }
};

// Activity
// Archiving a course

module.exports.archiveCourse = (reqBody) => {
    const userData = auth.decode(reqBody.headers.authorization)
    const courseId = reqBody.params.courseId

    return User.findById(userData.id).then((resultFromController) => {
        if (userData.isAdmin) {
            return Course.findByIdAndUpdate(courseId, { isActive: false }).then((updatedCourse, error) => {
                if (error) {
                    return false
                } else {
                    return 'Course has been archived'
                }
            }
            )
        } else {
            return 'You are not an admin'
        }
    })
};

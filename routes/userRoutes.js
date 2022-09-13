const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../auth');



// Route for checking if the user's email already exists in the database
// Invokes the checkEmailExists function from the controller file to communicate with our database
// Passes the "body" property of our "request" object to the corresponding controller function
// The full route to access this is "http://localhost:4000/users/checkEmail" where the "/users" was defined in our "index.js" file
// The "then" method uses the result from the controller function and sends it back to the frontend application via the "res.send" method
router.post("/checkEmail", (req, res) => {
    userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
})

7
// Route for user registration
router.post("/register", (req, res) => {
    userController.registerUser(req.body).then(resultFromController => res.send(resultFromController))
});

// Route for user authentication
router.post("/login", (req, res) => {
    userController.loginUser(req.body).then(resultFromController => res.send(resultFromController))
});

// S38 Activity Solution
// Route for retrieving user details
// The "auth.verity" acts as a middleware to ensure that the user is logged in before they can enroll to a course
router.get("/details", auth.verify, (req, res) => {

    const userData = auth.decode(req.headers.authorization)
    // console.log(userData)

    userController.getProfile({id: userData.id}).then(resultFromController => res.send(resultFromController));

});


// Route for enrolling a user
router.post("/enroll", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization)
    console.log(userData)

    let data = {
        userId: req.body.userId,
        courseId: req.body.courseId,
        userData: userData
    }

    userController.enroll(data).then(resultFromController => res.send(resultFromController))
})

module.exports = router;

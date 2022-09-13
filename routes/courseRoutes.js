const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../auth');


// Route for creating a course
router.post("/", auth.verify, (req, res) => {

    const userData = auth.decode(req.headers.authorization)

    courseController.addCourse(req.body, { userId: userData.id, isAdmin: userData.isAdmin }).then(resultFromController => res.send(resultFromController))
});


// Route for retrieving all the course
router.get("/all", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization)

    courseController.getAllCourses(userData).then(resultFromController => res.send(resultFromController))
});


// Route fo retrieving all active course
router.get("/", (req, res) => {
    courseController.getAllActive().then(resultFromController =>
        res.send(resultFromController))
});


// Route for retrievinga specific course
router.get("/:courseId", (req, res) => {
    console.log(req.params.courseId)

    courseController.getCourse(req.params).then(resultFromController => res.send(resultFromController))
});


// Route for updating a course
router.put("/:courseId", auth.verify, (req, res) => {

    const isAdminData = auth.decode(req.headers.authorization).isAdmin
    console.log(isAdminData)

    courseController.updateCourse(req.params, req.body, isAdminData).then(resultFromController => res.send(resultFromController))
});

// Activity
// Route for archiving courses - soft deletion
// /:courseId/archive 
router.put('/:courseId/archive', auth.verify, (req, res) => {
    courseController.archiveCourse(req).then((resultFromController) => {
        res.send(resultFromController)
    })
});

module.exports = router;
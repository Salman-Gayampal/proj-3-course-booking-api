const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name cannot be empty!"]
    },
    lastName: {
        type: String,
        required: [true, "Last name cannot be empty!"]
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty!"]
    },
    password: {
        type: String,
        required: [true, "Password cannot be empty!"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, "Mobile number cannot be empty!"]
    },
    enrollments: [
        {
            courseId: {
                type: String,
                required: [true, "Please enter a courseId!"]
            },
            enrolledOn: {
                type: Date,
                default: new Date()
            },
            status: {
                type: String,
                default: "Enrolled"
            }
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
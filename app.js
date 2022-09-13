// Express Setup
const express = require('express');
const mongoose = require('mongoose');
// Allows our backend application to be avaialable for use in our frontend application. 
// It also allows us to control the app's Cross-Origin Resources Sharing (CORS) Settings. 
const cors = require('cors'); 
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const port = 4000;

// Middlewares
// Allows all resources to access our backend application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Main URI:
app.use("/users", userRoutes)
app.use("/courses", courseRoutes)

//  removed/disabled mongoose as per git detection of security leak

/* // Mongoose Connection
mongoose.connect(`mongodb+srv://.mongodb.net/s37-s41?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
 */
const db = mongoose.connection

db.on('error', () => console.error('Connection Error'))
db.once('open', () => console.log('Connected to MongoDB!'))

app.listen(port, () => console.log(`API is now online at port ${port}`));
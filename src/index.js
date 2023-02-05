require('./models/User');
require('./models/Exercise');
require('./models/Workout');

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('./mongooseStarter')
const authRoutes = require('./routes/authRoutes')
const exerciseRoutes = require('./routes/exerciseRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const requireAuth = require('./middlewares/requireAuth')

mongoose.start();

const app = express();

//Body Parser has to be first.
app.use(bodyParser.json());
app.use(authRoutes);
app.use(exerciseRoutes);
app.use(workoutRoutes);

/* Express Set-up */
app.get('/', requireAuth, (req, res) => {
    res.send(`Your e-mail: ${req.user.email}`);
})

app.listen(3000, ()=>{
    console.log("Server started, listening on port 3000");
})
const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Workout = mongoose.model('Workout');
const Exercise = mongoose.model('Exercise');

const router = express.Router();
router.use(requireAuth);

router.get('/workouts', async (req, res) => {
    const workouts = await Workout.find({userId: req.user._id});
    res.send(workouts);
})

router.get('/workouts/:workoutID', async (req,res) => {
    let workoutID = req.params.workoutID;
    const workout = await Workout.find({_id: workoutID, userId: req.user._id});
    if (workout.length != 1)
    {
        res.send(400).send({error: "ERROR"});
    }
    res.send(workout[0]);
})


router.post('/workouts', async (req, res) => {
    const {workoutDate, exerciseList, notes} = req.body;
    if (!workoutDate || !exerciseList)
    {
        return res.status(422).send({error: "You must provide a date and exercise list"});
    }

    try {
        // Save the exercises in the database
        // This might be better in a different file?
        let exerciseIDList = [];
        for( const targetExercise of exerciseList)
        {
            const {name, muscleGroup, setList, notes} = targetExercise;
            if (!name || !muscleGroup || !setList)
            {
                return res.status(422).send({error: "You must provide a name, muscle group and set list"});
            }
        
            try {
                const exercise = new Exercise({name, muscleGroup, setList, notes, userId: req.user._id})
                await exercise.save();
                exerciseIDList.push(exercise._id);
            } catch (err)
            {
                return res.status(422).send({error:err.message});
            }
        }
        const workout = new Workout({workoutDate, exerciseList: exerciseIDList, notes, userId: req.user._id})
        await workout.save();
        res.send(workout);
    } catch (err)
    {
        return res.status(422).send({error:err.message});
    }
})

module.exports = router;
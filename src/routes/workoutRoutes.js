const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Workout = mongoose.model('Workout');

const router = express.Router();
router.use(requireAuth);

router.get('/workouts', async (req, res) => {
    const workouts = await Workout.find({userId: req.user._id});
    res.send(workouts);
})

router.post('/workouts', async (req, res) => {
    const {workoutDate, exerciseList, notes} = req.body;
    if (!workoutDate || !exerciseList)
    {
        return res.status(422).send({error: "You must provide a date and exercise list"});
    }

    try {
        const workout = new Workout({workoutDate, exerciseList, notes, userId: req.user._id})
        await workout.save();
        res.send(workout);
    } catch (err)
    {
        return res.status(422).send({error:err.message});
    }


})

module.exports = router;
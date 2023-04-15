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

router.get('/workouts/:workoutID', async (req,res) => {
    try {
        let workoutID = mongoose.Types.ObjectId(req.params.workoutID);
        const currentUser = req.user._id;
        const workout = await Workout.findOne({_id: workoutID, userId: currentUser});
        if (workout)
        {
            res.send(workout);
        } else {
            res.status(500).send("Invalid Request");
        }
    } catch (err)
    {
        console.log(err);
        res.status(500).send(err.message);
    }
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

router.delete('/workouts/:workoutID', async (req, res) => {
    try { 
        const currentUser = req.user._id;
        const workoutID = mongoose.Types.ObjectId(req.params.workoutID);
        await Workout.findOneAndDelete({_id: workoutID, userID: currentUser});
        res.send("Workout deleted");
    } catch (err)
    {
        return res.status(422).send({error:err.message});
    }
})

router.put('/workouts/:workoutID', async (req, res) => {
    try { 
        console.log("Hello");
        const currentUser = req.user._id;
        const workoutID = req.body._id;
        const workout = await Workout.findOneAndUpdate({_id: workoutID, userID: currentUser}, req.body, {new: true})
        res.send(workout);
    } catch (err)
    {
        return res.status(422).send({error:err.message});
    }

})

module.exports = router;
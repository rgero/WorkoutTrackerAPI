const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Exercise = mongoose.model('Exercise');

const router = express.Router();
router.use(requireAuth);

router.get('/exercises', async (req, res) => {
    const exercises = await Exercise.find({userId: req.user._id});
    res.send(exercises);
})

router.get('/exercises/:exerciseID', async (req,res) => {
    let exerciseID = req.params.exerciseID;
    const exercise = await Exercise.find({_id: exerciseID, userId: req.user._id});
    if (exercise.length != 1)
    {
        res.send(400).send({error: "ERROR"});
    }
    res.send(exercise[0]);
})

router.post('/exercises', async (req, res) => {
    const {name, muscleGroup, setList, notes} = req.body;
    if (!name || !muscleGroup || !setList)
    {
        return res.status(422).send({error: "You must provide a name, muscle group and set list"});
    }

    try {
        const exercise = new Exercise({name, muscleGroup, setList, notes, userId: req.user._id})
        await exercise.save();
        res.send(exercise);
    } catch (err)
    {
        return res.status(422).send({error:err.message});
    }


})

module.exports = router;
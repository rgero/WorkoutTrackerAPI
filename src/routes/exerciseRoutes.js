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
    try {
        const currentUser = req.user._id;
        const exerciseID = mongoose.Types.ObjectId(req.params.exerciseID);
        const exercise = await Exercise.findOne({_id: exerciseID, userID: currentUser});
        if (exercise)
        {
            res.send(exercise);
        } else {
            res.status(500).send("Invalid Request");
        }
    } catch (err)
    {
        console.log(err);
        res.status(500).send(err.message);
    }
})

router.put('/exercises', async (req, res) => {
    try {
        const {_id, name, muscleGroup, setList, notes} = req.body;
        let updatedExercise = {
            name,
            muscleGroup,
            setList,
            notes
        }
        const targetID = mongoose.Types.ObjectId(_id);
        const exercise = await Exercise.findByIdAndUpdate(targetID, updatedExercise, {new: true})
        if (exercise)
        {
            res.send(exercise);
        } else {
            res.status(500).send("Invalid Request");
        }
        
    } catch (err)
    {
        console.log(err);
        res.status(500).send(err.message);
    }
})

router.put('/exercises/:exerciseID', async (req, res) => {
    try {
        const {name, muscleGroup, setList, notes} = req.body;
        let updatedExercise = {
            name,
            muscleGroup,
            setList,
            notes
        }
        const targetID = mongoose.Types.ObjectId(req.params.exerciseID);
        const exercise = await Exercise.findByIdAndUpdate(targetID, updatedExercise, {new: true})
        if (exercise)
        {
            res.send(exercise);
        } else {
            res.status(500).send("Invalid Request");
        }
        
    } catch (err)
    {
        console.log(err);
        res.status(500).send(err.message);
    }
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
const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: ""
        },
        muscleGroup: {
            type: String,
            default: ""
        },
        setList: [{
            reps: Number,
            weight: Number,
        }],
        notes: {
            type: String,
            default: ""
        },
    }
);

const workoutSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        workoutDate: {
            type: Date,
            required: true
        },
        notes: {
            type: String,
            default: ""
        },
        exerciseList: [exerciseSchema]
    }
)

mongoose.model("Workout", workoutSchema);
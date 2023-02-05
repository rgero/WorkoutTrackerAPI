const mongoose = require('mongoose')

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
        exerciseList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        }]
    }
)

mongoose.model("Workout", workoutSchema);
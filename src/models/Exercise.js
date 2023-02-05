const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
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
)

mongoose.model("Exercise", exerciseSchema);
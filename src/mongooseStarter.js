const mongoose = require('mongoose');
const credentials = require('./credentials');

// Just playing around with this, should be refactored to be smarter.
module.exports = {
    start: () => {
        const desiredUsername = credentials["username"]
        const desiredPassword = credentials["password"]
        
        /* Mongoose connection */
        const mongoURI = `mongodb+srv://${desiredUsername}:${desiredPassword}@cluster0.0n5teta.mongodb.net/?retryWrites=true&w=majority`
        mongoose.connect(mongoURI)
        
        mongoose.connection.on("connected", ()=> {
            console.log("Connected to Mongo Instance")
        })
        
        mongoose.connection.on('error', (err)=> {
            console.error("Error connecting to mongo", err);
        })
    }
}
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = mongoose.model("User");
const credentials = require('../credentials');

router.get('/users', async (req, res) => {
    try{
        let token = req.headers.authorization.split(" ")[1]; // Bearer <token>
        const secretKey = credentials["secureKey"]
        let result = jwt.verify(token, secretKey);
        let userId = mongoose.Types.ObjectId(result.userId);
        const user = await User.findOne({_id: userId});
        let targetResponse = {
            email: user.email,
            displayName: user.displayName
        }
        res.send(targetResponse);
    } catch (err) {
        return res.status(422).send({error: "Invalid user request"})
    }
       
})

module.exports = router;
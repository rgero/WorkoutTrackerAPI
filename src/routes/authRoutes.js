const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = mongoose.model("User");
const credentials = require('../credentials');

router.post ('/signup', async (req, res)=> {
    try {
        
        let {email, displayName, password} = req.body
        const user = new User({email, password, displayName});
        await user.save();

        const secretKey = credentials["secureKey"]
        const token = jwt.sign({userId: user._id}, secretKey)

        res.send({ token });

    } catch (err)
    {
        return res.status(422).send(err.message);
    }
})

router.post(`/signin`, async (req, res) => {
    const {email, password} = req.body;
    const secretKey = credentials["secureKey"]

    if (!email || !password)
    {
        return res.status(422).send({error: "Must provide an email and password"});
    }

    const user = await User.findOne({email});
    if (!user)
    {
        return res.status(422).send({error: "Invalid email or password"});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, secretKey)
        return res.send({token})

    } catch (err)
    {
        return res.status(422).send({error: "Invalid email or password"})
    }

})

module.exports = router;
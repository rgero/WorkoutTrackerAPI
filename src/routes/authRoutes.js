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

        res.send({ token, email, displayName });

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

        const response = {
            token: token,
            displayName: user.displayName,
            email: user.email
        }
        return res.send(response)

    } catch (err)
    {
        return res.status(422).send({error: "Invalid email or password"})
    }

})

router.post(`/change`, async (req, res) => {
    const {email, password, changes} = req.body;
    const secretKey = credentials["secureKey"]

    if (!email || !password || !changes)
    {
        return res.status(422).send({error: "Request not full"});
    }

    if (Object.keys(changes)==0)
    {
        return res.status(422).send({error: "Request not full"});
    }

    const user = await User.findOne({email});
    if (!user)
    {
        return res.status(422).send({error: "Invalid email or password"});
    }

    try {
        await user.comparePassword(password);

        if (changes.email)
        {
            user.email = changes.email;
        }

        if (changes.password)
        {
            user.password = changes.password;
        }

        if (changes.displayName)
        {
            user.displayName = changes.displayName;
        }

        await user.save();

        // Return the user data.
        const token = jwt.sign({userId: user._id}, secretKey)
        const response = {
            token: token,
            displayName: user.displayName,
            email: user.email
        }
        return res.send(response);
    } catch (err)
    {
        return res.status(422).send({error: "Invalid email or password"})
    }
})

module.exports = router;
const express = require('express')
const router = express.Router()
const morgan = require('morgan');
const User = require('../Models/User.model')
const createError = require('http-errors');
const { authSchema } = require('../Helpers/validation_schema')
const { signAccessToken } = require('../Helpers/jwt_helper')


router.post('/register', async (req, res, next) => {

    try {
        const result = await authSchema.validateAsync(req.body)
        // console.log(result)

        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createError.Conflict(`${result.email} is already registered`)

        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)

        res.send({ accessToken })
    } catch(error) {
        if (error.isJoi == true) error.status = 422
        next(error)
    }
})



router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw createError.BadRequest('Email and password are required.');

        const user = await User.findOne({ email });
        if (!user) throw createError.NotFound('User not registered.');

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) throw createError.Unauthorized('Incorrect password.');

        const accessToken = await signAccessToken(user.id);
        res.send({ accessToken });
    } catch (error) {
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send("refresh token route")
})

router.delete('/logout', async (req, res, next) => {
    res.send("logout route")
})



module.exports = router;
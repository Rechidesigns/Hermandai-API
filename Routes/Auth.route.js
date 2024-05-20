const express = require('express')
const router = express.Router()
const morgan = require('morgan');
const User = require('../Models/User.model')
const createError = require('http-errors');
const { authSchema } = require('../Helpers/validation_schema')
const { signAccessToken, 
    signRefreshToken,  
    verifyRefreshToken } = require('../Helpers/jwt_helper')
// const client = required('../Helpers/init_redis')

const { isTokenBlacklisted, addToBlacklist } = require('../Helpers/tokenUtils');


router.post('/register', async (req, res, next) => {

    try {
        const result = await authSchema.validateAsync(req.body)
        // console.log(result)

        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createError.Conflict(`${result.email} is already registered`)

        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        res.send({ accessToken, refreshToken })
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
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
        next(error)
    }
})

// router.delete('/logout', async (req, res, next) => {
//     try {
//         const { refreshToken } = req.body
//         if (!refreshToken) throw createError.BadRequest()
//             const userId = await verifyRefreshToken(refreshToken)
//         if (err) {
//             console.log(err.message)
//             throw createError.InternalServerError()
//         }
//         res.sendStatus(204)

//         const refToken = await signRefreshToken(userId)
//         res.destroy({ refreshToken: refToken })
//     } catch (error) {
//         next(error)
//     }
// })


router.delete('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();

        // Check if the refresh token is already blacklisted
        if (isTokenBlacklisted(refreshToken)) {
            throw createError.Unauthorized('Refresh token already invalidated');
        }

        // Add the refreshToken to the blacklist
        addToBlacklist(refreshToken);

        res.status(200).send('User logged out successfully');
    } catch (error) {
        next(error);
    }
});



module.exports = router;
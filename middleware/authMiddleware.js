const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

const requireAuth = (req, res, next) => {
    const token = req.cookies.restaurantJwt;

    // Check if token jwt exists and is valid
    if (token) {
        jwt.verify(token, 'starlabs restaurant website secret has changed', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }

}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.restaurantJwt;

    // Check if token jwt exists and is valid
    if (token) {
        jwt.verify(token, 'starlabs restaurant website secret has changed', async(err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser };
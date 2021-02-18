const User = require('../models/User');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');

const maxAge = 2 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'starlabs restaurant website secret has changed', {
        expiresIn: maxAge
    });
}

const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = { name: '', username: '', mobile: '', email: '', password: '', date: '', time: '', seats: '' };

    //incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'User doesnot exist';
    }

    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Password is incorrect';
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email already exists';
        return errors;
    }

    // validating user errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // validating reservation errors
    if (err.message.includes('reservation validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.reservation_get = (req, res) => {
    res.redirect(301, '/reservation');
    res.render('reservation');
}

module.exports.signup_post = async(req, res) => {

    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });

        console.log(user);

        res.json({ user });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.login_post = async(req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie('restaurantJwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({ user: user._id });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.reservation_post = async(req, res) => {

    const { name, email, mobile, date, time, seats } = req.body;
    const checkReserve = req.body;

    try {
        const reservation = await Reservation.create({ name, email, mobile, date, time, seats });

        // const resResult = await Reservation.checkReservation();

        // const reserve = resResult.map(result => {

        //     if (checkReserve.name === result.name) {
        //         console.log(true);
        //     }

        // });

        // console.log(reserve);

        res.status(200).json({ reservation: reservation._id });

        return reservation;

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.logout_get = async(req, res) => {
    res.cookie('restaurantJwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.admin_panel = async(req, res) => {
    try {
        const Users = await User.getUsers();

        res.status(200).send(Users);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
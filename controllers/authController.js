const User = require('../models/User');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const Menus = require('../models/Menus');
const Cart = require('../models/Cart');
const { Mongoose } = require('mongoose');
const Contact = require('../models/Contact');
const Comment = require('../models/Comments');
const Likes = require('../models/Likes');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const maxAge = 2 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'starlabs restaurant website secret has changed', {
        expiresIn: maxAge
    });
}

const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = { name: '', username: '', mobile: '', email: '', password: '', date: '', time: '', seats: '', menu: '', user: '', status: '', menuName: '', menuPrice: '', menuDescription: '', menuType: '', contactName: '', contactEmail: '', subject: '', message: '', comment: '', commentName: '' };

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

    // validating cart errors
    if (err.message.includes('cart validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // validating menu errors
    if (err.message.includes('menu validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // validating contact errors
    if (err.message.includes('contact validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // validating comments errors
    if (err.message.includes('comment validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    // validating likes errors
    if (err.message.includes('likes validation failed')) {
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

module.exports.menus_post = async(req, res) => {
    const { menuName, menuPrice, menuDescription, menuType } = req.body;
    try {
        if (menuName) {
            // let img = {
            //     data: fs.readFileSync(req.files.userPhoto.path),
            //     type: 'image/jpg'
            // }
            const menuPost = await Menus.create({ menuId: uuid.v4(), menuName, menuPrice, menuDescription, menuType });
            res.status(200).json({ menuPost });
        } else {
            const menuLists = await Menus.getMenus();
            console.log('fetched');
            console.log(menuLists);
            res.status(200).json({ menuLists });
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.contact_post = async(req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const contact = await Contact.create({ contactName: name, contactEmail: email, subject, message });
        res.status(200).json({ contact });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.customeMenu_get = async(req, res) => {
    res.render('custome_menu');
}

module.exports.cart_post = async(req, res) => {
    const { email } = req.body;
    const { menu, userEmail, status } = req.body;

    console.log(req.body);

    try {
        if (email) {
            const cartGet = await Cart.getCartItems(email);
            res.status(200).json({ cartGet });
            console.log(email);
        }

        if (userEmail) {
            const cartPost = await Cart.create({ menu, user: userEmail, status });
            res.status(200).json({ cartPost });
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.cart_delete_post = async(req, res) => {
    const { menuItem } = req.body;
    console.log(menuItem);
    try {
        let cart = await Cart.deleteMany({ _id: menuItem });
        console.log(cart);
        const response = 'Operation successful';
        res.status(200).json({ response });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.cart_get = async(req, res) => {
    res.render('cart');
}

module.exports.comment_get = async(req, res) => {
    try {
        const comments = await Comment.getComments();
        res.status(200).json({ comments });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.comment_post = async(req, res) => {
    const { comment, name } = req.body;

    try {
        const comments = await Comment.create({ comment, commentName: name });
        res.status(200).json({ comments });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.order_post = async(req, res) => {
    const { bunType, pattyType } = req.body;
    console.log(bunType);
    console.log(pattyType);
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

module.exports.likes_post = async(req, res) => {
    const { action, email, userEmail, itemId } = req.body;
    try {
        if (email) {
            let likesGet = await Likes.fetchLikes(email);
            console.log(likesGet);
            res.status(200).json({ likesGet });
        } else if (action == 'delete') {
            await Likes.deleteMany({ itemId }),
                (err) => {
                    console.log(err);
                }
            const response = 'Operation Successful';
            res.status(200).json({ response });
        } else {
            let likesPost = await Likes.create({ userEmail, itemId });
            res.status(200).json({ likesPost });
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
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
const mongoose = require('mongoose');
const uuid = require('uuid');
const { isEmail } = require('validator');
const { hash, compare } = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

// Hash password
userSchema.pre('save', async function(next) {
    this.password = await hash(this.password, 10);
    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

//Statis method to get all users in the database
userSchema.statics.getUsers = async function() {
    const user = await this.find();

    return user;
}

const User = mongoose.model('user', userSchema);

module.exports = User;
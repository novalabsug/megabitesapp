const mongoose = require('mongoose');
const { isEmail } = require('validator');

const contactSchema = mongoose.Schema({
    contactName: {
        type: String,
        required: [true, 'Name is required']
    },
    contactEmail: {
        type: String,
        required: [true, 'Email is required'],
        validate: [isEmail, 'Please enter a valid email']
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    }
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
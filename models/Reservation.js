const mongoose = require('mongoose');

const resSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your full name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email']
    },
    mobile: {
        type: Number,
        required: [true, 'Please enter your phone number'],
        maxlength: [10, 'Phone number incorrect']
    },
    date: {
        type: String,
        required: [true, 'Please enter a reservation date']
    },
    time: {
        type: String,
        required: [true, 'Please enter a reservation time']
    },
    seats: {
        type: String
    }
});

resSchema.statics.checkReservation = async function() {
    const result = await this.find();
    return result;
}

const Reservation = mongoose.model('reservation', resSchema);

module.exports = Reservation;
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const cartSchema = mongoose.Schema({
    menu: {
        type: Object,
        required: [true, 'Menu Id is required']
    },
    user: {
        type: String,
        required: [true, 'User email is required']
    },
    status: {
        type: String,
        required: [true, 'Status is required']
    }
});

// static method to login user
cartSchema.statics.getCartItems = async function(email) {
    const user = await this.find({ user: email });

    return user;
}

// cartSchema.statics.deleteCartItem = async function(id) {
//     const user = await this.find({ _id: id });
//     if (user) {
//         remo
//     }
//     return user;
// }

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
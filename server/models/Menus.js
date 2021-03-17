const mongoose = require('mongoose');
const uuid = require('uuid');
const { isEmail } = require('validator');

const menuSchema = mongoose.Schema({
    menuId: {
        type: String,
        required: [true, "Menu Id is required"],
        unique: true
    },
    menuName: {
        type: String,
        required: [true, "Menu name is required"]
    },
    menuPrice: {
        type: Number,
        required: [true, "Menu price is required"]
    },
    menuDescription: {
        type: String,
        required: [true, "Menu description is required"]
    },
    menuType: {
        type: String,
        required: [true, "Menu type is required"]
    }
});

//Statis method to get all menus in the database
menuSchema.statics.getMenus = async function() {
    const menus = await this.find();
    return menus;
}

const Menus = mongoose.model('menu', menuSchema);

module.exports = Menus;
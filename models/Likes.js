const mongoose = require('mongoose');

const likesSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    }
});

// Fetch likes of a user
likesSchema.statics.fetchLikes = async function(email) {
    const userLikes = await this.find({ userEmail: email });
    if (userLikes) {
        return userLikes;
    } else {
        throw Error('User not found');
    }
}

const Likes = mongoose.model('likes', likesSchema);

module.exports = Likes;
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment is required']
    },
    commentName: {
        type: String,
        required: [true, 'Name is required']
    },
});

//Statis method to get comments in the database
commentSchema.statics.getComments = async function() {
    const comments = await this.find();

    return comments;
}

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
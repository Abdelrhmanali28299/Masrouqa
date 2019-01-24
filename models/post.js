const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: {
        type: [String],
        required: true
    },
    answers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'googleUsers'
            },
            content: {
                type: [String]
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'googleUsers'
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    usePushEach: true
})

const modelClass = mongoose.model('posts', postSchema)

module.exports = modelClass
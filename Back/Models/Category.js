
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    answer: { type: String, required: true }
})

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    questions: [questionSchema]
})


const categoryQuestions = mongoose.model('Questions', categorySchema)
module.exports = categoryQuestions;

const  mongoose = require('mongoose');

const lengthSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : String,
    length: String
})

module.exports = mongoose.model("length" , lengthSchema);


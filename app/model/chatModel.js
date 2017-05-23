var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatModel = new Schema({


    message: { type: String },
    user: { type: String }




})
var chats = mongoose.model('chatCollection', chatModel);
module.exports = chats;

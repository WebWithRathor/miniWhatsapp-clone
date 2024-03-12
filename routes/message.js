const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  message: String,
  sender:String,
  reciever:String
})


module.exports = mongoose.model('message',messageSchema);
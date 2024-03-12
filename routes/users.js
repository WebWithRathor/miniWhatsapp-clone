const mongoose = require('mongoose');
const plm =require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/miniWhatsapp");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  bio:String,
  freinds:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  groups:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group'
  }],
  profileImg:{
    type:String,
    default:'def.jpeg'
  },
  socketId:String
})

userSchema.plugin(plm);

module.exports = mongoose.model('user',userSchema);
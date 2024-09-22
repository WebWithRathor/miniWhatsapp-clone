const mongoose = require('mongoose');
const plm =require('passport-local-mongoose');

mongoose.connect("mongodb+srv://Devraj123:Devraj%40123@internshalaapiclone.91qzarm.mongodb.net/miniWhatsapp");

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

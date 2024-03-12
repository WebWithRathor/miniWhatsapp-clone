const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupname: String,

  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  profileImg:{
    type:String,
    default:'def.jpeg'
  }
})


module.exports = mongoose.model('group',groupSchema);
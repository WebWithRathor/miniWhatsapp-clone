var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const userModel = require('./users');
const groupModel = require('./group');
const messageModel = require('./message');

passport.use(new LocalStrategy(userModel.authenticate()));

function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register.ejs', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});

router.get('/chat',isLoggedin,async function(req, res, next) {  
  const loggedInUser = await userModel.findOne({username:req.session.passport.user}).populate('freinds').populate('groups');
  res.render('chat.ejs',{loggedInUser});
})

router.get('/searchUser/:username',isLoggedin,async function(req, res, next) {
  const users = await userModel.find({
    username: {
        $regex: req.params.username,
        $options: 'i'
    },
    username: {
        $ne:req.user.username
    }
});
  res.status(200).json(users);
});
router.get('/group/:groupname',isLoggedin,async function(req, res, next) {
  const groups = await groupModel.find({
    groupname: {
        $regex: req.params.groupname,
        $options: 'i'
    },
});
  res.status(200).json(groups);
});

router.get('/addFreind/:user', isLoggedin, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
  const freindUser = await userModel.findOne({ username:req.params.user });
  if (!loggedInUser.freinds.includes(freindUser._id)) {
    loggedInUser.freinds.push(freindUser._id);
    freindUser.freinds.push(loggedInUser._id);
    await loggedInUser.save();
    await freindUser.save();
  }
  res.redirect("/chat");
});

router.get('/allUserchats/:username',isLoggedin,async function(req,res){
  const messages = await messageModel.find({
    $or:[
      {sender:req.user.username,reciever:req.params.username},
      {reciever:req.user.username,sender:req.params.username}
  ]
  })
  res.json(messages);
})
router.get('/allGroupchats/:groupname',isLoggedin,async function(req,res){
  const messages = await messageModel.find({reciever:req.params.groupname
  })
  console.log(messages)
  res.json(messages);
})

router.get('/addgroup/:group', isLoggedin, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
  const group = await groupModel.findOne({ groupname:req.params.group });
  if (!loggedInUser.groups.includes(group._id)) {
    loggedInUser.groups.push(group._id);
    group.users.push(loggedInUser._id);
    await loggedInUser.save();
    await group.save();
  }
  res.redirect("/chat");
});

router.get('/allgroups',isLoggedin,async function(req,res){
  const groups = await groupModel.find();
  res.json(groups);
})

router.get('/get/:type',async function(req,res,next){
  const connections = await userModel.findOne({username:req.session.passport.user}).populate(`${req.params.type}`)
  res.json(connections[req.params.type]);
})

router.get('/CreateGroup',isLoggedin,async function(req, res){
  const loggedInUser = await userModel.findOne({username:req.user.username});
  const group = await groupModel.create({
    groupname:req.query.groupName,
    users:[req.user.id]
  })
  loggedInUser.groups.push(group._id);
  await loggedInUser.save();
  res.redirect('/chat');
})


router.post('/register', function(req, res, next) {
  const user = new userModel({
    username: req.body.username,
    bio:req.body.bio
  })

  userModel.register(user,req.body.password)
  .then(function(registeredUser){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/chat');
    })
  })
})

router.post('/login',passport.authenticate("local",{
  successRedirect: '/chat',
  failureRedirect: '/login',
}),function(req,res,next){});



module.exports = router;

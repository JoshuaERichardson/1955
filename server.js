//CONFIG
const mongoose = require('mongoose');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
mongoose.connect('mongodb://localhost/1955', {useNewUrlParser: true});

const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

//MODELS
const UserSchema = new mongoose.Schema({
  name: String,
}, {timestamps: true})
const User = mongoose.model('User', UserSchema);


//ROUTES
app.get('/', (req, res) =>{
  User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})


app.get('/new/:name', (req, res) =>{
  const user = new User();
  user.name = req.params.name;
  user.save()
    .then(newUserData => {
      console.log('message created: ', newUserData);
      res.redirect('/');
    })
    .catch(console.log('poop'))
  res.redirect('/');
})

app.get('/remove/:name', (req, res) => {
  User.remove({name: req.params.name})
    .then(deleteUser => {

      console.log('Removed name: ', req.params.name);
      res.redirect('/')
    })
    .catch(err => res.json(err));
    res.redirect('/');
})

// app.get('/:name', (req, res) => {
//   User.findOne({name: req.params.name})
//     .then(users => res.json(users.params))
//     .catch(err => res.json(err))
//   })

app.get('/:name', (req, res) => {
  User.find({name: req.params.name})
    .then(users => res.json(users))
    .catch(err => res.json(err));
})
//SERVER LISTEN
app.listen(8000, () => console.log("listening on port 8000"));


// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();

// new code:
var session = require('express-session');
// more new code:
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');
// Require mongoose for mongodb manipulation

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

var UserSchema = new mongoose.Schema({
    first_name:  { type: String, required: true, minlength: 2},
    last_name: { type: String, required: true, maxlength: 20 },
    age: { type: Number, min: 1, max: 150 },
    email: { type: String, required: true }
}, {timestamps: true });

mongoose.model('User', UserSchema);

var User = mongoose.model('User'); // We are retrieving this Schema from our Models, named 'User'


// set up other middleware, such as session
const flash = require('express-flash');
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    //var user = new User({first_name: req.body.first_name, last_name: req.body.last_name, age: req.body.age, email: req.body.email});
    var user = new User({first_name: req.body.first_name, last_name: req.body.last_name, age: req.body.age, email: req.body.email});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            res.redirect('/users');
        }
    });
    res.redirect('/');
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() { console.log("listening on port 8000"); })

let express = require('express');

let app = express();

let session = require('express-session');
app.use(session({
    secret: "notes app",
    resave: true,
    saveUninitialized: true}));

app.get('/', function(req, res){
    if (!req.session.notes) req.session.notes = [];
    res.render("notes.pug", {notes:req.session.notes});
});

app.get('/del/:id', function(req, res){
    if (!req.session.notes) req.session.notes = [];
    req.session.notes.splice(req.params.id, 1);
    res.render("notes.pug", {notes:req.session.notes});
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function(req, res){
    let note = req.body?.note;
    if (!req.session.notes) req.session.notes = [];
    req.session.notes.push(note);
    res.render("notes.pug", {notes:req.session.notes});
});

app.listen(3000);

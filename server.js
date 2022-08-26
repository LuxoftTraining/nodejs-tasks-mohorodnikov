let express = require('express');
let app = express();

let path = require('path');
app.use(express.static(path.join(__dirname, './public')));

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const {MongoClient} = require("mongodb");
let notes;
let ObjectId = require('mongodb').ObjectId;

(async () => {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    let db = client.db('tutor');
    notes = db.collection('notes');
})()

app.get("/notes", async function (req, res) {
    let cursor = await notes.find(req.query);
    let items = await cursor.toArray();
    res.send(items);
});

app.delete("/notes/:id?", async function (req, res) {
    let result;
    if (req.params.id) {
        let id = new ObjectId(req.params.id);
        result = await notes.deleteOne({_id: id})
    } else {
        console.log("deleting ALL notes!");
        result = await notes.deleteMany({});
    }

    if (result.deletedCount === 1) {
        res.send({ok: true});
    } else {
        res.send({ok: false});
    }
});

app.post("/notes", async function (req, res) {
    await notes.insertOne(req.body);
    res.end();
});


app.patch("/notes/:id/:noteText?", async function (req, res) {
    let result;
    if (req.params.id) {
        let id = new ObjectId(req.params.id);
        const text = (req.params.noteText) ? req.params.noteText : 'Not empty please :)';
        result = await notes.updateOne({_id: id}, {$set: {text: text}});
    }
    res.send(result);
});


app.listen(3000);
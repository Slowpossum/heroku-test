var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));



var notes = [];
fs.readFile("./data/notes.txt", "utf-8", function (err, data) {
    if (err) throw err;

    notes = JSON.parse(data) || [];
});

app.get('/api/notes', function (req, res) {
    res.json(notes);
});

app.post('/api/notes', function (req, res) {
    var newNote = req.body;

    notes.push(newNote);
    fs.writeFile("./data/notes.txt", JSON.stringify(notes), function (err) {
        if (err) throw err;
    });
    res.json(notes);
});

app.delete('/api/notes/:id', function (req, res) {
    var deleteId = req.params.id;

    for (noteIndex in notes) {
        if (notes[noteIndex].id === deleteId) {
            notes.splice(noteIndex, 1);
        }
    }

    res.json(notes);
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
    console.log(`Now listening on port:${PORT}`);
});
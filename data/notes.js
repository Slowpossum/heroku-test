var fs = require("fs");
var test = "";
fs.readFileSync("./data/notes.txt", "utf-8", function (err, data) {
    if (err) throw err;

    test = JSON.parse(data);
    console.log(JSON.parse(data));
});
console.log(test);
module.exports = test || [];
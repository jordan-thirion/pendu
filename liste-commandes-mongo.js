const { db } = require("./src/connect");

//création bdd
const MockWords = [
    { word: "cornedrue", hide: "#o######e" },
    { word: "cognards", hide: "c######s" },
    { word: "fourchelang", hide: "########a#g" },
    { word: "gringotts", hide: "#######tts" },
    { word: "hyppogriffes", hide: "####o######s" },
];

db.pendu.insertMany(MockWords)


//rajouter des indexs de sélection
db.pendu.update({word: "cornedrue"}, {$set: {index: 1}})
db.pendu.update({word: "cognards"}, {$set: {index: 2}})
db.pendu.update({word: "fourchelang"}, {$set: {index: 3}})
db.pendu.update({word: "gringotts"}, {$set: {index: 4}})
db.pendu.update({word: "hyppogriffes"}, {$set: {index: 5}})
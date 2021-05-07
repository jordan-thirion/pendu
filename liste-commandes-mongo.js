const { db } = require("./src/connect");

const MockWords = [
    { word: "cornedrue", hide: "#o######e" },
    { word: "cognards", hide: "c######s" },
    { word: "fourchelang", hide: "########a#g" },
    { word: "gringotts", hide: "#######tts" },
    { word: "hyppogriffes", hide: "####o######s" },
];

//use pendu
db.pendu.insertMany(MockWords)


//rajouter des indexs de sélection
db.pendu.update({word: "cornedrue"}, {$set: {index: 1}})
db.pendu.update({word: "cognards"}, {$set: {index: 2}})
db.pendu.update({word: "fourchelang"}, {$set: {index: 3}})
db.pendu.update({word: "gringotts"}, {$set: {index: 4}})
db.pendu.update({word: "hyppogriffes"}, {$set: {index: 5}})

//rajouter un ratio de win ou loose
db.pendu.updateMany({word: {$exists: true}}, {$set: {nbWin: 0 }})
db.pendu.updateMany({word: {$exists: true}}, {$set: {nbLose: 0}})

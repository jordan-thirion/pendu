const process = require('process');
const { db } = require('./src/connect');
const client = require("./src/connect");
const { ExceptionConsole } = require("./src/utils");
process.stdin.setEncoding('utf8');

const randomNumber = (max) =>{
    return Math.floor(
        Math.random() * (max) + 1
  )
}

async function game () {
    try{
        await client.connect();

        const database = client.db("pendu");
        const pendu = database.collection("pendu");
        const proj = {_id: 0, word:1, hide:1, nbWin:1, nbLose: 1};

        const listWordsLength = await pendu.find({}).count()

        var index = randomNumber(listWordsLength);

        var query = {"index": index};

        var chosenWord = await pendu.findOne(query, proj)

        var tabLetter = [];
        var listeLetter = "";

        var count = 0;
        var Wins = 0;
        var Loses = 0;

        //entré dans le jeu
        process.stdin.on("data", async (data) => {
            try {
              const letter = data.toString().trim();
              if (letter === chosenWord.word){  
                console.log("\n")
                console.log("You just found my words in " + count + " tries!")
                console.log("Wait! Did you just won? How could... you... beat... me?! I'm sure you cheated!")

                Wins = chosenWord.nbWin + 1;
                await pendu.updateOne(query, {$set: {nbWin: Wins }})
                chosenWord = await pendu.findOne(query, proj)
                console.log("For the word " + chosenWord.word + " you won " + chosenWord.nbWin + " times and lost " + chosenWord.nbLose + " times.")

                console.log("I want a rematch! This time i'll win! Or you ok?")
                process.stdout.write("yes/no? > ");
                tabLetter = [];
                count = 0;

                //init un autre mot
                index = randomNumber(listWordsLength);
                query = {"index": index};
                chosenWord = await pendu.findOne(query, proj)

              } else if (letter === 'yes') {
                console.log("\n")
                console.log("So you dare to challenge me? all right!")

                console.log("My word is... as i would tell you. Instead i'll give you some letters : ")
                console.log(chosenWord.hide)
                console.log("\n")
                console.log("now give me a letter")
                process.stdout.write("choose your letter: > ");

            } else if (letter === 'no') {
                console.log("\n")
                console.log('Try next time if you dare so :p');
                process.stdin.pause();

            } else if (letter.length > 1 && count < 6){
                console.log("\n")
                console.log('That\'s not my word unlucky...')
                count++
                if(count === 1){
                    console.log("You already try to guess once or used " + count + " letter : " + listeLetter)
                } else {
                    console.log("You already try to guess my word or some letters " + count + " times : " + listeLetter)
                }
                console.log(chosenWord.hide);
                console.log("\n")
                process.stdout.write("choose your letter: > ");

            } else if(tabLetter.includes(letter)){
                console.log("\n")
                console.log("You already use this letter... hopefully i'm watching out for you")
                if(count === 1){
                    console.log("You already try to guess once or used " + count + " letter : " + listeLetter)
                } else {
                    console.log("You already try to guess my word or some letters " + count + " times : " + listeLetter)
                }
                console.log(chosenWord.hide);
                console.log("\n")
                process.stdout.write("choose your letter (a different this time): > ");

            } else if(count < 6){
                console.log("\n")
                tabLetter.push(letter);
                var splitWord = chosenWord.word.split("")
                var letterExist = splitWord.includes(data.toString().trim())
                if(letterExist){
                    var splitWordHidden = chosenWord.hide.split("");
                    console.log("Congrats you found a letter");
                    for(var i = 0; i < splitWord.length; i++){
                        if (splitWord[i] == letter){
                            splitWordHidden[i] = letter;
                        }
                    }
                    chosenWord.hide = splitWordHidden.join('');
                    console.log(chosenWord.hide);
                } else{
                    console.log("That's not one of my letter...")
                    console.log(chosenWord.hide);
                }
                
                listeLetter = tabLetter.join()

                count++;
                if(count === 1){
                    console.log("You already try to guess once or used " + count + " letter : " + listeLetter)
                } else {
                    console.log("You already try to guess my word or some letters " + count + " times : " + listeLetter)
                }
                console.log("\n")
                process.stdout.write("choose your letter: > ");
                
            } else {
                console.log("You use more than 7 tries. And so you lost...")

                Loses = chosenWord.nbLose + 1;
                await pendu.updateOne(query, {$set: {nbLose: Loses }})
                chosenWord = await pendu.findOne(query, proj)
                console.log("For the word " + chosenWord.word + " you won " + chosenWord.nbWin + " times and lost " + chosenWord.nbLose + " times.")

                console.log("So do you admit i'm invicible? Ahahah! Do you still want to face me?")
                console.log("\n")
                process.stdout.write("yes/no? > ");
                count = 0;
                tabLetter = [];

                //init un autre mot
                index = randomNumber(listWordsLength);
                query = {"index": index};
                chosenWord = await pendu.findOne(query, proj)
            }
            } catch (e) {
              await client.close();
              process.stdin.pause();
              console.log(e.message);
              
            }
          });

    } catch(e){
        console.log("pb de connexion", e.message);
        await client.close();
    } finally {

    }
    

}

console.log("Welcome in the best Hangman game ever done (not sure about it, not gonna lie). \n I'll choose my number and you'll have to guess it. Pretty simple, nah? \n ready to start?")
process.stdout.write("yes/no? > ");

game().catch(console.dir)
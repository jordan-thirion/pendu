const process = require('process');
const client = require("./src/connect");
const { ExceptionConsole } = require("./src/utils");
process.stdin.setEncoding('utf8');

//récupérer la valeur de listWordLength pour faire un random number et récuperer le mot de cette index en tant que mot à trouver (done)
//demander à l'user si il veut jouer (done)
//gérer l'entré d'un caractere par le user (done)
//gérer la comparaison avec avec le mot plein (done)
//gérer si il y a plusieurs fois la lettre (done)
//gérer l'affichage du mot hidden (done)
//afficher les lettres déja trouvé et deja utilisé
//update les lettres du mot hidden (done)
//gérer le compteur
//réussite ou échec

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
        const proj = {_id: 0, word:1, hide:1};

        const listWordsLength = await pendu.find({}).count()

        const index = randomNumber(listWordsLength);

        const query = {"index": index};

        const chosenWord = await pendu.findOne(query, proj)

        //entré dans le jeu
        process.stdin.on("data", async (data) => {
            try {
              const letter = data.toString().trim();
              if (data.toString().trim() === 'yes') {
                console.log("So you dare to challenge me? all right!")

                console.log("My word is... as i would tell you. Instead i'll give you some letters : ")
                console.log(chosenWord.hide)
                console.log("now give me a letter")
                process.stdout.write("choose your letter: > ");

            } else if (data.toString().trim() === 'no') {
                console.log('Try next time if you dare so :p');
                process.stdin.pause();
            } else if (data.toString().trim().length > 1){
                console.log('Only give one letter please, you cheater')
                process.stdout.write("choose your letter: > ");
            } else {
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
                }

                process.stdout.write("choose your letter: > ");
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
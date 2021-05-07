const process = require('process');
const client = require("./src/connect");
const { ExceptionConsole } = require("./src/utils");
process.stdin.setEncoding('utf8');

//récupérer la valeur de listWordLength pour faire un random number et récuperer le mot de cette index en tant que mot à trouver (done)
//demander à l'user si il veut jouer (done)
//gérer l'entré d'un caractere par le user
//gérer la comparaison avec avec le mot plein
//gérer l'affichage du mot hidden
//afficher les lettres déja trouvé et deja utilisé
//update les lettres du mot hidden
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
              const type = data.toString().trim();
              if (data.toString().trim() === 'y') {
                console.log("So you dare to challenge me? all right!")
                //console.log(chosenWord)

            } else if (data.toString().trim() === 'n') {
                console.log('tente ta chance la prochaine fois alors');
                process.stdin.pause();
            } else {
                console.log('You have to say \'y\' or \'n\' for my little processor to understand \n so do you wanna play?')
                process.stdout.write("y/n? > ");
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
process.stdout.write("y/n? > ");

game().catch(console.dir)
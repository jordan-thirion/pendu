const process = require('process');
const client = require("./src/connect");
const { ExceptionConsole } = require("./src/utils");
process.stdin.setEncoding('utf8');

//récupérer la valeur de listWordLength pour faire un random number et récuperer le mot de cette index en tant que mot à trouver (done)
//gérer l'entré d'un caractere par le user
//gérer la comparaison avec avec le mot plein
//gérer l'affichage du mot hidden
//afficher les lettres déja trouvé et deja utilisé
//update les lettres du mot hidden
//gérer le compteur
//réussite ou échec

async function game () {
    try{
        await client.connect();

        const database = client.db("pendu");
        const pendu = database.collection("pendu");
        const proj = {_id: 0, word:1, hide:1};

        const listWordsLength = await pendu.find({}).count()

        const randomNumber = (max) =>{
            return Math.floor(
                Math.random() * (max) + 1
          )
        }

        const index = randomNumber(listWordsLength);

        const query = {"index": index};

        const chosenWord = await pendu.findOne(query, proj)

        console.log(chosenWord)

    } catch(e){
        console.log("pb de connexion", e.message);
        await client.close();
    } finally {

    }
    

}

game().catch(console.dir)
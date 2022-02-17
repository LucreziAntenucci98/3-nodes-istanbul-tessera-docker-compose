var path = "C:/Windows/System32/network/node_modules/";

const chalk = require(path+"chalk");
const boxen = require(path+"boxen");
const clear = require(path+"clear");
const figlet = require(path+"figlet");
const inquirer = require(path+"inquirer");


clear(); //pulisce la schermata 
console.log(
    chalk.green( //chalk è una cosa che mi fa scrivere un titolo in verde 
        figlet.textSync('Eco-Chain', { horizontalLayout: 'full' })
    )
   
);
//creazione del box e del messaggio iniziale
const greeting = chalk.white.bold("Benvenuto, in ogni momento puoi premere il tasto CTRL+C per uscire dal programma!");
const boxenOptions = {
 borderStyle: "double",
 backgroundColor: "black"
};

const msgBox = boxen( greeting, boxenOptions );
console.log(msgBox);
console.log();
console.log();








var operazione = () => {
    const lista_operazioni = {
        type: 'rawlist',
        name: "attivita",
        message: "Seleziona l'operazione da eseguire: ",
        pageSize: 12, //mette ordine
        choices: [new inquirer.Separator("-----Transazioni-----"), "Inserimento attore", "Inserimento materia prima",
            "Inserimento prodotto", "Trasferimento materia prima", new inquirer.Separator("-----Estrazione dati-----"),
            "Possessore a partire dal token", "Informazioni a partire dal token", "Informazioni a partire dal lotto",
            "Informazioni a partire dal nome"],
        default: "Inserimento attore"
    }
    return inquirer.prompt(lista_operazioni);
};









var valori = () => {
    const questions = [
        {
            name: 'nome',
            type: 'input',
            message: 'Nome materia prima: ',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'inserire il nome';
                }
            }
        },
        {
            name: 'CO2',
            type: 'number',
            message: 'Valore CO2: ',
            validate: function (value) {
                if (value > 0 && value <= 100) {
                    return true;
                } else {
                    return 'Inserire un valore di CO2 compreso tra 0 e 100';
                }
            }
        }
    ]
    return inquirer.prompt(questions)
};





//funzione di loop che serve per far si che quando inserisci per la prima volta l'operazione restituisce la lista valore ecc
// fa continuare o uscire dal sistema.
function loop() {
    operazione().then(() => {
        valori().then(() => {
            const lista_operazioni =
            {
                name: 'continua',
                type: 'input',
                message: "Vuoi continuare a svolgere operazioni? (Y/N): ",
                validate: function (value) {
                    if (value == "Y" || value == "y" || value == "N" || value == "n") {
                        return true;
                    } else {
                        return 'Valori ammessi: Y/N';
                    }
                }
            }
            return inquirer.prompt(lista_operazioni);
        }).then((value) => {          
            if (value.continua == "Y" || value.continua == "y") {
                console.log("--------------------");
                console.log("--------------------");                
                /*console.log("--------------------");
                console.log("--------------------");
                console.log("--------------------");
                console.log("--------------------");*/
                loop();
            }
        })
    })
}
loop();
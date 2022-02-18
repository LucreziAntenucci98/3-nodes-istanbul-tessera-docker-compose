const Estrazione = require("./Estrazione");
const Transazioni = require("./Transazioni");
var path = "C:/Windows/System32/network/node_modules/";
const chalk = require(path+"chalk");
const boxen = require(path+"boxen");
const clear = require(path+"clear");
const figlet = require(path+"figlet");
const inquirer = require(path+"inquirer");


        var estrazione = new Estrazione();
        var transazioni = new Transazioni();

clear(); //pulisce la schermata 
console.log(
    chalk.green( //chalk è una cosa che mi fa scrivere un titolo in verde 
        figlet.textSync('Green-Chain', { horizontalLayout: 'full' })
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
///////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////


estrazione.ottieniaccounts().then((values)=>{
   
var account = () => {
    const lista_operazioni = {
        type: 'rawlist',
        name: "account",
        message: "Seleziona l'account con cui proseguire: ",
        choices: [values[0] + " (amministratore)", values[1], values[2]],
        default: "Inserimento attore"
    }
    return inquirer.prompt(lista_operazioni);
};
account().then(()=>{operazione()});
})





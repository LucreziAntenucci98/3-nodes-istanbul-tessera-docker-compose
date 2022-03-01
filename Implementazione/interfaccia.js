const Call = require("./call");
const Send = require("./send");
const node_modules_path = require("./config").node_modules_path;
const chalk = require(node_modules_path + "chalk");
const boxen = require(node_modules_path + "boxen");
const clear = require(node_modules_path + "clear");
const figlet = require(node_modules_path + "figlet");
const form = require("./form")

/////////////////////////////

//Messaggio di benvenuto
function startInterface(){
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

const msgBox = boxen(greeting, boxenOptions);
console.log(msgBox);
console.log();
console.log();
}
// estraggo i privilegi dei vari attori
async function getPrivilegiAttori(attori) {
    var privilegi = [" (amministratore) ", " ", " "];
    for (var i = 0; i < 3; i++) {
        // "controllo ruolo" ritorna falso se l'attore ricopre quel ruolo, perciò se il suo negato
        // è vero allora l'attore ha quel privilegio.......................
        var prod = await estrazione.controlloRuolo(attori[i], "produttore");
        var tra = await estrazione.controlloRuolo(attori[i], "trasformatore");
        var cli = await estrazione.controlloRuolo(attori[i], "cliente");
        //restituisce falso se l'attore ricopre il ruolo..................
        if (prod) privilegi[i] += "(produttore) "
        if (tra) privilegi[i] += "(trasformatore) "
        if (cli) privilegi[i] += "(cliente) "
    }
    return privilegi;
}
//controllo i privilegi per l'account
function checkPrivilegi(ruolo,privilegi){
    var ruoli = privilegi.split(" ");
    for(var i=0;i<ruoli.length;i++)
        if(ruoli[i]=="("+ruolo+")")
        return true;
    return false;
}
//
function loop(privilegi,attori,transazioni,indirizzo_richiedente,nodo) {
    // funzione che chiederà all'utente se vuole continuare la sessione con l'account corrente o se vuole terminare il programma
    function continua(risposta) {
        if (risposta == "Y" || risposta == "y") {
            console.log("--------------------");
            console.log("--------------------");
            loop(privilegi,attori,transazioni,indirizzo_richiedente,nodo);
        }
    }

    // faccio selezionare all'utente una delle operazioni possibili
    form.form_operazione().then(async function (operazione) {
        console.log()
        console.log("Hai selezionato l'operazione: " + operazione['attivita'])
        console.log()

        // in base all'operazione scelta fornisco la form relativa ed attivo il metodo per portare a 
        // termine la transazione o la call 
        switch (operazione['attivita']) {

            case "Inserimento attore":
                privilegi = await getPrivilegiAttori(attori);
                if (!checkPrivilegi("amministratore",privilegi[nodo])){
                    console.log("Non sei autorizzato a svolgere l'operazione")
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                    break;
                }
                // fornisco la form in cui inserire account e tipologia, poi 
                // chiamo il metodo della classe transazioni per inserire l'attore
                form.form_inserimento_attore(attori, privilegi).then(async function (dati_attore) {
                    var attore = dati_attore['account'].substring(0, dati_attore['account'].indexOf(' '));
                    // al metodo passo l'indirizzo di chi ha chiesto la transazione, l'indirizzo 
                    // dell'attore ed il ruolo che deve ricoprire
                    await transazioni.aggiungiAttore(indirizzo_richiedente, attore, dati_attore['tipologia'])
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Inserimento materia prima":
                privilegi = await getPrivilegiAttori(attori);
                if (!checkPrivilegi("produttore",privilegi[nodo])){
                    console.log("Non sei autorizzato a svolgere l'operazione")
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                    break;
                }
                // fornisco la form in cui inserire i dati della materia prima 
                // e chiamo il relativo metodo della classe transazioni per avviare l'inserimento
                form.form_materia_prima().then(async function (dati_materia_prima) {
                    // al metodo passo l'indirizzo di chi ha chiesto la transazione, il lotto, il nome e 
                    // la CO2 della nuova materia prima 
                    await transazioni.aggiungiMateriaPrima(indirizzo_richiedente, dati_materia_prima['lotto'], dati_materia_prima['CO2'], dati_materia_prima['nome'])
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break
            
            case "Inserimento prodotto":
                privilegi = await getPrivilegiAttori(attori);
                if (!checkPrivilegi("trasformatore",privilegi[nodo])){
                    console.log("Non sei autorizzato a svolgere l'operazione")
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                    break;
                }
                // fornisco la form in cui nserire il numero di attivita e di materie prime utilizzate per 
                // produrre il nuovo prodotto
                form.form_numero_prodotto().then((dati_preliminari_prodotto) => {
                    // fornisco la form in cui inserire i dati del nuovo prodotto
                    // e chiamo il metodo della classe transazioni per avviare l'inserimento
                    form.form_prodotto(dati_preliminari_prodotto['numero_risorse'],
                        dati_preliminari_prodotto['numero_attivita']).then(async function (dati_prodotto) {
                            // avendo il numero di materie prime e di attivita, posso ottenere i valori inseriti
                            // nella form dall'utente
                            var materie_prime = [];
                            var consumo_attivita = [];
                            var nome_attivita = [];

                            for (var i = 0; i < dati_preliminari_prodotto['numero_attivita']; i++) {
                                nome_attivita = nome_attivita.concat(dati_prodotto["nome_attivita_" + i])
                                consumo_attivita = consumo_attivita.concat(dati_prodotto["CO2_attivita_numero_" + i])
                            }

                            for (var i = 0; i < dati_preliminari_prodotto['numero_risorse']; i++) {
                                materie_prime = materie_prime.concat(dati_prodotto["lotto_risorsa_" + i])
                            }

                            // al metodo passo l'indirizzo di chi ha chiesto la transazione, il lotto, il nome del 
                            // nuovo prodotto, piu i vettori che rappresentano attivita e materie prime
                            await transazioni.creaProdotto(
                                indirizzo_richiedente, nome_attivita, consumo_attivita, dati_prodotto['nome'],
                                materie_prime, dati_prodotto['lotto']
                            )
                            form.form_continua().then((value) => {
                                continua(value.continua)
                            })
                        })
                })
                break

            case "Trasferimento risorsa":
                privilegi = await getPrivilegiAttori(attori);
                if (!checkPrivilegi("produttore",privilegi[nodo]) && !checkPrivilegi("trasformatore",privilegi[nodo]) && !checkPrivilegi("cliente",privilegi[nodo])){
                    console.log("Non sei autorizzato a svolgere l'operazione")
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                    break;
                }
                // fornisco la form di inserimento dei dati per il trasferimento 
                // e chiamo il metodo della classe transazioni per avviare il trasferimento
                privilegi = await getPrivilegiAttori(attori);
                form.form_trasferimento(attori, privilegi).then(async function (dati_traferimento) {
                    var destinatario = dati_traferimento['account'].substring(0, dati_traferimento['account'].indexOf(' '));
                    await transazioni.trasferimentoRisorsa(indirizzo_richiedente, destinatario, dati_traferimento['lotto_trasferito']);
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Possessore a partire dal token":
                // fornisco la form di inserimento del token e chiamo il metodo della classe Estrazione per estrarre il possessore

                form.form_by_token().then(async function (token) {

                    // al metodo passo l'indirizzo di chi ha chiesto la transazione ed il token del 
                    // prodotto del quale vogliamo conoscere il possessore
                    await estrazione.getOwnerByToken(
                        indirizzo_richiedente, token['token']
                    )
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Informazioni a partire dal token":
                // fornisco la form di inserimento del token e chiamo il metodo della classe Estrazione per estrarre info

                form.form_by_token().then(async function (token) {

                    // al metodo passo l'indirizzo di chi ha chiesto la transazione ed il token del 
                    // prodotto del quale vogliamo conoscere il possessore
                    await estrazione.getInfoByToken(
                        indirizzo_richiedente, token['token']
                    )
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Informazioni a partire dal lotto":
                // fornisco la form di inserimento del lotto e chiamo il metodo della classe Estrazione per estrarre info 

                form.form_by_lotto().then(async function (token) {

                    // al metodo passo l'indirizzo di chi ha chiesto la transazione ed il lotto del 
                    // prodotto del quale vogliamo conoscere il possessore
                    await estrazione.getInfoByLotto(
                        indirizzo_richiedente, token['lotto']
                    )
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Informazioni a partire dal nome":
                // fornisco la form di inserimento del nome e chiamo il metodo della classe Estrazione per estrarre info


                form.form_by_nome().then(async function (token) {

                    // al metodo passo l'indirizzo di chi ha chiesto la transazione ed il nome del 
                    // prodotto del quale vogliamo conoscere il possessore
                    await estrazione.getInfoByNome(
                        indirizzo_richiedente, token['nome']
                    )
                    form.form_continua().then((value) => {
                        continua(value.continua)
                    })
                })
                break

            case "Logout":
                    esegui(attori);
                break;

            case "Esci dal programma":
                process.exit(1);
        }

    })
}
//corpo del programma
async function esegui(attori){
    var privilegi = await getPrivilegiAttori(attori);
    form.form_account(attori,privilegi).then((selezionato) => {
        // visto che le risposte nella form sono del tipo "account + privilegi attore"
        // è necessario selezionare solo la parte relativa all'account, cioè quella prima dello spazio
        var indirizzo_richiedente = selezionato['account'].substring(0, selezionato['account'].indexOf(' '));
        var nodo = 0;
        // scorro i nodi per capire con quale account è entrato l'utente e passo al costruttore 
        // di transaction il nodo a cui si riferisce quell'account
        for (var i = 0; i < 3; i++) {
            if (indirizzo_richiedente == attori[i])
                nodo = i;
        }

        var transazioni = new Send(nodo);
        console.log("Hai selezionato l'account con indirizzo: " + indirizzo_richiedente);
        var num =  nodo+1;
        console.log("Sei collegato al nodo: " + num);
        loop(privilegi,attori,transazioni,indirizzo_richiedente,nodo);
    })


}

////////////////////////

// inizializzo l'oggetto attraverso il quale interfacciarmi con la catena
var estrazione = new Call();
startInterface();
//esegue il programma estraendo i tre account collegati ai 3 nodi
estrazione.ottieniaccounts().then(async function (attori) {
    esegui(attori);
})
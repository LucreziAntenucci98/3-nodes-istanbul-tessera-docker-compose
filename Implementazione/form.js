const node_modules_path = require("./config").node_modules_path;
const inquirer = require(node_modules_path + "inquirer");


// funzione per la validazione dei nomi nelle form
const validatore_nome = function(value) {
    let reg = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (reg.test(value)) {
        return 'Sono ammesse lettere dalla A alla Z e numeri da 0 a 9';
    }
    if (value.length > 0 && value.length < 32) {
        return true;
    } else {
        return 'Inserire un nome con meno di 32 caratteri';
    }
}


// funzione per la validazione dei lotti e dei token
const validatore_lotto = function(value) {
    let reg = /^\d+$/;
    let numero = parseInt(value);
    // errore se l'input non è un numero, è < 1 o maggiore del limite massimo degli uint in solidity
    if (reg.test(value) && !isNaN(numero) && numero > 0 && numero < Math.pow(2, 256) - 1) {
        return true;
    } else {
        return 'Inserire un intero > 0 e minore di 2^256-1';
    }
}



const validatore_CO2 = function(value) {
    let reg = /^\d+$/;
    let numero = parseInt(value);
    // errore se l'input non è un numero, è < 1 o maggiore del limite massimo degli uint in solidity
    if (reg.test(value) && !isNaN(numero) && numero > 0 && numero < Math.pow(2, 32) - 1) {
        return true;
    } else {
        return 'Inserire un intero positivo a 32 bit';
    }
}

//////////////////////////// FORM TRANSAZIONI ////////////////////////////////


///// ATTORE /////

//form in cui scegliere un attore tra quelli disponibili ed un ruolo tra quelli assegnabili 
exports.form_inserimento_attore = function (address, privilegi) {

    const inserimento_attore = [
        {
            type: 'rawlist',
            name: "account",
            message: "Seleziona l'account a cui assegnare il ruolo: ",
            choices: [address[0] + privilegi[0], address[1] + privilegi[1], address[2] + privilegi[2]],
        },
        {
            type: 'rawlist',
            name: "tipologia",
            message: "Seleziona il ruolo: ",
            choices: ['produttore', 'trasformatore', 'cliente'],
        }
    ];
    return inquirer.prompt(inserimento_attore);
};






///// MATERIA PRIMA /////

// form in cui inserire, nome, valore CO2 e lotto di una nuova materia prima
exports.form_materia_prima = function () {
    const materia_prima = [
        {
            name: 'nome',
            type: 'input',
            message: 'Nome materia prima: ',
            validate: validatore_nome
        },

        {
            name: 'lotto',
            type: 'input',
            message: 'inserire lotto della materia prima: ',
            validate: validatore_lotto

        },


        {
            name: 'CO2',
            type: 'input',
            message: 'Valore CO2: ',
            validate: validatore_CO2
        }
    ];
    return inquirer.prompt(materia_prima);
};






///// PRODOTTO PRELIMINARE /////

// form preliminare all'inserimento dei prodotti; consente l'inserimento del numero di materie prime ed attivita' relative ad un prodotto
exports.form_numero_prodotto = function () {
    const numero_prodotto = [
        {
            name: 'numero_risorse',
            type: 'input',
            message: 'Numero di materie prime utilizzate per la produzione: ',
            validate: function (value) {
                let reg = /^\d+$/;
                let numero = parseInt(value);
                // errore se l'input non è un numero, è < 1 o > di 5
                if (reg.test(value) && !isNaN(numero) && numero > 0 && numero < 5) {
                    return true;
                } else {
                    return 'Inserire un numero di risorse compreso tra 0 e 5 (estremi esclusi)';
                }
            }
        },

        {
            name: 'numero_attivita',
            type: 'input',
            message: 'Numero di attivita svolte per portare a termine la produzione: ',
            validate: function (value) {
                let reg = /^\d+$/;
                let numero = parseInt(value);
                // errore se l'input non è un numero, è < 1 o > 5
                if (reg.test(value) && !isNaN(numero) && numero > 0 && numero < 5) {
                    return true;
                } else {
                    return 'Inserire un numero di attivita compreso tra 0 e 5 (estremi esclusi)';
                }
            }
        }
    ];
    return inquirer.prompt(numero_prodotto);
};





///// PRODOTTO /////

// form in cui inserire il nome e il lotto del nuovo prodotto, 
//i lotti delle materie prime utilizzate, le attivita' svolte durante 
//la trasformazione del prodotto ed il loro consumo
exports.form_prodotto = function (numero_risorse, numero_attivita) {

    let input_prodotto = [
        {
            name: 'nome',
            type: 'input',
            message: 'Nome nuovo prodotto: ',
            validate: validatore_nome
        },

        {
            name: 'lotto',
            type: 'input',
            message: 'inserire lotto del nuovo prodotto: ',
            validate: validatore_lotto
        }
    ];


    // per ogni attivita creo un input per il nome e per il consumo
    for (let i = 0; i < numero_attivita; i++) {

        let attivita = [{
            name: 'nome_attivita_' + i,
            type: 'input',
            message: 'Nome attivita numero_' + i + ": ",
            validate: validatore_nome
        },

        {
            name: 'CO2_attivita_numero_' + i,
            type: 'input',
            message: 'CO2 attivita numero_' + i + ": ",
            validate: validatore_CO2
        }];


        input_prodotto = input_prodotto.concat(attivita);
    }



    // per ogni risorsa creo un input in cui inserire il corrispondente lotto
    for (let i = 0; i < numero_risorse; i++) {

        risorse = {
            name: 'lotto_risorsa_' + i,
            type: 'input',
            message: 'Lotto materia prima numero_' + i + ": ",
            validate: validatore_lotto
        };
        input_prodotto = input_prodotto.concat(risorse);
    }

    return inquirer.prompt(input_prodotto);
};



///// TRASFERIMENTO /////

// form in cui inserire la risorsa da trasferire e l'account del ricevitore;
exports.form_trasferimento = function (address, privilegi) {
    const trasferisci = [
        {
            type: 'rawlist',
            name: "account",
            message: "Seleziona l'account a cui trasferire la materia prima: ",
            choices: [address[0] + privilegi[0], address[1] + privilegi[1], address[2] + privilegi[2]],
        },
        {
            type: 'input',
            name: "lotto_trasferito",
            message: "Inserire il lotto della materia prima da trasferire: ",
            validate: validatore_lotto}
    ];
    return inquirer.prompt(trasferisci);
};


//////////////////////////// FORM ESTRAZIONE ////////////////////////////////


///// BY TOKEN /////

// form in cui inserire il token relativo ad una risorsa
exports.form_by_token = function () {
    const by_token =
    {
        name: 'token',
        type: 'input',
        message: 'inserire token del prodotto/materia prima: ',
        validate: validatore_lotto
    };
    return inquirer.prompt(by_token);
};






///// BY LOTTO /////

// form in cui inserire il lotto relativo ad una risorsa

exports.form_by_lotto = function () {
    const by_lotto =  //tutte le estrazione delle informazioni a partire dal lotto del proddotto
    {
        name: 'lotto',
        type: 'input',
        message: 'inserire lotto del prodotto/materia prima: ',
        validate: validatore_lotto

    };
    return inquirer.prompt(by_lotto);
};






///// BY NOME /////

// form in cui inserire il nome di una risorsa
exports.form_by_nome = function () {
    const by_nome =
    {
        name: 'nome',
        type: 'input',
        message: 'Nome materia prima/prodotto: ',
        validate: validatore_nome
    };
    return inquirer.prompt(by_nome);
};






//////////////////////////// FORM GENERICHE ////////////////////////////////


///// OPERAZIONI /////

//form che consente di scegliere l'operazione da effettuare
exports.form_operazione = function () {
    const lista_operazioni = {
        type: 'rawlist',
        name: "attivita",
        message: "Seleziona l'operazione da eseguire: ",
        pageSize: 14, //mette ordine
        choices: [new inquirer.Separator("-----Transazioni-----"), "Inserimento attore", "Inserimento materia prima",
            "Inserimento prodotto", "Trasferimento risorsa", new inquirer.Separator("-----Estrazione dati-----"),
            "Possessore a partire dal token", "Informazioni a partire dal token", "Informazioni a partire dal lotto",
            "Informazioni a partire dal nome", new inquirer.Separator("-----Altro-----"), "Logout", "Esci dal programma"],
        default: "Inserimento attore"
    };
    return inquirer.prompt(lista_operazioni);
};






///// ACCOUNT /////

// form che consente la scelta di un account con cui autenticarsi
exports.form_account = function (address, privilegi) {
    const account = {
        type: 'rawlist',
        name: "account",
        message: "Seleziona l'account con cui proseguire: ",
        choices: [address[0] + privilegi[0], address[1] + privilegi[1], address[2] + privilegi[2]],
    };
    return inquirer.prompt(account);
};






///// CONTINUA /////

// form in cui inserire {Y} o {N} scegliendo 
//se continuare ad eseguire operazioni con l'account corrente 
//o in alternativa terminare il programma.
exports.form_continua = function () {
    const continua =
    {
        name: 'continua',
        type: 'input',
        message: "Vuoi continuare a svolgere operazioni? (Y/N): ",
        validate: function (value) {
            if (value === "Y" || value === "y" || value === "N" || value === "n") {
                return true;
            } else {
                return 'Valori ammessi: Y/N';
            }
        }
    };
    return inquirer.prompt(continua);
};


exports.validatore_CO2 = validatore_CO2;
exports.validatore_lotto = validatore_lotto;
exports.validatore_nome = validatore_nome;
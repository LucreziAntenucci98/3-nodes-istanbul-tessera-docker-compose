var path = "C:/Windows/System32/node_modules/";
const inquirer = require(path+"inquirer");



// form in cui inserire il token di una materia prima/prodotto
exports.form_by_token = function() {
    const by_token =  
    {
        name: 'token',
        type: 'input',
        message: 'inserire token del prodotto/materia prima: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire token del prodotto/materia prima';
            }
        }
    }
    return inquirer.prompt(by_token);
};


// form in cui inserire il lotto del prodotto/materia prima
exports.form_by_lotto = function() {
    const by_lotto =  //tutte le estrazione delle informazioni a partire dal lotto del proddotto
    {
        name: 'lotto',
        type: 'number',
        message: 'inserire lotto del prodotto/materia prima: ',
        validate: function (value) {
            if (value>0) {
                return true;
            } else {
                return 'inserire un lotto valido del prodotto/materia prima';
            }
        }
        
    }
    return inquirer.prompt(by_lotto);
};






// form in cui inserire, nome, valore CO2 e lotto di una nuova materia prima
    exports.form_materia_prima = function() {
        const materia_prima = [
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
                name: 'lotto',
                type: 'number',
                message: 'Lotto materia prima: ',
                validate: function (value) {
                    if (value>0) {
                        return true;
                    } else {
                        return 'inserire un lotto valido';
                    }
                }
            },


            {
                name: 'CO2',
                type: 'number',
                message: 'Valore CO2: ',
                validate: function (value) {
                    if (value > 0 && value < 100) {
                        return true;
                    } else {
                        return 'Inserire un valore di CO2 compreso tra 0 e 100 (estremi esclusi)';
                    }
                }
            }
        ]
        return inquirer.prompt(materia_prima)
    };



    // form in cui inserire il nome della materia prima/prodotto
    exports.form_by_nome = function() {
        const by_nome =  
    {
        name: 'nome',
        type: 'input',
        message: 'inserire nome del prodotto/materia prima: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire nome del prodotto/materia prima';
            }
        }
    }
        return inquirer.prompt(by_nome);
    };




//form in cui scegliere quale attore selezionare e quale ruolo assegnargli 
exports.form_inserimento_attore = function(address1, address2, address3, privilegi) {
    const inserimento_attore = [
        {
            type: 'rawlist',
            name: "account",
            message: "Seleziona l'account a cui assegnare il ruolo: ",
            choices: [address1 + privilegi[0], address2 + privilegi[1], address3 + privilegi[2]],
            default: "Inserimento attore"
        },
        {
            type: 'rawlist',
            name: "tipologia",
            message: "Seleziona il ruolo: ",
            choices: ['produttore','trasformatore','cliente'],
            default: "Inserimento attore"
        }
    ]
    return inquirer.prompt(inserimento_attore)
};


// form in cui scegliere quale operazione si vuole portare a termine
exports.form_operazione = function() {
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



// form in cui scegliere con quale account "autenticarsi"
exports.form_account = function(address1, address2, address3, privilegi) {
    const account = {
        type: 'rawlist',
        name: "account",
        message: "Seleziona l'account con cui proseguire: ",
        choices: [address1 + privilegi[0], address2 + privilegi[1], address3 + privilegi[2]],
        default: "Inserimento attore"
    }
    return inquirer.prompt(account);
};



//form in cui scegliere se continuare a fare operazioni con l'account corrente o se uscire dalla sessione
exports.form_continua = function() {
    const continua =
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
    return inquirer.prompt(continua);
}




// form preliminare per l'inserimento dei prodotti in cui scegliere quanti materie prime ed attività inserire
exports.form_numero_prodotto = function() {
    const numero_prodotto = [
        {
            name: 'numero_risorse',
            type: 'number',
            message: 'Numero di materie prime utilizzate per la produzione: ',
            validate: function (value) {
                if (value<5) {
                    return true;
                } else {
                    return 'Inserire un numero di risorse compreso tra 0 e 5 (estremi esclusi)';
                }
            }
        },

        {
            name: 'numero_attivita',
            type: 'number',
            message: 'Numero di attivita svolte per portare a termine la produzione: ',
            validate: function (value) {
                if (value<5) {
                    return true;
                } else {
                    return 'Inserire un numero di attivita compreso tra 0 e 5 (estremi esclusi)';
                }
            }
        }
    ]
    return inquirer.prompt(numero_prodotto)
};




// form in cui inserire i lotti delle materie prime utilizzate, le attivita svolte ed il loro consumo,
// il nome del nuovo prodotto ed il lotto del nuovo prodotto
exports.form_prodotto = function(numero_risorse, numero_attivita) {

    var input_prodotto = [
        {
            name: 'nome',
            type: 'input',
            message: 'Nome nuovo prodotto: ',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Inserire il nome';
                }
            }
        },

        {
            name: 'lotto',
            type: 'number',
            message: 'Lotto nuovo prodotto: ',
            validate: function (value) {
                if (value>0) {
                    return true;
                } else {
                    return 'Inserire un lotto valido';
                }
            }
        }
    ]


    // per ogni attivita creo un input per il nome ed un number per il consumo
    for(var i=0;i<numero_attivita;i++) {

        var attivita = [{
            name: 'nome_attivita_' + i,
            type: 'input',
            message: 'Nome attivita numero_' + i + ": ",
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Inserire il nome';
                }
            }
        },

        {
            name: 'CO2_attivita_numero_' + i,
            type: 'number',
            message: 'CO2 attivita numero_' + i + ": ",
            validate: function (value) {
                if (value>0 && value<100) {
                    return true;
                } else {
                    return 'inserire un valore di CO2 compreso tra 0 e 100 (estremi esclusi)';
                }
            }
        }];

        
        input_prodotto = input_prodotto.concat(attivita)
    }



    // per ogni risosa creo un input in cui inserire il corrispondente lotto
    for(var i=0;i<numero_risorse;i++) {

        risorse = {
            name: 'lotto_risorsa_' + i,
            type: 'input',
            message: 'Lotto materia prima numero_' + i + ": ",
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Inserire un lotto ammissibile';
                }
            }
        }
        input_prodotto = input_prodotto.concat(risorse)
    }


    
    return inquirer.prompt(input_prodotto)
};
var tokenform = () => {
    const bytoken =  //tutte le estrazione dei dati con token prodotto getinfo by token e ownerby token
    {
        name: 'token',
        type: 'input',
        message: 'inserire token del prodotto: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire token del prodotto';
            }
        }
    }
    return inquirer.prompt(bytoken);
};




    const bylotto =  //tutte le estrazione delle informazioni a partire dal lotto del proddotto
    {
        name: 'lotto',
        type: 'input',
        message: 'inserire lotto del prodotto: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire lotto del prodotto';
            }
        }
        
    }





//inserimento materia prima
    var materiaprima = () => {
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
                name: 'lotto',
                type: 'input',
                message: 'Lotto materia prima: ',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'inserire il lotto';
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


    const bynome =  //tutte le estrazione delle info in base al nome
    {
        name: 'nome',
        type: 'input',
        message: 'inserire nome del prodotto: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire nome del prodotto';
            }
        }
    }

//inserimento attore
var attore = () => {
    const lista_operazioni = [{
        type: 'rawlist',
        name: "account",
        message: "Seleziona l'account con cui proseguire: ",
        choices: [values[0] + " (amministratore)", values[1], values[2]],
        default: "Inserimento attore"
    },
    {
        type: 'rawlist',
        name: "tipologia",
        message: "Seleziona il ruolo: ",
        choices: ['produttore','trasformatore','cliente'],
        default: "Inserimento attore"
    }]
}
module.exports=tokenform

/*module.exports= bylotto
module.exports= bynome
module.exports=bytoken
module.exports=attore
module.exports=materiaprima*/


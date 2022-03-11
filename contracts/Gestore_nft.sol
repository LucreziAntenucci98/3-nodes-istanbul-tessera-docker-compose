// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;
//pragma experimental SMTChecker;

import "./CarbonFootprint.sol";
import "./Generica.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract Gestore_nft is Ownable {






    // mapping attraverso i quali posso ricavare i produttori, trasformatori e clienti
    mapping(uint256=>address) private produttori;
    mapping(uint256=>address) private trasformatori;
    mapping(uint256=>address) private clienti;
    uint256 private numero_produttori = 0;
    uint256 private numero_trasformatori = 0;
    uint256 private numero_clienti = 0;


    // creo l'oggetto che rappresenta il token non fungibile
    CarbonFootprint private carbonFootprint = new CarbonFootprint();

    //funzione con cui il creatore dello smartContract può aggiungere un nuovo produttore, trasformatore o cliente
    function aggiungiAttore(
        string memory _tipo, address _indirizzo_account
    ) external onlyOwner {

        // errore se il ruolo inserito è diverso dai 3 disponibili
        require(
            (Generica.stringCompare(_tipo, "produttore")) || 
            (Generica.stringCompare(_tipo, "trasformatore")) || 
            (Generica.stringCompare(_tipo, "cliente")),
            "I ruoli disponibili sono: _produttore_ _trasformatore_ e _cliente_"
            );


        // errore se l'account inserito compare già nel mapping relativo al ruolo richiesto
        require(
            !esistente(_tipo, _indirizzo_account),
            "Account gia' presente con questo ruolo"
            );

        // in base al ruolo passato, l'account viene inserito nel corrispondente mapping
        if (Generica.stringCompare(_tipo, "produttore")) {
            produttori[numero_produttori] = _indirizzo_account;
            unchecked 
            {
                numero_produttori++;
                require(numero_produttori>0,"Raggiunto il numero massimo di produttori");
            }
        } else if (Generica.stringCompare(_tipo, "trasformatore")) {
            trasformatori[numero_trasformatori] = _indirizzo_account;
            unchecked
            {
                numero_trasformatori++;
                require(numero_trasformatori>0,"Raggiunto il numero massimo di trasformatori");
            }
            numero_trasformatori++;
        } else if (Generica.stringCompare(_tipo, "cliente")) {
            clienti[numero_clienti] = _indirizzo_account;
            unchecked
            {
                numero_clienti++;
                require(numero_clienti>0,"Raggiunto il numero massimo di clienti");
            }
        }
    }

    //crea una materia prima a partire da noe, valore di CO2 e lotto
    function creaMateriaPrima(
        uint256 _lotto, uint32 _valore_CO2, string memory _nome
    ) external {

        // errore se il richiedente non è un produttore
        require(esistente("produttore", msg.sender), "Solo i produttori possono aggiungere materie prime");
        // errore se il lotto inserito è 0
        require(_lotto != 0, "Id lotto non valido");
        // errore se il lotto inserito è già presente nel catalogo
        require(carbonFootprint.getRisorsaByLotto(_lotto).exists==false, "Id lotto gia' presente");
        // creo 3 array vuoti, perché al "crea prodotto" devono essere passati anche le riorse usate per produrre la risorsa
        // le attività svolte ed il loro consumo, ma poiché stiamo inserendo una materia prima, tali valori sono nulli
        uint256[] memory vettore_risorse;
        string[] memory nomi_attivita;
        uint32[] memory consumi_attivita;

        // creo effettivamente la materia prima
        carbonFootprint.creaProdotto(_lotto, _valore_CO2, nomi_attivita, consumi_attivita, "materia prima", msg.sender, vettore_risorse, _nome);

    }

    // consente di trasferire una materia prima ad un altro attore
    function trasferimentoRisorsa(
        address _destinatario, uint256 _lotto
        ) external {
        
        // errore se il destinatario è colui che richiede la transazione
        require(_destinatario != msg.sender, "Il destinatario ed il richiedente non possono coincidere");

        CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByLotto(_lotto);

        // errore se la risorsa non esiste nel catalogo o se è stata utilizzata 
        require(risorsa.exists == true && !Generica.stringCompare(string(risorsa.tipologia), "utilizzata"), "Il lotto inserito non corrisponde ad una risorsa del catalogo");
        // errore se il richiedente non possiede la risorsa
        require(getOwnerByToken(risorsa.token) == msg.sender, "Non sei in possesso della risorsa");  
        // errore se il destinatario non è un cliente, trasformatore o produttore
        require(esistente(_destinatario), "Il destinatario deve essere un produttore, trasformatore o cliente");
        carbonFootprint.transferFrom(msg.sender, _destinatario, risorsa.token);
    }

    // crea un nuovo prodotto a partire da un vettore di lotti di materie prime, un vettore di nomi di attività svolte
    // un vettore di consumi delle attività svolte, un nome ed un lotto
    function creaProdotto(
        string[] memory _nomi_attivita, uint32[] memory _valori_CO2_attivita, string memory _nome, uint256[] memory _lotti_materie_prime, uint256 _lotto_nuovo_prodotto
    ) external {

        // errore se i vettori non rispettano le dimensioni richieste
        require(_nomi_attivita.length < 5 && _valori_CO2_attivita.length < 5 && _lotti_materie_prime.length < 5 && _nomi_attivita.length == _valori_CO2_attivita.length, "Errore nell'inserimento del numero di materie prime o di attivita'");
        // errore se il lotto del prodotto da creare esiste già 
        require(carbonFootprint.getRisorsaByLotto(_lotto_nuovo_prodotto).exists == false, "Il lotto inserito e' gia' presente");
        // errore se il richiedente non è un trasformatore
        require(esistente("trasformatore", msg.sender), "Solo i trasformatori possono aggiungere un prodotto trasformato");
        // inizializzo la CO2 totale a 0, poi ci sommerò quella delle attività svolte e quella delle materie prime utilizzate
        uint32 CO2_totale = 0; 

        // per ogni materia prima controllo se è valida ed utilizzabile, poi sommo i corrispondenti contributi in CO2
        for (uint i=0; i < _lotti_materie_prime.length; i++) {

            // estraggo la risorsa dal catalogo conoscendone il lotto
            CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByLotto(_lotti_materie_prime[i]);
       
       
            // trasformo l'uint256 in una stringa in modo da concatenarla nell'errore
            string memory stringa_lotto = Generica.toString(_lotti_materie_prime[i]);
            // errore se la materia prima non esiste
            require(risorsa.exists == true, Generica.concatenate("Nel catalogo non e' presente alcuna materia prima con lotto pari a ", stringa_lotto));

            // errore se il lotto è 0 
            require(_lotti_materie_prime[i] != 0, "Il lotto 0 non e' valido");
            // errore se il richiedente non possiede la risorsa
            require(getOwnerByToken(risorsa.token) == msg.sender, Generica.concatenate("Non sei in possesso della materia prima con lotto", stringa_lotto));
            // errore se la risorsa non è una materia prima
            require(Generica.stringCompare(string(risorsa.tipologia), "materia prima"), Generica.concatenate(Generica.concatenate("L'elemento con lotto pari a ", stringa_lotto), " non e' una materia prima"));

            // settiamo il valore "tipologia" della risorsa a "utilizzata" in modo che non possa essere usata per 
            // produrre nuovi prodotti
            carbonFootprint.setTipologiaUtilizzato(_lotti_materie_prime[i]);

            // sommo alla CO2 totale quella della materia prima corrente
            unchecked 
            {
                CO2_totale += risorsa.valore_CO2;
                require(CO2_totale >= risorsa.valore_CO2, "Si e' verificato un errore di overflow");
            }
            
        }
        

        // per ogni attività sommo i consumi di CO2 al valore di CO2 totale
        for (uint i=0; i < _valori_CO2_attivita.length; i++) {  

            // sommo i contributi delle singole attivita
            unchecked 
            {
                CO2_totale += _valori_CO2_attivita[i];
                require(CO2_totale >= _valori_CO2_attivita[i], "Si e' verificato un errore di overflow");
            }
        }
            
        // creo il prodotto passando id del lotto, CO2 totale, vettore con i nomi delle attività svolte, vettore con i 
        // consumi delle attività svolte, tipologia (prodotto trasformato), possessore (chi ha mandato il messaggio),
        // lotti di materie prime utilizzate e nome
        carbonFootprint.creaProdotto(_lotto_nuovo_prodotto, CO2_totale, _nomi_attivita, _valori_CO2_attivita, "prodotto trasformato", msg.sender, _lotti_materie_prime, _nome);

    }
    
    // funzione che riceve un token e restituisce l'indirizzo del possessore
    function getOwnerByToken(uint256 _token) public view returns(address) {

    // errore se il token è 0
    require(_token != 0, "Il token inserito non e' valido"); 
    
    // errore se il token inserito è maggiore di quello corrente
    require(_token <= carbonFootprint.currentToken(), "Prodotto/materia prima non esistente"); 
    
    return carbonFootprint.ownerOf(_token);
    }





    // funzione che riceve un token e restituisce le informazioni relative alla risorsa con quel token
    function getInfoByToken(uint256 _token)
        public view returns(string memory, uint256, string[] memory, uint32[] memory, uint32, string memory, uint256[] memory, uint256) {

        // errore se il token passato è 0 o è maggiore del token corrente 
        require(_token != 0 && _token <= carbonFootprint.currentToken(), "Il token inserito non e' valido");
        
        // estraggo dal catalogo la risorsa con token pari a quello passato
        CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByIdProdotto(_token);
        
        return(risorsa.nome, risorsa.lotto, risorsa.nomi_attivita, risorsa.valori_CO2_attivita, risorsa.valore_CO2, risorsa.tipologia, risorsa.lotti_materie_prime, risorsa.token);
    }

    // funzione che riceve un lotto e restituisce le informazioni relative alla risorsa con quel lotto
    function getInfoByLotto(uint256 _lotto)
        public view returns(string memory, uint256, string[] memory, uint32[] memory, uint32, string memory, uint256[] memory, uint256) {

        CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByLotto(_lotto);
        
        // errore se il lotto appartiene ad una risorsa che non esiste
        require(_lotto !=0 && risorsa.exists != false, "Il lotto inserito non e' valido");
        
        return(risorsa.nome, risorsa.lotto, risorsa.nomi_attivita, risorsa.valori_CO2_attivita, risorsa.valore_CO2, risorsa.tipologia, risorsa.lotti_materie_prime, risorsa.token);
    }



    // funzione che riceve un nome e restituisce una lista di informazioni relative alle risorse con quel nome
    function getInfoByNome(string memory _nome)
        public view returns(string memory) {
        
        uint256 trovati=0;
        string memory results;
        // scorro tutto il catalogo alla ricerca di risorse con il nome passato
        for (uint256 i=1; i <= carbonFootprint.currentToken(); i++) {
            CarbonFootprint.Risorsa memory risorsa_i = carbonFootprint.getRisorsaByIdProdotto(i);
            if(Generica.stringCompare(risorsa_i.nome, _nome)) {
                results = Generica.concatenate(results, risorsa_i.nome);
                results = Generica.concatenate(results, ",");
                results = Generica.concatenate(results, Generica.toString(risorsa_i.lotto));
                results = Generica.concatenate(results, ",");
                results = Generica.concatenate(results, Generica.toString(risorsa_i.valore_CO2));
                results = Generica.concatenate(results, ",");
                results = Generica.concatenate(results, Generica.toString(risorsa_i.token));
                results = Generica.concatenate(results, ",");
                results = Generica.concatenate(results, risorsa_i.tipologia);
                results = Generica.concatenate(results, ",");
                for(uint j; j < risorsa_i.nomi_attivita.length;j++) {
                    results = Generica.concatenate(results, risorsa_i.nomi_attivita[j]);
                    results = Generica.concatenate(results, " | ");
                }
                results = Generica.concatenate(results, ",");
                for(uint j; j < risorsa_i.valori_CO2_attivita.length;j++) {
                    results = Generica.concatenate(results, Generica.toString(risorsa_i.valori_CO2_attivita[j]));
                    results = Generica.concatenate(results, " | ");
                }
                results = Generica.concatenate(results, ",");
                for(uint j; j < risorsa_i.lotti_materie_prime.length;j++) {
                    results = Generica.concatenate(results, Generica.toString(risorsa_i.lotti_materie_prime[j]));
                    results = Generica.concatenate(results, " | ");
                }
                results = Generica.concatenate(results, ";");
                trovati++;
            }
        }

        // errore se nessun prodotto ha il nome passato
        require(trovati != 0, "Non e' stato trovato alcun prodotto/materia prima con il nome inserito");

        return results;
    }  


    //funzione che restituisce vero se l'account ricopre già il ruolo passato in input
    function esistente(string memory _ruolo, address _indirizzo_account)
        public view returns(bool) {

        if(Generica.stringCompare(_ruolo, "produttore")) { // se il tipo passato è produttore allora cerco sul mapping dei produttori
            for (uint i; i < numero_produttori; i++) {
                if(_indirizzo_account == produttori[i]) return true;
            }
        } else if(Generica.stringCompare(_ruolo, "trasformatore")) { // se il tipo passato è trasformatore allora cerco sul mapping dei trasformatore
            for (uint i; i < numero_trasformatori; i++) {
                if(_indirizzo_account == trasformatori[i]) return true;
            }
        } else if (Generica.stringCompare(_ruolo, "cliente")) { // se il tipo passato è cliente allora cerco sul mapping dei clienti
            for (uint i; i < numero_clienti; i++) {
                if(_indirizzo_account == clienti[i]) return true;
            }
        }
        return false;
    }




    // funzione che scorre tutti e tre i mapping degli attori per controllare se l'account appartiene ad un 
    // produttore, trasformatore o destinatario
    function esistente(address _indirizzo_account)
        private view returns(bool) {

        for (uint i; i < numero_produttori; i++) {
            if(_indirizzo_account == produttori[i]) return true;
        }

        for (uint i; i < numero_trasformatori; i++) {
            if(_indirizzo_account == trasformatori[i]) return true;
        }
        

        for (uint i; i < numero_clienti; i++) {
            if(_indirizzo_account == clienti[i]) return true;
        }

        return false;
    }

}
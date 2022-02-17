// SPDX-License-Identifier: MIT

pragma solidity>=0.5.16;

import "./CarbonFootprint.sol";
import "./Generica.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Gestore_nft is Ownable {

    uint8 constant ATTIVITA_MASSIME = 2;
    uint8 constant MATERIE_MASSIME = 2;



    mapping(uint256=>address) public produttori;
    mapping(uint256=>address) public trasformatori;
    mapping(uint256=>address) public clienti;
    uint256 numero_produttori = 0;
    uint256 numero_trasformatori = 0;
    uint256 numero_clienti = 0;


    CarbonFootprint carbonFootprint = new CarbonFootprint();


    //funzione con cui il creatore dello smartContract può aggiungere un nuovo produttore, trasformatore o cliente
    function aggiungiAttore(
        string memory _tipo, address _indirizzo_account
    ) external onlyOwner {

        require(
            (Generica.stringCompare(_tipo, "produttore")) || 
            (Generica.stringCompare(_tipo, "trasformatore")) || 
            (Generica.stringCompare(_tipo, "cliente")),
            "I ruoli disponibili sono: _produttore_ _trasformatore_ e _cliente_"
            );

        require(
            nonEsistente(_tipo, _indirizzo_account),
            "Account gi\xC3\xa0 presente con questo ruolo"
            );

        if(Generica.stringCompare(_tipo, "produttore")) {
            produttori[numero_produttori] = _indirizzo_account;
            numero_produttori++;
        }

        if(Generica.stringCompare(_tipo, "trasformatore")) {
            trasformatori[numero_trasformatori] = _indirizzo_account;
            numero_trasformatori++;
        }


        if(Generica.stringCompare(_tipo, "cliente")) {
            clienti[numero_clienti] = _indirizzo_account;
            numero_clienti++;
        }

    }





    //crea una materia prima
    function creaMateriaPrima(
        uint256 _id_lotto, uint32 _valore_CO2, string memory _nome
    ) external returns(uint256) {

        require(!nonEsistente("produttore", msg.sender), "Solo i produttori possono aggiungere materie prime");
        require(_id_lotto != 0, "Id lotto non valido");
        require(_valore_CO2>0 && _valore_CO2<100, "Valore di CO2 non valido");
        require(carbonFootprint.getRisorsaByLotto(_id_lotto).exists==false, "Id lotto gi\xC3\xa0 presente");
        uint256[MATERIE_MASSIME] memory vettore_risorse;
        uint256 _id_nuovo_prodotto = carbonFootprint.creaProdotto(_id_lotto, _valore_CO2, "materia prima", msg.sender, vettore_risorse, _nome);
        return _id_nuovo_prodotto;

    }


    // consente di trasferire una materia prima o prodotto ad un altro attore
    function trasferimentoMateriaPrima(
        address _destinatario, uint256 _tokenId, address _contract
        ) external returns(string memory){  
             
        require(!nonEsistente(_destinatario), "L'indirizzo deve appartenere ad un produttore, trasformatre o cliente");
        carbonFootprint.approve(_contract, _tokenId);
        carbonFootprint.safeTransferFrom(msg.sender, _destinatario, _tokenId);
        return "trasferimento avvenuto con successo";

    }


    // crea un nuovo prodotto a partire da una serie di attività ed una serie di lotti di materie prime
    function creaProdotto(
        string[ATTIVITA_MASSIME] memory _nome_attivita,uint32[MATERIE_MASSIME] memory _CO2_attivita, string memory _nome, uint256[MATERIE_MASSIME] memory _id_materie_prime, uint256 _id_lotto
    ) external returns(uint256) {

        require(carbonFootprint.getRisorsaByLotto(_id_lotto).exists==false, "Id lotto gi\xC3\xa0 presente");
        require(!nonEsistente("trasformatore", msg.sender), "Solo i trasformatori possono aggiungere un prodotto trasformato");
        uint32 CO2_totale = 0; 

        // per ogni materia prima controllo se è valida ed utilizzabile, poi sommo i corrispondenti contributi in CO2
        for (uint i=0;i<_id_materie_prime.length;i++) {

            CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByIdProdotto(_id_materie_prime[i]);
            carbonFootprint.setTipologiaUtilizzato(_id_materie_prime[i]);


            require(_id_materie_prime[i] != 0, "Id lotto non valido");
            require(getOwnerByToken(_id_materie_prime[i])==msg.sender, "Non sei in possesso della materia prima inserita");
            require(Generica.stringCompare(string(risorsa.tipologia),"materia prima"),"L'elemento selezionato non \xc3\xa8 una materia prima");

            CO2_totale+=risorsa.valore_CO2;

        }
        
        // per ogni attività sommo i consumi di CO2
        for (uint i=0;i<_CO2_attivita.length;i++) {  

            // trasformo in uint256 poi in uint32
            CO2_totale += (_CO2_attivita[i]);
        }
            
        // creo il prodotto passando id del lotto, CO2 totale, tipologia (prodotto trasformato), possessore (chi ha 
        // mandato il messaggio), lotti di materie prime utilizzate e nome
        uint256 _id_nuovo_prodotto = carbonFootprint.creaProdotto(_id_lotto, CO2_totale, "prodotto trasformato", msg.sender, _id_materie_prime, _nome);
        return _id_nuovo_prodotto;

    }
    





    function getOwnerByToken(
        uint256 _token

    ) public view returns(address) {
    require(_token!=0 && _token<=carbonFootprint.currentToken(), "Il token inserito non \xc3\xa8 valido"); 
           return carbonFootprint.ownerOf(_token);

    }






    function getInfoByToken(
        uint256 _token
    ) public view returns(string memory, uint256, uint256, string memory) {

        CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByIdProdotto(_token);
        require(_token!=0 && _token<=carbonFootprint.currentToken(), "Il token inserito non \xc3\xa8 valido");
        return (risorsa.nome, risorsa.lotto, risorsa.valore_CO2, risorsa.tipologia);

    }



    function getInfoByLotto(
        uint256 _lotto
    ) public view returns(string memory, uint256, uint256, string memory) {

        CarbonFootprint.Risorsa memory risorsa = carbonFootprint.getRisorsaByLotto(_lotto);
        require(_lotto!=0 && risorsa.exists!=false, "Il lotto inserito non \xc3\xa8 valido");
        return (risorsa.nome, risorsa.lotto, risorsa.valore_CO2, risorsa.tipologia);
                
    }


    function getInfoByNome(
        string memory _nome
    ) public view returns(CarbonFootprint.Risorsa[] memory) {
            
        CarbonFootprint.Risorsa[] memory risorse = new CarbonFootprint.Risorsa[](carbonFootprint.currentToken());
        uint j=0;
        for (uint i=1;i<=carbonFootprint.currentToken();i++) {
            CarbonFootprint.Risorsa memory risorsa_i = carbonFootprint.getRisorsaByIdProdotto(i);
            if(Generica.stringCompare(risorsa_i.nome,_nome)) {
                risorse[j] = risorsa_i;
                j++;
            }
        }
        require(j!=0, "Nessun prodotto con il nome inserito");

        return risorse;
                
    }  


    //funzione che verifica che non sia già presente un account con lo stesso tipo di quello passato
    function nonEsistente(
        string memory _tipo, address _indirizzo_account
    ) private view returns(bool) {

        if(Generica.stringCompare(_tipo,"produttore")) {
            for (uint i;i<numero_produttori;i++) {
                if(_indirizzo_account == produttori[i]) return false;
            }
        }

        else if(Generica.stringCompare(_tipo, "trasformatore")) {
            for (uint i;i<numero_trasformatori;i++) {
                if(_indirizzo_account == trasformatori[i]) return false;
            }
        }

        else if(Generica.stringCompare(_tipo, "cliente")) {
            for (uint i;i<numero_clienti;i++) {
                if(_indirizzo_account == clienti[i]) return false;
            }
        }

        return true;

    }




    function nonEsistente(
        address _indirizzo_account
    ) private view returns(bool) {

        for (uint i;i<numero_produttori;i++) {
            if(_indirizzo_account == produttori[i]) return false;
        }

        for (uint i;i<numero_trasformatori;i++) {
            if(_indirizzo_account == trasformatori[i]) return false;
        }
        

        for (uint i;i<numero_clienti;i++) {
            if(_indirizzo_account == clienti[i]) return false;
        }

        return true;
    }

}
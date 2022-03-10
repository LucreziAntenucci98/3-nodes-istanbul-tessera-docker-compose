// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;
//pragma experimental SMTChecker;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";


contract CarbonFootprint is ERC721 {

    // per tenere il conteggio dei token prodotti fino ad ora (e quindi delle materie prima/prodotti nel catalogo)
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // struttura che contiene le informazioni della risorsa
    struct Risorsa {
        string nome; // nome risorsa
        uint256 lotto; // lotto che identifica la risorsa (inserito dall'utente)
        string[] nomi_attivita; // vettore che contiene i nomi delle attività svolte per produrre la risorsa (se presenti)
        uint32[] valori_CO2_attivita; // vettore che contiene i consumi delle attività svolte per produrre la risorsa (se presenti)
        uint32 valore_CO2; // valore di CO2 della risorsa
        string tipologia; // tipologia di risorsa (materia prima, prodotto o utilizzata)
        uint256[] lotti_materie_prime; // materie prime utilizzate per produrre la risorsa (se presenti)
        uint256 token; // token che identifica la risorsa (prodotto nel momento in cui la risorsa è inserita nella bc)
        bool exists; // attributo che serve per capire se la risorsa esiste o meno
    }

    mapping(uint256=>Risorsa) private risorsaByLotto; // sapendo il lotto ricavo la risorsa
    
    mapping(uint256=>Risorsa) private risorsaByToken_prodotto; // sapendo il token ricavo la risorsa

    // costruttore del token 
    constructor() 
    ERC721("CarbonFootprint", "CFP"){
    }
    
    // tale funzione crea la risorsa (sia materia prima che trasformato) e la inserisce nelle mapping per 
    // poterne poi estrarre le informazioni
    function creaProdotto(uint256 _lotto, uint32 _valore_CO2, string[] memory _nomi_attivita, 
        uint32[] memory _valori_CO2_attivita, string memory _tipologia, 
        address _possessore, uint256[] memory _lotti_materie_prime, string memory _nome
        ) public returns(uint256) {

        // il token della risorsa è uguale al token corrente + 1
        _tokenIds.increment();
        uint256 id_nuovo_prodotto = _tokenIds.current();

        // creo un'istanza di Risorsa 
        Risorsa memory risorsa = Risorsa(
            _nome,
            _lotto,
            _nomi_attivita,
            _valori_CO2_attivita,
            _valore_CO2,
            _tipologia,
            _lotti_materie_prime,
            id_nuovo_prodotto,
            true
        );

        // inserisco l'istanza di risorsa nei due mapping (conoscendone il lotto ed il token)
        risorsaByLotto[_lotto] = risorsa;
        risorsaByToken_prodotto[id_nuovo_prodotto] = risorsa;
        // assegno la risorsa al possessore
        _safeMint(_possessore, id_nuovo_prodotto);

        return id_nuovo_prodotto;
    }

    // funzione che riceve un lotto e contrassegna la relativa risorsa come "utilizzata"
    function setTipologiaUtilizzato(
        uint256 _lotto
    ) external {

        // setto la risorsa come utilizzata in entrambi i mapping
        risorsaByLotto[_lotto].tipologia = "utilizzata";
        uint256 token = risorsaByLotto[_lotto].token;
        risorsaByToken_prodotto[token].tipologia = "utilizzata";

    }

    // restituisce il numero di token prodotti fino ad ora
    function currentToken(
    ) external view returns(uint256) {
        return _tokenIds.current();
    }

    // funzione che riceve un token e restituisce la risorsa con quel token
    function getRisorsaByIdProdotto(
        uint256 _token_prodotto
    ) external view returns(Risorsa memory) {

        return risorsaByToken_prodotto[_token_prodotto];

    }

    // funzione che riceve un lotto e restituisce la risorsa con quel lotto
    function getRisorsaByLotto(
        uint256 _lotto
    ) external view returns(Risorsa memory) {

        return risorsaByLotto[_lotto];
          
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override { 
        _safeTransfer(from, to, tokenId, "");
    }

}
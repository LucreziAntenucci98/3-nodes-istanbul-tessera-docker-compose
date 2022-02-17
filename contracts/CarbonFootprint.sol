// SPDX-License-Identifier: MIT

pragma solidity>=0.5.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract CarbonFootprint is ERC721 {


    //numero massimo di attività per prodotto
    uint8 constant MATERIE_MASSIME = 2;

    // per tenere il conteggio dei token prodotti fino ad ora
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // struttura che contiene le informazioni della risorsa
    struct Risorsa {
        string nome;
        uint256 lotto;
        uint32 valore_CO2; 
        string tipologia;
        uint256[MATERIE_MASSIME] id_materie_prime;
        uint256 token;
        bool exists;
    }

    // per ottenere la risorsa in base al lotto ed in base al token
    mapping(uint256=>Risorsa) private risorsaByLotto; 
    mapping(uint256=>Risorsa) private risorsaById_prodotto; 

    constructor () ERC721("CarbonFootprint", "CFP"){
    }



    //tale funzione crea il certificato per un prodotto (sia materia prima che trasformato)
    function creaProdotto(
        uint256 _lotto, uint32 _valore_CO2, string memory _tipologia, 
        address _possessore, uint256[MATERIE_MASSIME] memory _id_materia_prima, string memory _nome
        )
        public returns(uint256){


        _tokenIds.increment();
        uint256 id_nuovo_prodotto = _tokenIds.current();

        Risorsa memory risorsa = Risorsa(
            _nome,
            _lotto,
            _valore_CO2,
            _tipologia,
            _id_materia_prima,
            id_nuovo_prodotto,
            true
        );


        risorsaByLotto[_lotto] = risorsa;
        risorsaById_prodotto[id_nuovo_prodotto] = risorsa;
        _mint(_possessore, id_nuovo_prodotto);

        return id_nuovo_prodotto;
    }


    function setTipologiaUtilizzato(
        uint256 _lotto
    ) external {

        risorsaByLotto[_lotto].tipologia = "utilizzata";
        uint256 token = risorsaByLotto[_lotto].token;
        risorsaById_prodotto[token].tipologia = "utilizzata";

    }





    // restituisce il numero di token prodotti fino ad ora
    function currentToken(
    ) external view returns(uint256) {

        return _tokenIds.current();

    }


    // restituisce la risorsa a partire dall'id
    function getRisorsaByIdProdotto(
        uint256 _id_prodotto
    ) external view returns(Risorsa memory) {

        return risorsaById_prodotto[_id_prodotto];

    }


    // restituisce la risorsa a partire dal lotto
    function getRisorsaByLotto(
        uint256 _lotto
    ) external view returns(Risorsa memory) {

        return risorsaByLotto[_lotto];
          
    }


}
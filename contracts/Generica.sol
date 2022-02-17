// SPDX-License-Identifier: MIT

pragma solidity>=0.5.16;

library Generica {

    //funzione per comparare stringhe
    function stringCompare(
        string memory s1, string memory s2
    ) 
    external pure returns(bool){

        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }



    function strToUint(string memory _str) public pure returns(uint256 res) {
    
    for (uint256 i = 0; i < bytes(_str).length; i++) {
        if ((uint8(bytes(_str)[i]) - 48) < 0 || (uint8(bytes(_str)[i]) - 48) > 9) {
            return 0;
        }
        res += (uint8(bytes(_str)[i]) - 48) * 10**(bytes(_str).length - i - 1);
    }
    
    return res;
    }


}

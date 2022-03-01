// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Generica {

    //funzione per comparare stringhe
    function stringCompare(
        string memory s1, string memory s2
    ) 
    external pure returns(bool){

        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }



    function toString(uint256 value) internal pure returns (string memory) {
        
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }


    function concatenate(string memory a,string memory b) public pure returns (string memory){
        return string(abi.encodePacked(a,b));
    } 


}
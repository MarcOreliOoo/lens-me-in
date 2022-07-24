// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SismoBadges is ERC1155, Ownable {
    constructor() ERC1155("ipfs://QmSDYZAVnYfasECB84mnAYKaXJQySBFt6Y61mUDCgKWf2N/{id}.json") {}

    function mint(address account, uint256 id, uint256 amount)
        public
        onlyOwner
    {
        _mint(account, id, amount, "");
    }   
}
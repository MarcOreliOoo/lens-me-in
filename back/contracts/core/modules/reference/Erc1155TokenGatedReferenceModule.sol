pragma solidity 0.8.10;

import {IReferenceModule} from '../../../interfaces/IReferenceModule.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {IERC1155} from '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';


/**
Custom rule sets can be built for reference modules--for example, 
you may want to allow only specific Follower NFT ID holders to comment and follow.
In addition, reference modules include separate functions for validating mirrors and comments,
so the rules can be different for each! (With the limitation that the functions are called on the same contract.)
 */

contract Erc1155TokenGateReferenceModule is IReferenceModule, ModuleBase {
    error NotHolder();
    address public tokenGatedAddress;
	uint256 public tokenGatedId;

    constructor(address hub) ModuleBase(hub) {}

	function initializeReferenceModule(uint256 profileId, uint256 pubId, bytes calldata data)
		external
		override
		onlyHub
		returns (bytes memory)
	{
		//get the NFT address + the Id of the sismo badge required
		(tokenGatedAddress, tokenGatedId) = abi.decode(data, (address, uint256));
	}

	/**
     * @notice Processes a comment action referencing a given publication. This can only be called by the hub.
     *
     * @param profileId The token ID of the profile associated with the publication being published.
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     * @param data Arbitrary data __passed from the commenter!__ to be decoded.
     */
    function processComment(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external override onlyHub {
		address user = abi.decode(data,(address));
		//Verif if user got NFT
		if(IERC1155(tokenGatedAddress).balanceOf(user,tokenGatedId) < 1) revert NotHolder();
	}	

    /**
     * @notice Processes a mirror action referencing a given publication. This can only be called by the hub.
     *
     * @param profileId The token ID of the profile associated with the publication being published.
     * @param profileIdPointed The profile ID of the profile associated the publication being referenced.
     * @param pubIdPointed The publication ID of the publication being referenced.
     * @param data Arbitrary data __passed from the mirrorer!__ to be decoded.
     */
    function processMirror(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external override onlyHub {
		address user = abi.decode(data,(address));
		//Verif if user got NFT
		if(IERC1155(tokenGatedAddress).balanceOf(user,tokenGatedId) < 1) revert NotHolder();
	}

}
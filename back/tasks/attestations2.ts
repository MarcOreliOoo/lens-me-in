import { defaultAbiCoder } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import {
    FollowNFT__factory,
    LensHub__factory,
    Erc1155TokenGatedReferenceModule,
    Erc1155TokenGatedReferenceModule__factory,
    SismoBadges__factory,
} from '../typechain-types';
import {
    CommentDataStruct,
    CreateProfileDataStruct,
    PostDataStruct,
} from '../typechain-types/LensHub';
import {
    deployContract,
    getAddrs,
    initEnv,
    ProtocolState,
    waitForTx,
    ZERO_ADDRESS,
} from './helpers/utils';

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';

/**
 * Task order :
 * 1- create a profile
 * 2- create a normal post
 * 3- create a comment
 * 4- create a post gated with token
 * 5- create a comment if user gated with token
 */

task('attestation2', 'tests the attestation2 module').setAction(async ({ }, hre) => {
    const [governance, , user, user2] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    // 0-Init test NFT badges
    //deploy nft contract for simulating badges
    const _abi = [
        {
            inputs: [],
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'operator',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'approved',
                    type: 'bool',
                },
            ],
            name: 'ApprovalForAll',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'previousOwner',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'operator',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'to',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'ids',
                    type: 'uint256[]',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'values',
                    type: 'uint256[]',
                },
            ],
            name: 'TransferBatch',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'operator',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'to',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'TransferSingle',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'value',
                    type: 'string',
                },
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
            ],
            name: 'URI',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
            ],
            name: 'balanceOf',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: 'accounts',
                    type: 'address[]',
                },
                {
                    internalType: 'uint256[]',
                    name: 'ids',
                    type: 'uint256[]',
                },
            ],
            name: 'balanceOfBatch',
            outputs: [
                {
                    internalType: 'uint256[]',
                    name: '',
                    type: 'uint256[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'operator',
                    type: 'address',
                },
            ],
            name: 'isApprovedForAll',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'mint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'to',
                    type: 'address',
                },
                {
                    internalType: 'uint256[]',
                    name: 'ids',
                    type: 'uint256[]',
                },
                {
                    internalType: 'uint256[]',
                    name: 'amounts',
                    type: 'uint256[]',
                },
                {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                },
            ],
            name: 'safeBatchTransferFrom',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'to',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                },
            ],
            name: 'safeTransferFrom',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'operator',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'approved',
                    type: 'bool',
                },
            ],
            name: 'setApprovalForAll',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes4',
                    name: 'interfaceId',
                    type: 'bytes4',
                },
            ],
            name: 'supportsInterface',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'uri',
            outputs: [
                {
                    internalType: 'string',
                    name: '',
                    type: 'string',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ];
    const _bytecode = {
        functionDebugData: {
            '@_149': {
                entryPoint: null,
                id: 149,
                parameterSlots: 1,
                returnSlots: 0,
            },
            '@_1746': {
                entryPoint: null,
                id: 1746,
                parameterSlots: 0,
                returnSlots: 0,
            },
            '@_23': {
                entryPoint: null,
                id: 23,
                parameterSlots: 0,
                returnSlots: 0,
            },
            '@_msgSender_1685': {
                entryPoint: 128,
                id: 1685,
                parameterSlots: 0,
                returnSlots: 1,
            },
            '@_setURI_628': {
                entryPoint: 100,
                id: 628,
                parameterSlots: 1,
                returnSlots: 0,
            },
            '@_transferOwnership_103': {
                entryPoint: 136,
                id: 103,
                parameterSlots: 1,
                returnSlots: 0,
            },
            extract_byte_array_length: {
                entryPoint: 557,
                id: null,
                parameterSlots: 1,
                returnSlots: 1,
            },
            panic_error_0x22: {
                entryPoint: 510,
                id: null,
                parameterSlots: 0,
                returnSlots: 0,
            },
        },
        generatedSources: [
            {
                ast: {
                    nodeType: 'YulBlock',
                    src: '0:516:10',
                    statements: [
                        {
                            body: {
                                nodeType: 'YulBlock',
                                src: '35:152:10',
                                statements: [
                                    {
                                        expression: {
                                            arguments: [
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '52:1:10',
                                                    type: '',
                                                    value: '0',
                                                },
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '55:77:10',
                                                    type: '',
                                                    value: '35408467139433450592217433187231851964531694900788300625387963629091585785856',
                                                },
                                            ],
                                            functionName: {
                                                name: 'mstore',
                                                nodeType: 'YulIdentifier',
                                                src: '45:6:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '45:88:10',
                                        },
                                        nodeType: 'YulExpressionStatement',
                                        src: '45:88:10',
                                    },
                                    {
                                        expression: {
                                            arguments: [
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '149:1:10',
                                                    type: '',
                                                    value: '4',
                                                },
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '152:4:10',
                                                    type: '',
                                                    value: '0x22',
                                                },
                                            ],
                                            functionName: {
                                                name: 'mstore',
                                                nodeType: 'YulIdentifier',
                                                src: '142:6:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '142:15:10',
                                        },
                                        nodeType: 'YulExpressionStatement',
                                        src: '142:15:10',
                                    },
                                    {
                                        expression: {
                                            arguments: [
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '173:1:10',
                                                    type: '',
                                                    value: '0',
                                                },
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '176:4:10',
                                                    type: '',
                                                    value: '0x24',
                                                },
                                            ],
                                            functionName: {
                                                name: 'revert',
                                                nodeType: 'YulIdentifier',
                                                src: '166:6:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '166:15:10',
                                        },
                                        nodeType: 'YulExpressionStatement',
                                        src: '166:15:10',
                                    },
                                ],
                            },
                            name: 'panic_error_0x22',
                            nodeType: 'YulFunctionDefinition',
                            src: '7:180:10',
                        },
                        {
                            body: {
                                nodeType: 'YulBlock',
                                src: '244:269:10',
                                statements: [
                                    {
                                        nodeType: 'YulAssignment',
                                        src: '254:22:10',
                                        value: {
                                            arguments: [
                                                {
                                                    name: 'data',
                                                    nodeType: 'YulIdentifier',
                                                    src: '268:4:10',
                                                },
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '274:1:10',
                                                    type: '',
                                                    value: '2',
                                                },
                                            ],
                                            functionName: {
                                                name: 'div',
                                                nodeType: 'YulIdentifier',
                                                src: '264:3:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '264:12:10',
                                        },
                                        variableNames: [
                                            {
                                                name: 'length',
                                                nodeType: 'YulIdentifier',
                                                src: '254:6:10',
                                            },
                                        ],
                                    },
                                    {
                                        nodeType: 'YulVariableDeclaration',
                                        src: '285:38:10',
                                        value: {
                                            arguments: [
                                                {
                                                    name: 'data',
                                                    nodeType: 'YulIdentifier',
                                                    src: '315:4:10',
                                                },
                                                {
                                                    kind: 'number',
                                                    nodeType: 'YulLiteral',
                                                    src: '321:1:10',
                                                    type: '',
                                                    value: '1',
                                                },
                                            ],
                                            functionName: {
                                                name: 'and',
                                                nodeType: 'YulIdentifier',
                                                src: '311:3:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '311:12:10',
                                        },
                                        variables: [
                                            {
                                                name: 'outOfPlaceEncoding',
                                                nodeType: 'YulTypedName',
                                                src: '289:18:10',
                                                type: '',
                                            },
                                        ],
                                    },
                                    {
                                        body: {
                                            nodeType: 'YulBlock',
                                            src: '362:51:10',
                                            statements: [
                                                {
                                                    nodeType: 'YulAssignment',
                                                    src: '376:27:10',
                                                    value: {
                                                        arguments: [
                                                            {
                                                                name: 'length',
                                                                nodeType: 'YulIdentifier',
                                                                src: '390:6:10',
                                                            },
                                                            {
                                                                kind: 'number',
                                                                nodeType: 'YulLiteral',
                                                                src: '398:4:10',
                                                                type: '',
                                                                value: '0x7f',
                                                            },
                                                        ],
                                                        functionName: {
                                                            name: 'and',
                                                            nodeType: 'YulIdentifier',
                                                            src: '386:3:10',
                                                        },
                                                        nodeType: 'YulFunctionCall',
                                                        src: '386:17:10',
                                                    },
                                                    variableNames: [
                                                        {
                                                            name: 'length',
                                                            nodeType: 'YulIdentifier',
                                                            src: '376:6:10',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        condition: {
                                            arguments: [
                                                {
                                                    name: 'outOfPlaceEncoding',
                                                    nodeType: 'YulIdentifier',
                                                    src: '342:18:10',
                                                },
                                            ],
                                            functionName: {
                                                name: 'iszero',
                                                nodeType: 'YulIdentifier',
                                                src: '335:6:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '335:26:10',
                                        },
                                        nodeType: 'YulIf',
                                        src: '332:81:10',
                                    },
                                    {
                                        body: {
                                            nodeType: 'YulBlock',
                                            src: '465:42:10',
                                            statements: [
                                                {
                                                    expression: {
                                                        arguments: [],
                                                        functionName: {
                                                            name: 'panic_error_0x22',
                                                            nodeType: 'YulIdentifier',
                                                            src: '479:16:10',
                                                        },
                                                        nodeType: 'YulFunctionCall',
                                                        src: '479:18:10',
                                                    },
                                                    nodeType: 'YulExpressionStatement',
                                                    src: '479:18:10',
                                                },
                                            ],
                                        },
                                        condition: {
                                            arguments: [
                                                {
                                                    name: 'outOfPlaceEncoding',
                                                    nodeType: 'YulIdentifier',
                                                    src: '429:18:10',
                                                },
                                                {
                                                    arguments: [
                                                        {
                                                            name: 'length',
                                                            nodeType: 'YulIdentifier',
                                                            src: '452:6:10',
                                                        },
                                                        {
                                                            kind: 'number',
                                                            nodeType: 'YulLiteral',
                                                            src: '460:2:10',
                                                            type: '',
                                                            value: '32',
                                                        },
                                                    ],
                                                    functionName: {
                                                        name: 'lt',
                                                        nodeType: 'YulIdentifier',
                                                        src: '449:2:10',
                                                    },
                                                    nodeType: 'YulFunctionCall',
                                                    src: '449:14:10',
                                                },
                                            ],
                                            functionName: {
                                                name: 'eq',
                                                nodeType: 'YulIdentifier',
                                                src: '426:2:10',
                                            },
                                            nodeType: 'YulFunctionCall',
                                            src: '426:38:10',
                                        },
                                        nodeType: 'YulIf',
                                        src: '423:84:10',
                                    },
                                ],
                            },
                            name: 'extract_byte_array_length',
                            nodeType: 'YulFunctionDefinition',
                            parameters: [
                                {
                                    name: 'data',
                                    nodeType: 'YulTypedName',
                                    src: '228:4:10',
                                    type: '',
                                },
                            ],
                            returnVariables: [
                                {
                                    name: 'length',
                                    nodeType: 'YulTypedName',
                                    src: '237:6:10',
                                    type: '',
                                },
                            ],
                            src: '193:320:10',
                        },
                    ],
                },
                contents:
                    '{\n\n    function panic_error_0x22() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x22)\n        revert(0, 0x24)\n    }\n\n    function extract_byte_array_length(data) -> length {\n        length := div(data, 2)\n        let outOfPlaceEncoding := and(data, 1)\n        if iszero(outOfPlaceEncoding) {\n            length := and(length, 0x7f)\n        }\n\n        if eq(outOfPlaceEncoding, lt(length, 32)) {\n            panic_error_0x22()\n        }\n    }\n\n}\n',
                id: 10,
                language: 'Yul',
                name: '#utility.yul',
            },
        ],
        linkReferences: {},
        object: '60806040523480156200001157600080fd5b506040518060600160405280603f815260200162002f5e603f91396200003d816200006460201b60201c565b506200005e620000526200008060201b60201c565b6200008860201b60201c565b62000263565b80600290805190602001906200007c9291906200014e565b5050565b600033905090565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8280546200015c906200022d565b90600052602060002090601f016020900481019282620001805760008555620001cc565b82601f106200019b57805160ff1916838001178555620001cc565b82800160010185558215620001cc579182015b82811115620001cb578251825591602001919060010190620001ae565b5b509050620001db9190620001df565b5090565b5b80821115620001fa576000816000905550600101620001e0565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200024657607f821691505b602082108114156200025d576200025c620001fe565b5b50919050565b612ceb80620002736000396000f3fe608060405234801561001057600080fd5b50600436106100b35760003560e01c8063715018a611610071578063715018a6146101b05780638da5cb5b146101ba578063a22cb465146101d8578063e985e9c5146101f4578063f242432a14610224578063f2fde38b14610240576100b3565b8062fdd58e146100b857806301ffc9a7146100e85780630e89341c14610118578063156e29f6146101485780632eb2c2d6146101645780634e1273f414610180575b600080fd5b6100d260048036038101906100cd91906118b4565b61025c565b6040516100df9190611903565b60405180910390f35b61010260048036038101906100fd9190611976565b610325565b60405161010f91906119be565b60405180910390f35b610132600480360381019061012d91906119d9565b610407565b60405161013f9190611a9f565b60405180910390f35b610162600480360381019061015d9190611ac1565b61049b565b005b61017e60048036038101906101799190611d11565b610537565b005b61019a60048036038101906101959190611ea3565b6105d8565b6040516101a79190611fd9565b60405180910390f35b6101b86106f1565b005b6101c2610779565b6040516101cf919061200a565b60405180910390f35b6101f260048036038101906101ed9190612051565b6107a3565b005b61020e60048036038101906102099190612091565b6107b9565b60405161021b91906119be565b60405180910390f35b61023e600480360381019061023991906120d1565b61084d565b005b61025a60048036038101906102559190612168565b6108ee565b005b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156102cd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c490612207565b60405180910390fd5b60008083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103f057507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061040057506103ff826109e6565b5b9050919050565b60606002805461041690612256565b80601f016020809104026020016040519081016040528092919081815260200182805461044290612256565b801561048f5780601f106104645761010080835404028352916020019161048f565b820191906000526020600020905b81548152906001019060200180831161047257829003601f168201915b50505050509050919050565b6104a3610a50565b73ffffffffffffffffffffffffffffffffffffffff166104c1610779565b73ffffffffffffffffffffffffffffffffffffffff1614610517576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050e906122d4565b60405180910390fd5b61053283838360405180602001604052806000815250610a58565b505050565b61053f610a50565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061058557506105848561057f610a50565b6107b9565b5b6105c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105bb90612366565b60405180910390fd5b6105d18585858585610bee565b5050505050565b6060815183511461061e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610615906123f8565b60405180910390fd5b6000835167ffffffffffffffff81111561063b5761063a611b19565b5b6040519080825280602002602001820160405280156106695781602001602082028036833780820191505090505b50905060005b84518110156106e6576106b685828151811061068e5761068d612418565b5b60200260200101518583815181106106a9576106a8612418565b5b602002602001015161025c565b8282815181106106c9576106c8612418565b5b602002602001018181525050806106df90612476565b905061066f565b508091505092915050565b6106f9610a50565b73ffffffffffffffffffffffffffffffffffffffff16610717610779565b73ffffffffffffffffffffffffffffffffffffffff161461076d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610764906122d4565b60405180910390fd5b6107776000610f02565b565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6107b56107ae610a50565b8383610fc8565b5050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610855610a50565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061089b575061089a85610895610a50565b6107b9565b5b6108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190612531565b60405180910390fd5b6108e78585858585611135565b5050505050565b6108f6610a50565b73ffffffffffffffffffffffffffffffffffffffff16610914610779565b73ffffffffffffffffffffffffffffffffffffffff161461096a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610961906122d4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d1906125c3565b60405180910390fd5b6109e381610f02565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610ac8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610abf90612655565b60405180910390fd5b6000610ad2610a50565b9050610af381600087610ae4886113b7565b610aed886113b7565b87611431565b8260008086815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610b529190612675565b925050819055508473ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628787604051610bd09291906126cb565b60405180910390a4610be781600087878787611439565b5050505050565b8151835114610c32576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2990612766565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610ca2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c99906127f8565b60405180910390fd5b6000610cac610a50565b9050610cbc818787878787611431565b60005b8451811015610e6d576000858281518110610cdd57610cdc612418565b5b602002602001015190506000858381518110610cfc57610cfb612418565b5b60200260200101519050600080600084815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d9d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d949061288a565b60405180910390fd5b81810360008085815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160008085815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e529190612675565b9250508190555050505080610e6690612476565b9050610cbf565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610ee49291906128aa565b60405180910390a4610efa818787878787611611565b505050505050565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102e90612953565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405161112891906119be565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156111a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161119c906127f8565b60405180910390fd5b60006111af610a50565b90506111cf8187876111c0886113b7565b6111c9886113b7565b87611431565b600080600086815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905083811015611266576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161125d9061288a565b60405180910390fd5b83810360008087815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508360008087815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461131b9190612675565b925050819055508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6288886040516113989291906126cb565b60405180910390a46113ae828888888888611439565b50505050505050565b60606000600167ffffffffffffffff8111156113d6576113d5611b19565b5b6040519080825280602002602001820160405280156114045781602001602082028036833780820191505090505b509050828160008151811061141c5761141b612418565b5b60200260200101818152505080915050919050565b505050505050565b6114588473ffffffffffffffffffffffffffffffffffffffff166117e9565b15611609578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b815260040161149e9594939291906129c8565b6020604051808303816000875af19250505080156114da57506040513d601f19601f820116820180604052508101906114d79190612a37565b60015b611580576114e6612a71565b806308c379a0141561154357506114fb612a93565b806115065750611545565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161153a9190611a9f565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157790612b9b565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611607576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115fe90612c2d565b60405180910390fd5b505b505050505050565b6116308473ffffffffffffffffffffffffffffffffffffffff166117e9565b156117e1578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b8152600401611676959493929190612c4d565b6020604051808303816000875af19250505080156116b257506040513d601f19601f820116820180604052508101906116af9190612a37565b60015b611758576116be612a71565b806308c379a0141561171b57506116d3612a93565b806116de575061171d565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117129190611a9f565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161174f90612b9b565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146117df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117d690612c2d565b60405180910390fd5b505b505050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061184b82611820565b9050919050565b61185b81611840565b811461186657600080fd5b50565b60008135905061187881611852565b92915050565b6000819050919050565b6118918161187e565b811461189c57600080fd5b50565b6000813590506118ae81611888565b92915050565b600080604083850312156118cb576118ca611816565b5b60006118d985828601611869565b92505060206118ea8582860161189f565b9150509250929050565b6118fd8161187e565b82525050565b600060208201905061191860008301846118f4565b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6119538161191e565b811461195e57600080fd5b50565b6000813590506119708161194a565b92915050565b60006020828403121561198c5761198b611816565b5b600061199a84828501611961565b91505092915050565b60008115159050919050565b6119b8816119a3565b82525050565b60006020820190506119d360008301846119af565b92915050565b6000602082840312156119ef576119ee611816565b5b60006119fd8482850161189f565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611a40578082015181840152602081019050611a25565b83811115611a4f576000848401525b50505050565b6000601f19601f8301169050919050565b6000611a7182611a06565b611a7b8185611a11565b9350611a8b818560208601611a22565b611a9481611a55565b840191505092915050565b60006020820190508181036000830152611ab98184611a66565b905092915050565b600080600060608486031215611ada57611ad9611816565b5b6000611ae886828701611869565b9350506020611af98682870161189f565b9250506040611b0a8682870161189f565b9150509250925092565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611b5182611a55565b810181811067ffffffffffffffff82111715611b7057611b6f611b19565b5b80604052505050565b6000611b8361180c565b9050611b8f8282611b48565b919050565b600067ffffffffffffffff821115611baf57611bae611b19565b5b602082029050602081019050919050565b600080fd5b6000611bd8611bd384611b94565b611b79565b90508083825260208201905060208402830185811115611bfb57611bfa611bc0565b5b835b81811015611c245780611c10888261189f565b845260208401935050602081019050611bfd565b5050509392505050565b600082601f830112611c4357611c42611b14565b5b8135611c53848260208601611bc5565b91505092915050565b600080fd5b600067ffffffffffffffff821115611c7c57611c7b611b19565b5b611c8582611a55565b9050602081019050919050565b82818337600083830152505050565b6000611cb4611caf84611c61565b611b79565b905082815260208101848484011115611cd057611ccf611c5c565b5b611cdb848285611c92565b509392505050565b600082601f830112611cf857611cf7611b14565b5b8135611d08848260208601611ca1565b91505092915050565b600080600080600060a08688031215611d2d57611d2c611816565b5b6000611d3b88828901611869565b9550506020611d4c88828901611869565b945050604086013567ffffffffffffffff811115611d6d57611d6c61181b565b5b611d7988828901611c2e565b935050606086013567ffffffffffffffff811115611d9a57611d9961181b565b5b611da688828901611c2e565b925050608086013567ffffffffffffffff811115611dc757611dc661181b565b5b611dd388828901611ce3565b9150509295509295909350565b600067ffffffffffffffff821115611dfb57611dfa611b19565b5b602082029050602081019050919050565b6000611e1f611e1a84611de0565b611b79565b90508083825260208201905060208402830185811115611e4257611e41611bc0565b5b835b81811015611e6b5780611e578882611869565b845260208401935050602081019050611e44565b5050509392505050565b600082601f830112611e8a57611e89611b14565b5b8135611e9a848260208601611e0c565b91505092915050565b60008060408385031215611eba57611eb9611816565b5b600083013567ffffffffffffffff811115611ed857611ed761181b565b5b611ee485828601611e75565b925050602083013567ffffffffffffffff811115611f0557611f0461181b565b5b611f1185828601611c2e565b9150509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611f508161187e565b82525050565b6000611f628383611f47565b60208301905092915050565b6000602082019050919050565b6000611f8682611f1b565b611f908185611f26565b9350611f9b83611f37565b8060005b83811015611fcc578151611fb38882611f56565b9750611fbe83611f6e565b925050600181019050611f9f565b5085935050505092915050565b60006020820190508181036000830152611ff38184611f7b565b905092915050565b61200481611840565b82525050565b600060208201905061201f6000830184611ffb565b92915050565b61202e816119a3565b811461203957600080fd5b50565b60008135905061204b81612025565b92915050565b6000806040838503121561206857612067611816565b5b600061207685828601611869565b92505060206120878582860161203c565b9150509250929050565b600080604083850312156120a8576120a7611816565b5b60006120b685828601611869565b92505060206120c785828601611869565b9150509250929050565b600080600080600060a086880312156120ed576120ec611816565b5b60006120fb88828901611869565b955050602061210c88828901611869565b945050604061211d8882890161189f565b935050606061212e8882890161189f565b925050608086013567ffffffffffffffff81111561214f5761214e61181b565b5b61215b88828901611ce3565b9150509295509295909350565b60006020828403121561217e5761217d611816565b5b600061218c84828501611869565b91505092915050565b7f455243313135353a2062616c616e636520717565727920666f7220746865207a60008201527f65726f2061646472657373000000000000000000000000000000000000000000602082015250565b60006121f1602b83611a11565b91506121fc82612195565b604082019050919050565b60006020820190508181036000830152612220816121e4565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061226e57607f821691505b6020821081141561228257612281612227565b5b50919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006122be602083611a11565b91506122c982612288565b602082019050919050565b600060208201905081810360008301526122ed816122b1565b9050919050565b7f455243313135353a207472616e736665722063616c6c6572206973206e6f742060008201527f6f776e6572206e6f7220617070726f7665640000000000000000000000000000602082015250565b6000612350603283611a11565b915061235b826122f4565b604082019050919050565b6000602082019050818103600083015261237f81612343565b9050919050565b7f455243313135353a206163636f756e747320616e6420696473206c656e67746860008201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b60006123e2602983611a11565b91506123ed82612386565b604082019050919050565b60006020820190508181036000830152612411816123d5565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006124818261187e565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156124b4576124b3612447565b5b600182019050919050565b7f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260008201527f20617070726f7665640000000000000000000000000000000000000000000000602082015250565b600061251b602983611a11565b9150612526826124bf565b604082019050919050565b6000602082019050818103600083015261254a8161250e565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006125ad602683611a11565b91506125b882612551565b604082019050919050565b600060208201905081810360008301526125dc816125a0565b9050919050565b7f455243313135353a206d696e7420746f20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b600061263f602183611a11565b915061264a826125e3565b604082019050919050565b6000602082019050818103600083015261266e81612632565b9050919050565b60006126808261187e565b915061268b8361187e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156126c0576126bf612447565b5b828201905092915050565b60006040820190506126e060008301856118f4565b6126ed60208301846118f4565b9392505050565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060008201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b6000612750602883611a11565b915061275b826126f4565b604082019050919050565b6000602082019050818103600083015261277f81612743565b9050919050565b7f455243313135353a207472616e7366657220746f20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b60006127e2602583611a11565b91506127ed82612786565b604082019050919050565b60006020820190508181036000830152612811816127d5565b9050919050565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f60008201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b6000612874602a83611a11565b915061287f82612818565b604082019050919050565b600060208201905081810360008301526128a381612867565b9050919050565b600060408201905081810360008301526128c48185611f7b565b905081810360208301526128d88184611f7b565b90509392505050565b7f455243313135353a2073657474696e6720617070726f76616c2073746174757360008201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b600061293d602983611a11565b9150612948826128e1565b604082019050919050565b6000602082019050818103600083015261296c81612930565b9050919050565b600081519050919050565b600082825260208201905092915050565b600061299a82612973565b6129a4818561297e565b93506129b4818560208601611a22565b6129bd81611a55565b840191505092915050565b600060a0820190506129dd6000830188611ffb565b6129ea6020830187611ffb565b6129f760408301866118f4565b612a0460608301856118f4565b8181036080830152612a16818461298f565b90509695505050505050565b600081519050612a318161194a565b92915050565b600060208284031215612a4d57612a4c611816565b5b6000612a5b84828501612a22565b91505092915050565b60008160e01c9050919050565b600060033d1115612a905760046000803e612a8d600051612a64565b90505b90565b600060443d1015612aa357612b26565b612aab61180c565b60043d036004823e80513d602482011167ffffffffffffffff82111715612ad3575050612b26565b808201805167ffffffffffffffff811115612af15750505050612b26565b80602083010160043d038501811115612b0e575050505050612b26565b612b1d82602001850186611b48565b82955050505050505b90565b7f455243313135353a207472616e7366657220746f206e6f6e204552433131353560008201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b6000612b85603483611a11565b9150612b9082612b29565b604082019050919050565b60006020820190508181036000830152612bb481612b78565b9050919050565b7f455243313135353a204552433131353552656365697665722072656a6563746560008201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b6000612c17602883611a11565b9150612c2282612bbb565b604082019050919050565b60006020820190508181036000830152612c4681612c0a565b9050919050565b600060a082019050612c626000830188611ffb565b612c6f6020830187611ffb565b8181036040830152612c818186611f7b565b90508181036060830152612c958185611f7b565b90508181036080830152612ca9818461298f565b9050969550505050505056fea2646970667358221220a50d0a14efc1a807391b70c6e98addff56c4502c2611b1d2483349dec762c40064736f6c634300080a0033697066733a2f2f516d5344595a41566e5966617345434238346d6e41594b61584a517953424674365936316d554443674b5766324e2f7b69647d2e6a736f6e',
        opcodes:
            'PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH3 0x11 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD DUP1 PUSH1 0x60 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x3F DUP2 MSTORE PUSH1 0x20 ADD PUSH3 0x2F5E PUSH1 0x3F SWAP2 CODECOPY PUSH3 0x3D DUP2 PUSH3 0x64 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST POP PUSH3 0x5E PUSH3 0x52 PUSH3 0x80 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST PUSH3 0x88 PUSH1 0x20 SHL PUSH1 0x20 SHR JUMP JUMPDEST PUSH3 0x263 JUMP JUMPDEST DUP1 PUSH1 0x2 SWAP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH3 0x7C SWAP3 SWAP2 SWAP1 PUSH3 0x14E JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP DUP2 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP JUMP JUMPDEST DUP3 DUP1 SLOAD PUSH3 0x15C SWAP1 PUSH3 0x22D JUMP JUMPDEST SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 PUSH1 0x1F ADD PUSH1 0x20 SWAP1 DIV DUP2 ADD SWAP3 DUP3 PUSH3 0x180 JUMPI PUSH1 0x0 DUP6 SSTORE PUSH3 0x1CC JUMP JUMPDEST DUP3 PUSH1 0x1F LT PUSH3 0x19B JUMPI DUP1 MLOAD PUSH1 0xFF NOT AND DUP4 DUP1 ADD OR DUP6 SSTORE PUSH3 0x1CC JUMP JUMPDEST DUP3 DUP1 ADD PUSH1 0x1 ADD DUP6 SSTORE DUP3 ISZERO PUSH3 0x1CC JUMPI SWAP2 DUP3 ADD JUMPDEST DUP3 DUP2 GT ISZERO PUSH3 0x1CB JUMPI DUP3 MLOAD DUP3 SSTORE SWAP2 PUSH1 0x20 ADD SWAP2 SWAP1 PUSH1 0x1 ADD SWAP1 PUSH3 0x1AE JUMP JUMPDEST JUMPDEST POP SWAP1 POP PUSH3 0x1DB SWAP2 SWAP1 PUSH3 0x1DF JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST JUMPDEST DUP1 DUP3 GT ISZERO PUSH3 0x1FA JUMPI PUSH1 0x0 DUP2 PUSH1 0x0 SWAP1 SSTORE POP PUSH1 0x1 ADD PUSH3 0x1E0 JUMP JUMPDEST POP SWAP1 JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH1 0x0 PUSH1 0x2 DUP3 DIV SWAP1 POP PUSH1 0x1 DUP3 AND DUP1 PUSH3 0x246 JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 EQ ISZERO PUSH3 0x25D JUMPI PUSH3 0x25C PUSH3 0x1FE JUMP JUMPDEST JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x2CEB DUP1 PUSH3 0x273 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0xB3 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x715018A6 GT PUSH2 0x71 JUMPI DUP1 PUSH4 0x715018A6 EQ PUSH2 0x1B0 JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0x1BA JUMPI DUP1 PUSH4 0xA22CB465 EQ PUSH2 0x1D8 JUMPI DUP1 PUSH4 0xE985E9C5 EQ PUSH2 0x1F4 JUMPI DUP1 PUSH4 0xF242432A EQ PUSH2 0x224 JUMPI DUP1 PUSH4 0xF2FDE38B EQ PUSH2 0x240 JUMPI PUSH2 0xB3 JUMP JUMPDEST DUP1 PUSH3 0xFDD58E EQ PUSH2 0xB8 JUMPI DUP1 PUSH4 0x1FFC9A7 EQ PUSH2 0xE8 JUMPI DUP1 PUSH4 0xE89341C EQ PUSH2 0x118 JUMPI DUP1 PUSH4 0x156E29F6 EQ PUSH2 0x148 JUMPI DUP1 PUSH4 0x2EB2C2D6 EQ PUSH2 0x164 JUMPI DUP1 PUSH4 0x4E1273F4 EQ PUSH2 0x180 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH2 0xD2 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0xCD SWAP2 SWAP1 PUSH2 0x18B4 JUMP JUMPDEST PUSH2 0x25C JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0xDF SWAP2 SWAP1 PUSH2 0x1903 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x102 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0xFD SWAP2 SWAP1 PUSH2 0x1976 JUMP JUMPDEST PUSH2 0x325 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x10F SWAP2 SWAP1 PUSH2 0x19BE JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x132 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x12D SWAP2 SWAP1 PUSH2 0x19D9 JUMP JUMPDEST PUSH2 0x407 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x13F SWAP2 SWAP1 PUSH2 0x1A9F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x162 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x15D SWAP2 SWAP1 PUSH2 0x1AC1 JUMP JUMPDEST PUSH2 0x49B JUMP JUMPDEST STOP JUMPDEST PUSH2 0x17E PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x179 SWAP2 SWAP1 PUSH2 0x1D11 JUMP JUMPDEST PUSH2 0x537 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x19A PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x195 SWAP2 SWAP1 PUSH2 0x1EA3 JUMP JUMPDEST PUSH2 0x5D8 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1A7 SWAP2 SWAP1 PUSH2 0x1FD9 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1B8 PUSH2 0x6F1 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x1C2 PUSH2 0x779 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x1CF SWAP2 SWAP1 PUSH2 0x200A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1F2 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x1ED SWAP2 SWAP1 PUSH2 0x2051 JUMP JUMPDEST PUSH2 0x7A3 JUMP JUMPDEST STOP JUMPDEST PUSH2 0x20E PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x209 SWAP2 SWAP1 PUSH2 0x2091 JUMP JUMPDEST PUSH2 0x7B9 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x21B SWAP2 SWAP1 PUSH2 0x19BE JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x23E PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x239 SWAP2 SWAP1 PUSH2 0x20D1 JUMP JUMPDEST PUSH2 0x84D JUMP JUMPDEST STOP JUMPDEST PUSH2 0x25A PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x255 SWAP2 SWAP1 PUSH2 0x2168 JUMP JUMPDEST PUSH2 0x8EE JUMP JUMPDEST STOP JUMPDEST PUSH1 0x0 DUP1 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x2CD JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x2C4 SWAP1 PUSH2 0x2207 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 DUP1 DUP4 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0xD9B67A2600000000000000000000000000000000000000000000000000000000 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND DUP3 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND EQ DUP1 PUSH2 0x3F0 JUMPI POP PUSH32 0xE89341C00000000000000000000000000000000000000000000000000000000 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND DUP3 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND EQ JUMPDEST DUP1 PUSH2 0x400 JUMPI POP PUSH2 0x3FF DUP3 PUSH2 0x9E6 JUMP JUMPDEST JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x60 PUSH1 0x2 DUP1 SLOAD PUSH2 0x416 SWAP1 PUSH2 0x2256 JUMP JUMPDEST DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP3 DUP1 SLOAD PUSH2 0x442 SWAP1 PUSH2 0x2256 JUMP JUMPDEST DUP1 ISZERO PUSH2 0x48F JUMPI DUP1 PUSH1 0x1F LT PUSH2 0x464 JUMPI PUSH2 0x100 DUP1 DUP4 SLOAD DIV MUL DUP4 MSTORE SWAP2 PUSH1 0x20 ADD SWAP2 PUSH2 0x48F JUMP JUMPDEST DUP3 ADD SWAP2 SWAP1 PUSH1 0x0 MSTORE PUSH1 0x20 PUSH1 0x0 KECCAK256 SWAP1 JUMPDEST DUP2 SLOAD DUP2 MSTORE SWAP1 PUSH1 0x1 ADD SWAP1 PUSH1 0x20 ADD DUP1 DUP4 GT PUSH2 0x472 JUMPI DUP3 SWAP1 SUB PUSH1 0x1F AND DUP3 ADD SWAP2 JUMPDEST POP POP POP POP POP SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x4A3 PUSH2 0xA50 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x4C1 PUSH2 0x779 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x517 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x50E SWAP1 PUSH2 0x22D4 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x532 DUP4 DUP4 DUP4 PUSH1 0x40 MLOAD DUP1 PUSH1 0x20 ADD PUSH1 0x40 MSTORE DUP1 PUSH1 0x0 DUP2 MSTORE POP PUSH2 0xA58 JUMP JUMPDEST POP POP POP JUMP JUMPDEST PUSH2 0x53F PUSH2 0xA50 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ DUP1 PUSH2 0x585 JUMPI POP PUSH2 0x584 DUP6 PUSH2 0x57F PUSH2 0xA50 JUMP JUMPDEST PUSH2 0x7B9 JUMP JUMPDEST JUMPDEST PUSH2 0x5C4 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x5BB SWAP1 PUSH2 0x2366 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x5D1 DUP6 DUP6 DUP6 DUP6 DUP6 PUSH2 0xBEE JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH1 0x60 DUP2 MLOAD DUP4 MLOAD EQ PUSH2 0x61E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x615 SWAP1 PUSH2 0x23F8 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 DUP4 MLOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x63B JUMPI PUSH2 0x63A PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST PUSH1 0x40 MLOAD SWAP1 DUP1 DUP3 MSTORE DUP1 PUSH1 0x20 MUL PUSH1 0x20 ADD DUP3 ADD PUSH1 0x40 MSTORE DUP1 ISZERO PUSH2 0x669 JUMPI DUP2 PUSH1 0x20 ADD PUSH1 0x20 DUP3 MUL DUP1 CALLDATASIZE DUP4 CALLDATACOPY DUP1 DUP3 ADD SWAP2 POP POP SWAP1 POP JUMPDEST POP SWAP1 POP PUSH1 0x0 JUMPDEST DUP5 MLOAD DUP2 LT ISZERO PUSH2 0x6E6 JUMPI PUSH2 0x6B6 DUP6 DUP3 DUP2 MLOAD DUP2 LT PUSH2 0x68E JUMPI PUSH2 0x68D PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD MLOAD DUP6 DUP4 DUP2 MLOAD DUP2 LT PUSH2 0x6A9 JUMPI PUSH2 0x6A8 PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD MLOAD PUSH2 0x25C JUMP JUMPDEST DUP3 DUP3 DUP2 MLOAD DUP2 LT PUSH2 0x6C9 JUMPI PUSH2 0x6C8 PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD DUP2 DUP2 MSTORE POP POP DUP1 PUSH2 0x6DF SWAP1 PUSH2 0x2476 JUMP JUMPDEST SWAP1 POP PUSH2 0x66F JUMP JUMPDEST POP DUP1 SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x6F9 PUSH2 0xA50 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x717 PUSH2 0x779 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x76D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x764 SWAP1 PUSH2 0x22D4 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x777 PUSH1 0x0 PUSH2 0xF02 JUMP JUMPDEST JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP SWAP1 JUMP JUMPDEST PUSH2 0x7B5 PUSH2 0x7AE PUSH2 0xA50 JUMP JUMPDEST DUP4 DUP4 PUSH2 0xFC8 JUMP JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x1 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH1 0xFF AND SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x855 PUSH2 0xA50 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ DUP1 PUSH2 0x89B JUMPI POP PUSH2 0x89A DUP6 PUSH2 0x895 PUSH2 0xA50 JUMP JUMPDEST PUSH2 0x7B9 JUMP JUMPDEST JUMPDEST PUSH2 0x8DA JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x8D1 SWAP1 PUSH2 0x2531 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x8E7 DUP6 DUP6 DUP6 DUP6 DUP6 PUSH2 0x1135 JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST PUSH2 0x8F6 PUSH2 0xA50 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x914 PUSH2 0x779 JUMP JUMPDEST PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ PUSH2 0x96A JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x961 SWAP1 PUSH2 0x22D4 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x9DA JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x9D1 SWAP1 PUSH2 0x25C3 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH2 0x9E3 DUP2 PUSH2 0xF02 JUMP JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0x1FFC9A700000000000000000000000000000000000000000000000000000000 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND DUP3 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND EQ SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 CALLER SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0xAC8 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xABF SWAP1 PUSH2 0x2655 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0xAD2 PUSH2 0xA50 JUMP JUMPDEST SWAP1 POP PUSH2 0xAF3 DUP2 PUSH1 0x0 DUP8 PUSH2 0xAE4 DUP9 PUSH2 0x13B7 JUMP JUMPDEST PUSH2 0xAED DUP9 PUSH2 0x13B7 JUMP JUMPDEST DUP8 PUSH2 0x1431 JUMP JUMPDEST DUP3 PUSH1 0x0 DUP1 DUP7 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0xB52 SWAP2 SWAP1 PUSH2 0x2675 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xC3D58168C5AE7397731D063D5BBF3D657854427343F4C083240F7AACAA2D0F62 DUP8 DUP8 PUSH1 0x40 MLOAD PUSH2 0xBD0 SWAP3 SWAP2 SWAP1 PUSH2 0x26CB JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG4 PUSH2 0xBE7 DUP2 PUSH1 0x0 DUP8 DUP8 DUP8 DUP8 PUSH2 0x1439 JUMP JUMPDEST POP POP POP POP POP JUMP JUMPDEST DUP2 MLOAD DUP4 MLOAD EQ PUSH2 0xC32 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xC29 SWAP1 PUSH2 0x2766 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0xCA2 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xC99 SWAP1 PUSH2 0x27F8 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0xCAC PUSH2 0xA50 JUMP JUMPDEST SWAP1 POP PUSH2 0xCBC DUP2 DUP8 DUP8 DUP8 DUP8 DUP8 PUSH2 0x1431 JUMP JUMPDEST PUSH1 0x0 JUMPDEST DUP5 MLOAD DUP2 LT ISZERO PUSH2 0xE6D JUMPI PUSH1 0x0 DUP6 DUP3 DUP2 MLOAD DUP2 LT PUSH2 0xCDD JUMPI PUSH2 0xCDC PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD MLOAD SWAP1 POP PUSH1 0x0 DUP6 DUP4 DUP2 MLOAD DUP2 LT PUSH2 0xCFC JUMPI PUSH2 0xCFB PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD MLOAD SWAP1 POP PUSH1 0x0 DUP1 PUSH1 0x0 DUP5 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP DUP2 DUP2 LT ISZERO PUSH2 0xD9D JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0xD94 SWAP1 PUSH2 0x288A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP2 DUP2 SUB PUSH1 0x0 DUP1 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP13 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP DUP2 PUSH1 0x0 DUP1 DUP6 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP12 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0xE52 SWAP2 SWAP1 PUSH2 0x2675 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP POP POP POP DUP1 PUSH2 0xE66 SWAP1 PUSH2 0x2476 JUMP JUMPDEST SWAP1 POP PUSH2 0xCBF JUMP JUMPDEST POP DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP7 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x4A39DC06D4C0DBC64B70AF90FD698A233A518AA5D07E595D983B8C0526C8F7FB DUP8 DUP8 PUSH1 0x40 MLOAD PUSH2 0xEE4 SWAP3 SWAP2 SWAP1 PUSH2 0x28AA JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG4 PUSH2 0xEFA DUP2 DUP8 DUP8 DUP8 DUP8 DUP8 PUSH2 0x1611 JUMP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 POP DUP2 PUSH1 0x3 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x8BE0079C531659141344CD1FD0A4F28419497F9722A3DAAFE3B4186F6B6457E0 PUSH1 0x40 MLOAD PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP JUMP JUMPDEST DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x1037 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x102E SWAP1 PUSH2 0x2953 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP1 PUSH1 0x1 PUSH1 0x0 DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH1 0xFF MUL NOT AND SWAP1 DUP4 ISZERO ISZERO MUL OR SWAP1 SSTORE POP DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x17307EAB39AB6107E8899845AD3D59BD9653F200F220920489CA2B5937696C31 DUP4 PUSH1 0x40 MLOAD PUSH2 0x1128 SWAP2 SWAP1 PUSH2 0x19BE JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG3 POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO PUSH2 0x11A5 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x119C SWAP1 PUSH2 0x27F8 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x11AF PUSH2 0xA50 JUMP JUMPDEST SWAP1 POP PUSH2 0x11CF DUP2 DUP8 DUP8 PUSH2 0x11C0 DUP9 PUSH2 0x13B7 JUMP JUMPDEST PUSH2 0x11C9 DUP9 PUSH2 0x13B7 JUMP JUMPDEST DUP8 PUSH2 0x1431 JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP7 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP9 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 SLOAD SWAP1 POP DUP4 DUP2 LT ISZERO PUSH2 0x1266 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x125D SWAP1 PUSH2 0x288A JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP4 DUP2 SUB PUSH1 0x0 DUP1 DUP8 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP10 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 DUP2 SWAP1 SSTORE POP DUP4 PUSH1 0x0 DUP1 DUP8 DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP9 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH1 0x0 KECCAK256 PUSH1 0x0 DUP3 DUP3 SLOAD PUSH2 0x131B SWAP2 SWAP1 PUSH2 0x2675 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP DUP6 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP8 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xC3D58168C5AE7397731D063D5BBF3D657854427343F4C083240F7AACAA2D0F62 DUP9 DUP9 PUSH1 0x40 MLOAD PUSH2 0x1398 SWAP3 SWAP2 SWAP1 PUSH2 0x26CB JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG4 PUSH2 0x13AE DUP3 DUP9 DUP9 DUP9 DUP9 DUP9 PUSH2 0x1439 JUMP JUMPDEST POP POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x60 PUSH1 0x0 PUSH1 0x1 PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x13D6 JUMPI PUSH2 0x13D5 PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST PUSH1 0x40 MLOAD SWAP1 DUP1 DUP3 MSTORE DUP1 PUSH1 0x20 MUL PUSH1 0x20 ADD DUP3 ADD PUSH1 0x40 MSTORE DUP1 ISZERO PUSH2 0x1404 JUMPI DUP2 PUSH1 0x20 ADD PUSH1 0x20 DUP3 MUL DUP1 CALLDATASIZE DUP4 CALLDATACOPY DUP1 DUP3 ADD SWAP2 POP POP SWAP1 POP JUMPDEST POP SWAP1 POP DUP3 DUP2 PUSH1 0x0 DUP2 MLOAD DUP2 LT PUSH2 0x141C JUMPI PUSH2 0x141B PUSH2 0x2418 JUMP JUMPDEST JUMPDEST PUSH1 0x20 MUL PUSH1 0x20 ADD ADD DUP2 DUP2 MSTORE POP POP DUP1 SWAP2 POP POP SWAP2 SWAP1 POP JUMP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH2 0x1458 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x17E9 JUMP JUMPDEST ISZERO PUSH2 0x1609 JUMPI DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xF23A6E61 DUP8 DUP8 DUP7 DUP7 DUP7 PUSH1 0x40 MLOAD DUP7 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x149E SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x29C8 JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 GAS CALL SWAP3 POP POP POP DUP1 ISZERO PUSH2 0x14DA JUMPI POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x14D7 SWAP2 SWAP1 PUSH2 0x2A37 JUMP JUMPDEST PUSH1 0x1 JUMPDEST PUSH2 0x1580 JUMPI PUSH2 0x14E6 PUSH2 0x2A71 JUMP JUMPDEST DUP1 PUSH4 0x8C379A0 EQ ISZERO PUSH2 0x1543 JUMPI POP PUSH2 0x14FB PUSH2 0x2A93 JUMP JUMPDEST DUP1 PUSH2 0x1506 JUMPI POP PUSH2 0x1545 JUMP JUMPDEST DUP1 PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x153A SWAP2 SWAP1 PUSH2 0x1A9F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1577 SWAP1 PUSH2 0x2B9B JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH4 0xF23A6E61 PUSH1 0xE0 SHL PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND DUP2 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND EQ PUSH2 0x1607 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x15FE SWAP1 PUSH2 0x2C2D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH2 0x1630 DUP5 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x17E9 JUMP JUMPDEST ISZERO PUSH2 0x17E1 JUMPI DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH4 0xBC197C81 DUP8 DUP8 DUP7 DUP7 DUP7 PUSH1 0x40 MLOAD DUP7 PUSH4 0xFFFFFFFF AND PUSH1 0xE0 SHL DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1676 SWAP6 SWAP5 SWAP4 SWAP3 SWAP2 SWAP1 PUSH2 0x2C4D JUMP JUMPDEST PUSH1 0x20 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 PUSH1 0x0 DUP8 GAS CALL SWAP3 POP POP POP DUP1 ISZERO PUSH2 0x16B2 JUMPI POP PUSH1 0x40 MLOAD RETURNDATASIZE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND DUP3 ADD DUP1 PUSH1 0x40 MSTORE POP DUP2 ADD SWAP1 PUSH2 0x16AF SWAP2 SWAP1 PUSH2 0x2A37 JUMP JUMPDEST PUSH1 0x1 JUMPDEST PUSH2 0x1758 JUMPI PUSH2 0x16BE PUSH2 0x2A71 JUMP JUMPDEST DUP1 PUSH4 0x8C379A0 EQ ISZERO PUSH2 0x171B JUMPI POP PUSH2 0x16D3 PUSH2 0x2A93 JUMP JUMPDEST DUP1 PUSH2 0x16DE JUMPI POP PUSH2 0x171D JUMP JUMPDEST DUP1 PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x1712 SWAP2 SWAP1 PUSH2 0x1A9F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP JUMPDEST PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x174F SWAP1 PUSH2 0x2B9B JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH4 0xBC197C81 PUSH1 0xE0 SHL PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND DUP2 PUSH28 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF NOT AND EQ PUSH2 0x17DF JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x17D6 SWAP1 PUSH2 0x2C2D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST POP JUMPDEST POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EXTCODESIZE GT SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 MLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x184B DUP3 PUSH2 0x1820 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x185B DUP2 PUSH2 0x1840 JUMP JUMPDEST DUP2 EQ PUSH2 0x1866 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1878 DUP2 PUSH2 0x1852 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1891 DUP2 PUSH2 0x187E JUMP JUMPDEST DUP2 EQ PUSH2 0x189C JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x18AE DUP2 PUSH2 0x1888 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x18CB JUMPI PUSH2 0x18CA PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x18D9 DUP6 DUP3 DUP7 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x18EA DUP6 DUP3 DUP7 ADD PUSH2 0x189F JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH2 0x18FD DUP2 PUSH2 0x187E JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x1918 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x18F4 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH32 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000 DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1953 DUP2 PUSH2 0x191E JUMP JUMPDEST DUP2 EQ PUSH2 0x195E JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x1970 DUP2 PUSH2 0x194A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x198C JUMPI PUSH2 0x198B PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x199A DUP5 DUP3 DUP6 ADD PUSH2 0x1961 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 ISZERO ISZERO SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x19B8 DUP2 PUSH2 0x19A3 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x19D3 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x19AF JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x19EF JUMPI PUSH2 0x19EE PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x19FD DUP5 DUP3 DUP6 ADD PUSH2 0x189F JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x1A40 JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x1A25 JUMP JUMPDEST DUP4 DUP2 GT ISZERO PUSH2 0x1A4F JUMPI PUSH1 0x0 DUP5 DUP5 ADD MSTORE JUMPDEST POP POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x1F NOT PUSH1 0x1F DUP4 ADD AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1A71 DUP3 PUSH2 0x1A06 JUMP JUMPDEST PUSH2 0x1A7B DUP2 DUP6 PUSH2 0x1A11 JUMP JUMPDEST SWAP4 POP PUSH2 0x1A8B DUP2 DUP6 PUSH1 0x20 DUP7 ADD PUSH2 0x1A22 JUMP JUMPDEST PUSH2 0x1A94 DUP2 PUSH2 0x1A55 JUMP JUMPDEST DUP5 ADD SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1AB9 DUP2 DUP5 PUSH2 0x1A66 JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0x60 DUP5 DUP7 SUB SLT ISZERO PUSH2 0x1ADA JUMPI PUSH2 0x1AD9 PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x1AE8 DUP7 DUP3 DUP8 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP4 POP POP PUSH1 0x20 PUSH2 0x1AF9 DUP7 DUP3 DUP8 ADD PUSH2 0x189F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x40 PUSH2 0x1B0A DUP7 DUP3 DUP8 ADD PUSH2 0x189F JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 POP SWAP3 JUMP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x41 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH2 0x1B51 DUP3 PUSH2 0x1A55 JUMP JUMPDEST DUP2 ADD DUP2 DUP2 LT PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT OR ISZERO PUSH2 0x1B70 JUMPI PUSH2 0x1B6F PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST DUP1 PUSH1 0x40 MSTORE POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1B83 PUSH2 0x180C JUMP JUMPDEST SWAP1 POP PUSH2 0x1B8F DUP3 DUP3 PUSH2 0x1B48 JUMP JUMPDEST SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT ISZERO PUSH2 0x1BAF JUMPI PUSH2 0x1BAE PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST PUSH1 0x20 DUP3 MUL SWAP1 POP PUSH1 0x20 DUP2 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x1BD8 PUSH2 0x1BD3 DUP5 PUSH2 0x1B94 JUMP JUMPDEST PUSH2 0x1B79 JUMP JUMPDEST SWAP1 POP DUP1 DUP4 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH1 0x20 DUP5 MUL DUP4 ADD DUP6 DUP2 GT ISZERO PUSH2 0x1BFB JUMPI PUSH2 0x1BFA PUSH2 0x1BC0 JUMP JUMPDEST JUMPDEST DUP4 JUMPDEST DUP2 DUP2 LT ISZERO PUSH2 0x1C24 JUMPI DUP1 PUSH2 0x1C10 DUP9 DUP3 PUSH2 0x189F JUMP JUMPDEST DUP5 MSTORE PUSH1 0x20 DUP5 ADD SWAP4 POP POP PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x1BFD JUMP JUMPDEST POP POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 PUSH1 0x1F DUP4 ADD SLT PUSH2 0x1C43 JUMPI PUSH2 0x1C42 PUSH2 0x1B14 JUMP JUMPDEST JUMPDEST DUP2 CALLDATALOAD PUSH2 0x1C53 DUP5 DUP3 PUSH1 0x20 DUP7 ADD PUSH2 0x1BC5 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT ISZERO PUSH2 0x1C7C JUMPI PUSH2 0x1C7B PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST PUSH2 0x1C85 DUP3 PUSH2 0x1A55 JUMP JUMPDEST SWAP1 POP PUSH1 0x20 DUP2 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST DUP3 DUP2 DUP4 CALLDATACOPY PUSH1 0x0 DUP4 DUP4 ADD MSTORE POP POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1CB4 PUSH2 0x1CAF DUP5 PUSH2 0x1C61 JUMP JUMPDEST PUSH2 0x1B79 JUMP JUMPDEST SWAP1 POP DUP3 DUP2 MSTORE PUSH1 0x20 DUP2 ADD DUP5 DUP5 DUP5 ADD GT ISZERO PUSH2 0x1CD0 JUMPI PUSH2 0x1CCF PUSH2 0x1C5C JUMP JUMPDEST JUMPDEST PUSH2 0x1CDB DUP5 DUP3 DUP6 PUSH2 0x1C92 JUMP JUMPDEST POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 PUSH1 0x1F DUP4 ADD SLT PUSH2 0x1CF8 JUMPI PUSH2 0x1CF7 PUSH2 0x1B14 JUMP JUMPDEST JUMPDEST DUP2 CALLDATALOAD PUSH2 0x1D08 DUP5 DUP3 PUSH1 0x20 DUP7 ADD PUSH2 0x1CA1 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0xA0 DUP7 DUP9 SUB SLT ISZERO PUSH2 0x1D2D JUMPI PUSH2 0x1D2C PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x1D3B DUP9 DUP3 DUP10 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP6 POP POP PUSH1 0x20 PUSH2 0x1D4C DUP9 DUP3 DUP10 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP5 POP POP PUSH1 0x40 DUP7 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x1D6D JUMPI PUSH2 0x1D6C PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x1D79 DUP9 DUP3 DUP10 ADD PUSH2 0x1C2E JUMP JUMPDEST SWAP4 POP POP PUSH1 0x60 DUP7 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x1D9A JUMPI PUSH2 0x1D99 PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x1DA6 DUP9 DUP3 DUP10 ADD PUSH2 0x1C2E JUMP JUMPDEST SWAP3 POP POP PUSH1 0x80 DUP7 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x1DC7 JUMPI PUSH2 0x1DC6 PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x1DD3 DUP9 DUP3 DUP10 ADD PUSH2 0x1CE3 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 POP SWAP3 SWAP6 SWAP1 SWAP4 POP JUMP JUMPDEST PUSH1 0x0 PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT ISZERO PUSH2 0x1DFB JUMPI PUSH2 0x1DFA PUSH2 0x1B19 JUMP JUMPDEST JUMPDEST PUSH1 0x20 DUP3 MUL SWAP1 POP PUSH1 0x20 DUP2 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1E1F PUSH2 0x1E1A DUP5 PUSH2 0x1DE0 JUMP JUMPDEST PUSH2 0x1B79 JUMP JUMPDEST SWAP1 POP DUP1 DUP4 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH1 0x20 DUP5 MUL DUP4 ADD DUP6 DUP2 GT ISZERO PUSH2 0x1E42 JUMPI PUSH2 0x1E41 PUSH2 0x1BC0 JUMP JUMPDEST JUMPDEST DUP4 JUMPDEST DUP2 DUP2 LT ISZERO PUSH2 0x1E6B JUMPI DUP1 PUSH2 0x1E57 DUP9 DUP3 PUSH2 0x1869 JUMP JUMPDEST DUP5 MSTORE PUSH1 0x20 DUP5 ADD SWAP4 POP POP PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x1E44 JUMP JUMPDEST POP POP POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP3 PUSH1 0x1F DUP4 ADD SLT PUSH2 0x1E8A JUMPI PUSH2 0x1E89 PUSH2 0x1B14 JUMP JUMPDEST JUMPDEST DUP2 CALLDATALOAD PUSH2 0x1E9A DUP5 DUP3 PUSH1 0x20 DUP7 ADD PUSH2 0x1E0C JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x1EBA JUMPI PUSH2 0x1EB9 PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 DUP4 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x1ED8 JUMPI PUSH2 0x1ED7 PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x1EE4 DUP6 DUP3 DUP7 ADD PUSH2 0x1E75 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 DUP4 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x1F05 JUMPI PUSH2 0x1F04 PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x1F11 DUP6 DUP3 DUP7 ADD PUSH2 0x1C2E JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x1F50 DUP2 PUSH2 0x187E JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F62 DUP4 DUP4 PUSH2 0x1F47 JUMP JUMPDEST PUSH1 0x20 DUP4 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x1F86 DUP3 PUSH2 0x1F1B JUMP JUMPDEST PUSH2 0x1F90 DUP2 DUP6 PUSH2 0x1F26 JUMP JUMPDEST SWAP4 POP PUSH2 0x1F9B DUP4 PUSH2 0x1F37 JUMP JUMPDEST DUP1 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x1FCC JUMPI DUP2 MLOAD PUSH2 0x1FB3 DUP9 DUP3 PUSH2 0x1F56 JUMP JUMPDEST SWAP8 POP PUSH2 0x1FBE DUP4 PUSH2 0x1F6E JUMP JUMPDEST SWAP3 POP POP PUSH1 0x1 DUP2 ADD SWAP1 POP PUSH2 0x1F9F JUMP JUMPDEST POP DUP6 SWAP4 POP POP POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x1FF3 DUP2 DUP5 PUSH2 0x1F7B JUMP JUMPDEST SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x2004 DUP2 PUSH2 0x1840 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x201F PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x1FFB JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH2 0x202E DUP2 PUSH2 0x19A3 JUMP JUMPDEST DUP2 EQ PUSH2 0x2039 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH1 0x0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x204B DUP2 PUSH2 0x2025 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x2068 JUMPI PUSH2 0x2067 PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x2076 DUP6 DUP3 DUP7 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x2087 DUP6 DUP3 DUP7 ADD PUSH2 0x203C JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x40 DUP4 DUP6 SUB SLT ISZERO PUSH2 0x20A8 JUMPI PUSH2 0x20A7 PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x20B6 DUP6 DUP3 DUP7 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP3 POP POP PUSH1 0x20 PUSH2 0x20C7 DUP6 DUP3 DUP7 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP2 POP POP SWAP3 POP SWAP3 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x0 DUP1 PUSH1 0x0 PUSH1 0xA0 DUP7 DUP9 SUB SLT ISZERO PUSH2 0x20ED JUMPI PUSH2 0x20EC PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x20FB DUP9 DUP3 DUP10 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP6 POP POP PUSH1 0x20 PUSH2 0x210C DUP9 DUP3 DUP10 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP5 POP POP PUSH1 0x40 PUSH2 0x211D DUP9 DUP3 DUP10 ADD PUSH2 0x189F JUMP JUMPDEST SWAP4 POP POP PUSH1 0x60 PUSH2 0x212E DUP9 DUP3 DUP10 ADD PUSH2 0x189F JUMP JUMPDEST SWAP3 POP POP PUSH1 0x80 DUP7 ADD CALLDATALOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x214F JUMPI PUSH2 0x214E PUSH2 0x181B JUMP JUMPDEST JUMPDEST PUSH2 0x215B DUP9 DUP3 DUP10 ADD PUSH2 0x1CE3 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP6 POP SWAP3 SWAP6 SWAP1 SWAP4 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x217E JUMPI PUSH2 0x217D PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x218C DUP5 DUP3 DUP6 ADD PUSH2 0x1869 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x455243313135353A2062616C616E636520717565727920666F7220746865207A PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x65726F2061646472657373000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x21F1 PUSH1 0x2B DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x21FC DUP3 PUSH2 0x2195 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2220 DUP2 PUSH2 0x21E4 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x22 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH1 0x0 PUSH1 0x2 DUP3 DIV SWAP1 POP PUSH1 0x1 DUP3 AND DUP1 PUSH2 0x226E JUMPI PUSH1 0x7F DUP3 AND SWAP2 POP JUMPDEST PUSH1 0x20 DUP3 LT DUP2 EQ ISZERO PUSH2 0x2282 JUMPI PUSH2 0x2281 PUSH2 0x2227 JUMP JUMPDEST JUMPDEST POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4F776E61626C653A2063616C6C6572206973206E6F7420746865206F776E6572 PUSH1 0x0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x22BE PUSH1 0x20 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x22C9 DUP3 PUSH2 0x2288 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x22ED DUP2 PUSH2 0x22B1 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A207472616E736665722063616C6C6572206973206E6F7420 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x6F776E6572206E6F7220617070726F7665640000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2350 PUSH1 0x32 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x235B DUP3 PUSH2 0x22F4 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x237F DUP2 PUSH2 0x2343 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A206163636F756E747320616E6420696473206C656E677468 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x206D69736D617463680000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x23E2 PUSH1 0x29 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x23ED DUP3 PUSH2 0x2386 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2411 DUP2 PUSH2 0x23D5 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x32 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH1 0x0 PUSH2 0x2481 DUP3 PUSH2 0x187E JUMP JUMPDEST SWAP2 POP PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 EQ ISZERO PUSH2 0x24B4 JUMPI PUSH2 0x24B3 PUSH2 0x2447 JUMP JUMPDEST JUMPDEST PUSH1 0x1 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A2063616C6C6572206973206E6F74206F776E6572206E6F72 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x20617070726F7665640000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x251B PUSH1 0x29 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x2526 DUP3 PUSH2 0x24BF JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x254A DUP2 PUSH2 0x250E JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4F776E61626C653A206E6577206F776E657220697320746865207A65726F2061 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x6464726573730000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x25AD PUSH1 0x26 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x25B8 DUP3 PUSH2 0x2551 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x25DC DUP2 PUSH2 0x25A0 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A206D696E7420746F20746865207A65726F20616464726573 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x7300000000000000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x263F PUSH1 0x21 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x264A DUP3 PUSH2 0x25E3 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x266E DUP2 PUSH2 0x2632 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2680 DUP3 PUSH2 0x187E JUMP JUMPDEST SWAP2 POP PUSH2 0x268B DUP4 PUSH2 0x187E JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0x26C0 JUMPI PUSH2 0x26BF PUSH2 0x2447 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP PUSH2 0x26E0 PUSH1 0x0 DUP4 ADD DUP6 PUSH2 0x18F4 JUMP JUMPDEST PUSH2 0x26ED PUSH1 0x20 DUP4 ADD DUP5 PUSH2 0x18F4 JUMP JUMPDEST SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH32 0x455243313135353A2069647320616E6420616D6F756E7473206C656E67746820 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x6D69736D61746368000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2750 PUSH1 0x28 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x275B DUP3 PUSH2 0x26F4 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x277F DUP2 PUSH2 0x2743 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A207472616E7366657220746F20746865207A65726F206164 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x6472657373000000000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x27E2 PUSH1 0x25 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x27ED DUP3 PUSH2 0x2786 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2811 DUP2 PUSH2 0x27D5 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A20696E73756666696369656E742062616C616E636520666F PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x72207472616E7366657200000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2874 PUSH1 0x2A DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x287F DUP3 PUSH2 0x2818 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x28A3 DUP2 PUSH2 0x2867 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x40 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x28C4 DUP2 DUP6 PUSH2 0x1F7B JUMP JUMPDEST SWAP1 POP DUP2 DUP2 SUB PUSH1 0x20 DUP4 ADD MSTORE PUSH2 0x28D8 DUP2 DUP5 PUSH2 0x1F7B JUMP JUMPDEST SWAP1 POP SWAP4 SWAP3 POP POP POP JUMP JUMPDEST PUSH32 0x455243313135353A2073657474696E6720617070726F76616C20737461747573 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x20666F722073656C660000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x293D PUSH1 0x29 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x2948 DUP3 PUSH2 0x28E1 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x296C DUP2 PUSH2 0x2930 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x299A DUP3 PUSH2 0x2973 JUMP JUMPDEST PUSH2 0x29A4 DUP2 DUP6 PUSH2 0x297E JUMP JUMPDEST SWAP4 POP PUSH2 0x29B4 DUP2 DUP6 PUSH1 0x20 DUP7 ADD PUSH2 0x1A22 JUMP JUMPDEST PUSH2 0x29BD DUP2 PUSH2 0x1A55 JUMP JUMPDEST DUP5 ADD SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xA0 DUP3 ADD SWAP1 POP PUSH2 0x29DD PUSH1 0x0 DUP4 ADD DUP9 PUSH2 0x1FFB JUMP JUMPDEST PUSH2 0x29EA PUSH1 0x20 DUP4 ADD DUP8 PUSH2 0x1FFB JUMP JUMPDEST PUSH2 0x29F7 PUSH1 0x40 DUP4 ADD DUP7 PUSH2 0x18F4 JUMP JUMPDEST PUSH2 0x2A04 PUSH1 0x60 DUP4 ADD DUP6 PUSH2 0x18F4 JUMP JUMPDEST DUP2 DUP2 SUB PUSH1 0x80 DUP4 ADD MSTORE PUSH2 0x2A16 DUP2 DUP5 PUSH2 0x298F JUMP JUMPDEST SWAP1 POP SWAP7 SWAP6 POP POP POP POP POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 MLOAD SWAP1 POP PUSH2 0x2A31 DUP2 PUSH2 0x194A JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x2A4D JUMPI PUSH2 0x2A4C PUSH2 0x1816 JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0x2A5B DUP5 DUP3 DUP6 ADD PUSH2 0x2A22 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 PUSH1 0xE0 SHR SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x3 RETURNDATASIZE GT ISZERO PUSH2 0x2A90 JUMPI PUSH1 0x4 PUSH1 0x0 DUP1 RETURNDATACOPY PUSH2 0x2A8D PUSH1 0x0 MLOAD PUSH2 0x2A64 JUMP JUMPDEST SWAP1 POP JUMPDEST SWAP1 JUMP JUMPDEST PUSH1 0x0 PUSH1 0x44 RETURNDATASIZE LT ISZERO PUSH2 0x2AA3 JUMPI PUSH2 0x2B26 JUMP JUMPDEST PUSH2 0x2AAB PUSH2 0x180C JUMP JUMPDEST PUSH1 0x4 RETURNDATASIZE SUB PUSH1 0x4 DUP3 RETURNDATACOPY DUP1 MLOAD RETURNDATASIZE PUSH1 0x24 DUP3 ADD GT PUSH8 0xFFFFFFFFFFFFFFFF DUP3 GT OR ISZERO PUSH2 0x2AD3 JUMPI POP POP PUSH2 0x2B26 JUMP JUMPDEST DUP1 DUP3 ADD DUP1 MLOAD PUSH8 0xFFFFFFFFFFFFFFFF DUP2 GT ISZERO PUSH2 0x2AF1 JUMPI POP POP POP POP PUSH2 0x2B26 JUMP JUMPDEST DUP1 PUSH1 0x20 DUP4 ADD ADD PUSH1 0x4 RETURNDATASIZE SUB DUP6 ADD DUP2 GT ISZERO PUSH2 0x2B0E JUMPI POP POP POP POP POP PUSH2 0x2B26 JUMP JUMPDEST PUSH2 0x2B1D DUP3 PUSH1 0x20 ADD DUP6 ADD DUP7 PUSH2 0x1B48 JUMP JUMPDEST DUP3 SWAP6 POP POP POP POP POP POP JUMPDEST SWAP1 JUMP JUMPDEST PUSH32 0x455243313135353A207472616E7366657220746F206E6F6E2045524331313535 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x526563656976657220696D706C656D656E746572000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2B85 PUSH1 0x34 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x2B90 DUP3 PUSH2 0x2B29 JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2BB4 DUP2 PUSH2 0x2B78 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x455243313135353A204552433131353552656365697665722072656A65637465 PUSH1 0x0 DUP3 ADD MSTORE PUSH32 0x6420746F6B656E73000000000000000000000000000000000000000000000000 PUSH1 0x20 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0x2C17 PUSH1 0x28 DUP4 PUSH2 0x1A11 JUMP JUMPDEST SWAP2 POP PUSH2 0x2C22 DUP3 PUSH2 0x2BBB JUMP JUMPDEST PUSH1 0x40 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH1 0x0 DUP4 ADD MSTORE PUSH2 0x2C46 DUP2 PUSH2 0x2C0A JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0xA0 DUP3 ADD SWAP1 POP PUSH2 0x2C62 PUSH1 0x0 DUP4 ADD DUP9 PUSH2 0x1FFB JUMP JUMPDEST PUSH2 0x2C6F PUSH1 0x20 DUP4 ADD DUP8 PUSH2 0x1FFB JUMP JUMPDEST DUP2 DUP2 SUB PUSH1 0x40 DUP4 ADD MSTORE PUSH2 0x2C81 DUP2 DUP7 PUSH2 0x1F7B JUMP JUMPDEST SWAP1 POP DUP2 DUP2 SUB PUSH1 0x60 DUP4 ADD MSTORE PUSH2 0x2C95 DUP2 DUP6 PUSH2 0x1F7B JUMP JUMPDEST SWAP1 POP DUP2 DUP2 SUB PUSH1 0x80 DUP4 ADD MSTORE PUSH2 0x2CA9 DUP2 DUP5 PUSH2 0x298F JUMP JUMPDEST SWAP1 POP SWAP7 SWAP6 POP POP POP POP POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 0xA5 0xD EXP EQ 0xEF 0xC1 0xA8 SMOD CODECOPY SHL PUSH17 0xC6E98ADDFF56C4502C2611B1D2483349DE 0xC7 PUSH3 0xC40064 PUSH20 0x6F6C634300080A0033697066733A2F2F516D5344 MSIZE GAS COINBASE JUMP PUSH15 0x5966617345434238346D6E41594B61 PC 0x4A MLOAD PUSH26 0x53424674365936316D554443674B5766324E2F7B69647D2E6A73 PUSH16 0x6E000000000000000000000000000000 ',
        sourceMap:
            '177:301:9:-:0;;;225:91;;;;;;;;;;1092:62:1;;;;;;;;;;;;;;;;;1134:13;1142:4;1134:7;;;:13;;:::i;:::-;1092:62;921:32:0;940:12;:10;;;:12;;:::i;:::-;921:18;;;:32;;:::i;:::-;177:301:9;;7936:86:1;8009:6;8002:4;:13;;;;;;;;;;;;:::i;:::-;;7936:86;:::o;640:96:6:-;693:7;719:10;712:17;;640:96;:::o;2270:187:0:-;2343:16;2362:6;;;;;;;;;;;2343:25;;2387:8;2378:6;;:17;;;;;;;;;;;;;;;;;;2441:8;2410:40;;2431:8;2410:40;;;;;;;;;;;;2333:124;2270:187;:::o;177:301:9:-;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;:::o;7:180:10:-;55:77;52:1;45:88;152:4;149:1;142:15;176:4;173:1;166:15;193:320;237:6;274:1;268:4;264:12;254:22;;321:1;315:4;311:12;342:18;332:81;;398:4;390:6;386:17;376:27;;332:81;460:2;452:6;449:14;429:18;426:38;423:84;;;479:18;;:::i;:::-;423:84;244:269;193:320;;;:::o;177:301:9:-;;;;;;;',
    };
    //factory = new ethers.ContractFactory(abi, bytecode, signer);

    const contract_factory = new ContractFactory(_abi, _bytecode, governance);
    const contract = await contract_factory.deploy();

    //mint from user1
    await waitForTx(contract.mint(user.address, 1, 1));
    //mint from user2
    //await waitForTx(contract.mint(user2.address, 1, 1));

    // Unpause the contract
    await waitForTx(lensHub.setState(ProtocolState.Unpaused));

    // Whitelist user to create a profile
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));
    await waitForTx(lensHub.whitelistProfileCreator(user2.address, true));

    //deploy the module contract
    const erc1155TokenGatedReferenceModule = await deployContract(
        new Erc1155TokenGatedReferenceModule__factory(governance).deploy(lensHub.address)
    );
    await waitForTx(
        lensHub.whitelistReferenceModule(erc1155TokenGatedReferenceModule.address, true)
    );
    console.log(
        `Is Reference module whistelisted: ${await lensHub.isReferenceModuleWhitelisted(
            erc1155TokenGatedReferenceModule.address
        )}`
    );

    // 1- Profile1
    const inputProfilStruct: CreateProfileDataStruct = {
        to: user.address,
        handle: 'profile1',
        imageURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };
    await waitForTx(lensHub.connect(user).createProfile(inputProfilStruct));

    // 1- Profile2
    const inputProfilStruct2: CreateProfileDataStruct = {
        to: user2.address,
        handle: 'profile2',
        imageURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };
    await waitForTx(lensHub.connect(user2).createProfile(inputProfilStruct2));

    // 2- Normal post
    // Whitelist of free collect module
    const freeCollectModuleAddr = addrs['free collect module'];
    await waitForTx(lensHub.whitelistCollectModule(freeCollectModuleAddr, true));

    const inputPostNormalStruct: PostDataStruct = {
        profileId: 1,
        contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    await waitForTx(lensHub.connect(user).post(inputPostNormalStruct));
    console.log(`Post normal from user1 : ${await lensHub.getPub(1, 1)}`);

    // 3- normal comment from user1
    const inputCommentNormalStructFromUser1: CommentDataStruct = {
        profileId: 1,
        contentURI: 'blabla11',
        profileIdPointed: 1,
        pubIdPointed: 1,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    try {
        await waitForTx(lensHub.connect(user).comment(inputCommentNormalStructFromUser1));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }
    console.log(`Comment normal from user1 on post from user1: ${await lensHub.getPub(1, 2)}`);

    // 3- normal comment from user2
    const inputCommentNormalStructFromUser2: CommentDataStruct = {
        profileId: 2,
        contentURI: 'blabla21',
        profileIdPointed: 1,
        pubIdPointed: 1,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    try {
        await waitForTx(lensHub.connect(user2).comment(inputCommentNormalStructFromUser2));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }
    console.log(`Comment normal from user2 on post from user1: ${await lensHub.getPub(2, 1)}`);


    // 4- Post with reference module : ERC1155 badges required
    const data = defaultAbiCoder.encode(
        ['address', 'uint256'],
        [contract.address, 1]
    );

    const inputPostStruct: PostDataStruct = {
        profileId: 1,
        contentURI: 'this is a private post with ERC1155 gated token required',
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: erc1155TokenGatedReferenceModule.address,
        referenceModuleInitData: data,
    };
    await waitForTx(lensHub.connect(user).post(inputPostStruct));
    console.log(`Post gated with ERC1155 sismo badge from user1 : ${await lensHub.getPub(1, 3)}`);

    console.log(`user1 : ${user.address}`);
    console.log(`erc1155TokenGatedReferenceModule.address : ${erc1155TokenGatedReferenceModule.address}`);
    console.log(`erc1155TokenGatedReferenceModule.tokenGatedAddress : ${await erc1155TokenGatedReferenceModule.tokenGatedAddress()}`);
    // 5- Comment from user1 who has token
    const data_comment_user1 = defaultAbiCoder.encode(['address'], [user.address]);
    const inputCommentStructFromUser1: CommentDataStruct = {
        profileId: 1,
        contentURI: 'blabla1 with token required',
        profileIdPointed: 1,
        pubIdPointed: 3,
        referenceModuleData: data_comment_user1,
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: erc1155TokenGatedReferenceModule.address,
        referenceModuleInitData: data,
    };
    try {
        await waitForTx(lensHub.connect(user).comment(inputCommentStructFromUser1));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }
    console.log(`Comment gated with ERC1155 sismo badge from user1 : ${await lensHub.getPub(1, 4)}`);

    // 5- Comment from user2 who has not token
    //const data_comment_user2 = defaultAbiCoder.encode(['address'], [user2.address]);
    const inputCommentStructFromUser2: CommentDataStruct = {
        profileId: 2,
        contentURI: 'blabla2 without token',
        profileIdPointed: 1,
        pubIdPointed: 3,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    try {
        await waitForTx(lensHub.connect(user2).comment(inputCommentStructFromUser2));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
        console.log(`Try Comment from user2 on post from user1: ${await lensHub.getPub(2, 3)}`);
    }
    


    // Comment with badge
    /**
 * defaultAbiCoder.encode(
            ['address', 'uint256'],
            [freeCollectModuleAddr, 1]
        )
 */

    /*const secretCodeFollowModule = await deployContract(
        new SecretCodeFollowModule__factory(governance).deploy(lensHub.address)
    );
    await waitForTx(lensHub.whitelistFollowModule(secretCodeFollowModule.address, true));

    const data = defaultAbiCoder.encode(['uint256'], ['42069']);
    await waitForTx(lensHub.connect(user).setFollowModule(1, secretCodeFollowModule.address, data));

    const badData = defaultAbiCoder.encode(['uint256'], ['1337']);

    try {
        await waitForTx(lensHub.connect(user).follow([1], [badData]));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }
    await waitForTx(lensHub.connect(user).follow([1], [data]));

    const followNFTAddr = await lensHub.getFollowNFT(1);
    const followNFT = FollowNFT__factory.connect(followNFTAddr, user);

    const totalSupply = await followNFT.totalSupply();
    const ownerOf = await followNFT.ownerOf(1);

    console.log(`Follow NFT total supply (should be 1): ${totalSupply}`);
    console.log(
        `Follow NFT owner of ID 1: ${ownerOf}, user address (should be the same): ${user.address}`
    );*/
});

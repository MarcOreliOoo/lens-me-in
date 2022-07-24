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

task('attestation2', 'tests the attestation2 module').setAction(async ({}, hre) => {
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

    const erc1155Token = await deployContract(new SismoBadges__factory().deploy());
    const contract = new Contract(erc1155Token.address, _abi, user);
    //mint from user1
    await waitForTx(contract.mint(user.address, 1, 1));
    //mint from user2
    await waitForTx(contract.mint(user2.address, 1, 1));



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
        `is Reference module whistelisted: ${await lensHub.isReferenceModuleWhitelisted(
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

	
    // 2- normal post
    // Whitelist of free collect module
    const freeCollectModuleAddr = addrs['free collect module'];
    await waitForTx(lensHub.whitelistCollectModule(freeCollectModuleAddr, true));

    //How to get profile ID ? and how to get Pub Id ? => byHandle
    const inputPostStruct: PostDataStruct = {
        profileId: 1,
        contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: erc1155TokenGatedReferenceModule.address,
        referenceModuleInitData: [],
    };
    await waitForTx(lensHub.connect(user).post(inputPostStruct));
    console.log(await lensHub.getPub(1, 1));



    // 3- normal comment from user1
    const inputCommentStructFromUser1: CommentDataStruct = {
        profileId: 1,
        contentURI: 'blabla1',
        profileIdPointed: 1,
        pubIdPointed: 1,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: erc1155TokenGatedReferenceModule.address,
        referenceModuleInitData: [],
    };
    try {
        await waitForTx(lensHub.connect(user).comment(inputCommentStructFromUser1));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }

    // 3- normal comment from user2
    const inputCommentStructFromUser2: CommentDataStruct = {
        profileId: 2,
        contentURI: 'blabla2',
        profileIdPointed: 1,
        pubIdPointed: 1,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: erc1155TokenGatedReferenceModule.address,
        referenceModuleInitData: [],
    };
    try {
        await waitForTx(lensHub.connect(user).comment(inputCommentStructFromUser2));
    } catch (e) {
        console.log(`Expected failure occurred! Error: ${e}`);
    }

    //How to get the id of a comment ?
    console.log(`Comment from user1 on post from user1: ${await lensHub.getPub(1, 2)}`);
    console.log(`Comment from user2 on post from user1: ${await lensHub.getPub(2, 1)}`);

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

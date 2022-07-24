import { defaultAbiCoder } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
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

/**
 * Task order :
 * 1- create a profile
 * 2- create a normal post
 * 3- create a comment
 * 4- create a post gated with token
 * 5- create a comment if user gated with token
 */

task('attestation', 'tests the attestation module').setAction(async ({}, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    // Unpause the contract
    await waitForTx(lensHub.setState(ProtocolState.Unpaused));

    // Whitelist user to create a profile
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));

    // 1- Profile
    const inputProfilStruct: CreateProfileDataStruct = {
        to: user.address,
        handle: 'profile0',
        imageURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };
    await waitForTx(lensHub.connect(user).createProfile(inputProfilStruct));

    // 2- normal post
    // Whitelist of free collect module
    const freeCollectModuleAddr = addrs['free collect module'];
    await waitForTx(lensHub.whitelistCollectModule(freeCollectModuleAddr, true));

    //How to get profile ID ? and how to get Pub Id ?
    const inputPostStruct: PostDataStruct = {
        profileId: 1,
        contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    await waitForTx(lensHub.connect(user).post(inputPostStruct));
    console.log(await lensHub.getPub(1, 1));

    // 3- normal comment
    const inputCommentStruct: CommentDataStruct = {
        profileId: 1,
        contentURI: 'blabla',
        profileIdPointed: 1,
        pubIdPointed: 1,
        referenceModuleData: [],
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };
    await waitForTx(lensHub.connect(user).comment(inputCommentStruct));

    //How to get the id of a comment ?
    console.log(await lensHub.getPub(1, 2));

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

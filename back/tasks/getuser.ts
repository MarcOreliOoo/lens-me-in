import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { getAddrs, initEnv, ProtocolState, waitForTx, ZERO_ADDRESS } from './helpers/utils';
import {
    CommentDataStruct,
    CreateProfileDataStruct,
    PostDataStruct,
} from '../typechain-types/LensHub';

task('getuser', 'get specific user').setAction(async ({}, hre) => {
    const [governance, , user, user2] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await waitForTx(lensHub.setState(ProtocolState.Unpaused));
    // Whitelist user to create a profile
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));
    const aName = 'profileazazzefegqg0';

    const inputProfilStruct: CreateProfileDataStruct = {
        to: user.address,
        handle: aName,
        imageURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI:
            'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };
    await waitForTx(lensHub.connect(user).createProfile(inputProfilStruct));

    const idUserByHandle = await lensHub.getProfileIdByHandle(aName);

    console.log(`id of the profile from address of the user, should be 1 : ${idUserByHandle}`);
});

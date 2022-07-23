import { defaultAbiCoder } from 'ethers/lib/utils';
import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { PostDataStruct } from '../typechain-types/LensHub';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';

task('post', 'publishes a post').setAction(async ({}, hre) => {
    const [governance, , user] = await initEnv(hre);
    const addrs = getAddrs();
    const freeCollectModuleAddr = addrs['free collect module'];
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await waitForTx(lensHub.whitelistCollectModule(freeCollectModuleAddr, true));

    const inputStruct: PostDataStruct = {
        profileId: 1,
        contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
        collectModule: freeCollectModuleAddr,
        collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
    };

    await waitForTx(lensHub.connect(user).post(inputStruct));
    console.log(await lensHub.getPub(1, 1));
});

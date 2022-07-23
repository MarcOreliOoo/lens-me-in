import { TransactionReceipt } from '@ethersproject/providers';
import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
import { TransparentUpgradeableProxy__factory } from '../../typechain-types';
import { MAX_UINT256, ZERO_ADDRESS } from '../helpers/constants';
import {
  getAbbreviation,
  getTimestamp,
  matchEvent,
  ProtocolState,
  waitForTx,
} from '../helpers/utils';
import {
  approvalFollowModule,
  deployer,
  deployerAddress,
  freeCollectModule,
  FIRST_PROFILE_ID,
  governance,
  governanceAddress,
  lensHub,
  lensHubImpl,
  LENS_HUB_NFT_NAME,
  LENS_HUB_NFT_SYMBOL,
  makeSuiteCleanRoom,
  MOCK_FOLLOW_NFT_URI,
  MOCK_PROFILE_HANDLE,
  MOCK_PROFILE_URI,
  MOCK_URI,
  moduleGlobals,
  treasuryAddress,
  TREASURY_FEE_BPS,
  user,
  userAddress,
  userTwo,
  userTwoAddress,
  abiCoder,
  feeCollectModule,
  currency,
} from '../__setup.spec';

/**
 * Note: We use the `lensHubImpl` contract to test ERC721 specific events.
 *
 * TODO: Add specific test cases to ensure all module encoded return data parameters are
 * as expected.
 *
 * TODO: Add module deployment tests.
 */
makeSuiteCleanRoom('Events', function () {
  let receipt: TransactionReceipt;

  context('Misc', function () {
    it('Proxy initialization should emit expected events', async function () {
      let data = lensHubImpl.interface.encodeFunctionData('initialize', [
        LENS_HUB_NFT_NAME,
        LENS_HUB_NFT_SYMBOL,
        governanceAddress,
      ]);

      let proxy = await new TransparentUpgradeableProxy__factory(deployer).deploy(
        lensHubImpl.address,
        deployerAddress,
        data
      );

      receipt = await waitForTx(proxy.deployTransaction, true);

      expect(receipt.logs.length).to.eq(5);
      matchEvent(receipt, 'Upgraded', [lensHubImpl.address], proxy);
      matchEvent(receipt, 'AdminChanged', [ZERO_ADDRESS, deployerAddress], proxy);
      matchEvent(receipt, 'GovernanceSet', [
        deployerAddress,
        ZERO_ADDRESS,
        governanceAddress,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'StateSet', [
        deployerAddress,
        ProtocolState.Unpaused,
        ProtocolState.Paused,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'BaseInitialized', [
        LENS_HUB_NFT_NAME,
        LENS_HUB_NFT_SYMBOL,
        await getTimestamp(),
      ]);
    });
  });

  context('Hub Governance', function () {
    it('Governance change should emit expected event', async function () {
      receipt = await waitForTx(lensHub.connect(governance).setGovernance(userAddress));
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'GovernanceSet', [
        governanceAddress,
        governanceAddress,
        userAddress,
        await getTimestamp(),
      ]);
    });

    it('Emergency admin change should emit expected event', async function () {
      receipt = await waitForTx(lensHub.connect(governance).setEmergencyAdmin(userAddress));
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'EmergencyAdminSet', [
        governanceAddress,
        ZERO_ADDRESS,
        userAddress,
        await getTimestamp(),
      ]);
    });

    it('Protocol state change by governance should emit expected event', async function () {
      receipt = await waitForTx(lensHub.connect(governance).setState(ProtocolState.Paused));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'StateSet', [
        governanceAddress,
        ProtocolState.Unpaused,
        ProtocolState.Paused,
        await getTimestamp(),
      ]);

      receipt = await waitForTx(
        lensHub.connect(governance).setState(ProtocolState.PublishingPaused)
      );

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'StateSet', [
        governanceAddress,
        ProtocolState.Paused,
        ProtocolState.PublishingPaused,
        await getTimestamp(),
      ]);

      receipt = await waitForTx(lensHub.connect(governance).setState(ProtocolState.Unpaused));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'StateSet', [
        governanceAddress,
        ProtocolState.PublishingPaused,
        ProtocolState.Unpaused,
        await getTimestamp(),
      ]);
    });

    it('Protocol state change by emergency admin should emit expected events', async function () {
      await waitForTx(lensHub.connect(governance).setEmergencyAdmin(userAddress));

      receipt = await waitForTx(lensHub.connect(user).setState(ProtocolState.PublishingPaused));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'StateSet', [
        userAddress,
        ProtocolState.Unpaused,
        ProtocolState.PublishingPaused,
        await getTimestamp(),
      ]);

      receipt = await waitForTx(lensHub.connect(user).setState(ProtocolState.Paused));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'StateSet', [
        userAddress,
        ProtocolState.PublishingPaused,
        ProtocolState.Paused,
        await getTimestamp(),
      ]);
    });

    it('Follow module whitelisting functions should emit expected event', async function () {
      receipt = await waitForTx(
        lensHub.connect(governance).whitelistFollowModule(userAddress, true)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'FollowModuleWhitelisted', [userAddress, true, await getTimestamp()]);

      receipt = await waitForTx(
        lensHub.connect(governance).whitelistFollowModule(userAddress, false)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'FollowModuleWhitelisted', [userAddress, false, await getTimestamp()]);
    });

    it('Reference module whitelisting functions should emit expected event', async function () {
      receipt = await waitForTx(
        lensHub.connect(governance).whitelistReferenceModule(userAddress, true)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ReferenceModuleWhitelisted', [userAddress, true, await getTimestamp()]);

      receipt = await waitForTx(
        lensHub.connect(governance).whitelistReferenceModule(userAddress, false)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ReferenceModuleWhitelisted', [userAddress, false, await getTimestamp()]);
    });

    it('Collect module whitelisting functions should emit expected event', async function () {
      receipt = await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(userAddress, true)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'CollectModuleWhitelisted', [userAddress, true, await getTimestamp()]);

      receipt = await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(userAddress, false)
      );
      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'CollectModuleWhitelisted', [userAddress, false, await getTimestamp()]);
    });
  });

  context('Hub Interaction', function () {
    async function createProfile() {
      await waitForTx(
        lensHub.createProfile({
          to: userAddress,
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_PROFILE_URI,
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI: MOCK_FOLLOW_NFT_URI,
        })
      );
    }

    it('Profile creation for other user should emit the correct events', async function () {
      receipt = await waitForTx(
        lensHub.createProfile({
          to: userTwoAddress,
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_PROFILE_URI,
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI: MOCK_FOLLOW_NFT_URI,
        })
      );

      expect(receipt.logs.length).to.eq(2);
      matchEvent(
        receipt,
        'Transfer',
        [ZERO_ADDRESS, userTwoAddress, FIRST_PROFILE_ID],
        lensHubImpl
      );
      matchEvent(receipt, 'ProfileCreated', [
        FIRST_PROFILE_ID,
        userAddress,
        userTwoAddress,
        MOCK_PROFILE_HANDLE,
        MOCK_PROFILE_URI,
        ZERO_ADDRESS,
        [],
        MOCK_FOLLOW_NFT_URI,
        await getTimestamp(),
      ]);
    });

    it('Profile creation should emit the correct events', async function () {
      receipt = await waitForTx(
        lensHub.createProfile({
          to: userAddress,
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_PROFILE_URI,
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI: MOCK_FOLLOW_NFT_URI,
        })
      );

      expect(receipt.logs.length).to.eq(2);
      matchEvent(receipt, 'Transfer', [ZERO_ADDRESS, userAddress, FIRST_PROFILE_ID], lensHubImpl);
      matchEvent(receipt, 'ProfileCreated', [
        FIRST_PROFILE_ID,
        userAddress,
        userAddress,
        MOCK_PROFILE_HANDLE,
        MOCK_PROFILE_URI,
        ZERO_ADDRESS,
        [],
        MOCK_FOLLOW_NFT_URI,
        await getTimestamp(),
      ]);
    });

    it('Setting follow module should emit correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistFollowModule(approvalFollowModule.address, true)
      );

      receipt = await waitForTx(
        lensHub.setFollowModule(FIRST_PROFILE_ID, approvalFollowModule.address, [])
      );

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'FollowModuleSet', [
        FIRST_PROFILE_ID,
        approvalFollowModule.address,
        [],
        await getTimestamp(),
      ]);
    });

    it('Setting dispatcher should emit correct events', async function () {
      await createProfile();

      receipt = await waitForTx(lensHub.setDispatcher(FIRST_PROFILE_ID, userAddress));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'DispatcherSet', [FIRST_PROFILE_ID, userAddress, await getTimestamp()]);
    });

    it('Posting should emit the correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(freeCollectModule.address, true)
      );

      receipt = await waitForTx(
        lensHub.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          collectModule: freeCollectModule.address,
          collectModuleInitData: abiCoder.encode(['bool'], [true]),
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'PostCreated', [
        FIRST_PROFILE_ID,
        1,
        MOCK_URI,
        freeCollectModule.address,
        abiCoder.encode(['bool'], [true]),
        ZERO_ADDRESS,
        [],
        await getTimestamp(),
      ]);
    });

    it('Commenting should emit the correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(freeCollectModule.address, true)
      );
      await waitForTx(
        lensHub.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          collectModule: freeCollectModule.address,
          collectModuleInitData: abiCoder.encode(['bool'], [true]),
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      receipt = await waitForTx(
        lensHub.comment({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
          referenceModuleData: [],
          collectModule: freeCollectModule.address,
          collectModuleInitData: abiCoder.encode(['bool'], [true]),
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      expect(receipt.logs.length).to.eq(1);

      matchEvent(receipt, 'CommentCreated', [
        FIRST_PROFILE_ID,
        2,
        MOCK_URI,
        FIRST_PROFILE_ID,
        1,
        [],
        freeCollectModule.address,
        abiCoder.encode(['bool'], [true]),
        ZERO_ADDRESS,
        [],
        await getTimestamp(),
      ]);
    });

    it('Mirroring should emit the correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(freeCollectModule.address, true)
      );
      await waitForTx(
        lensHub.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          collectModule: freeCollectModule.address,
          collectModuleInitData: abiCoder.encode(['bool'], [true]),
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      receipt = await waitForTx(
        lensHub.mirror({
          profileId: FIRST_PROFILE_ID,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
          referenceModuleData: [],
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      expect(receipt.logs.length).to.eq(1);

      matchEvent(receipt, 'MirrorCreated', [
        FIRST_PROFILE_ID,
        2,
        FIRST_PROFILE_ID,
        1,
        [],
        ZERO_ADDRESS,
        [],
        await getTimestamp(),
      ]);
    });

    it('Following should emit correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(freeCollectModule.address, true)
      );

      const mockData = abiCoder.encode(['uint256'], [123]);
      receipt = await waitForTx(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [mockData]));
      const followNFT = await lensHub.getFollowNFT(FIRST_PROFILE_ID);

      const expectedName = MOCK_PROFILE_HANDLE + '-Follower';
      const expectedSymbol = getAbbreviation(MOCK_PROFILE_HANDLE) + '-Fl';

      expect(receipt.logs.length).to.eq(5);
      matchEvent(receipt, 'FollowNFTDeployed', [FIRST_PROFILE_ID, followNFT, await getTimestamp()]);
      matchEvent(receipt, 'Followed', [
        userTwoAddress,
        [FIRST_PROFILE_ID],
        [mockData],
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'Transfer', [ZERO_ADDRESS, userTwoAddress, 1], lensHubImpl);
      matchEvent(receipt, 'FollowNFTTransferred', [
        FIRST_PROFILE_ID,
        1,
        ZERO_ADDRESS,
        userTwoAddress,
        await getTimestamp(),
      ]);
    });

    it('Collecting should emit correct events', async function () {
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(feeCollectModule.address, true)
      );
      await expect(
        moduleGlobals.connect(governance).whitelistCurrency(currency.address, true)
      ).to.not.be.reverted;

      const collectPrice = 1;
      const collectModuleInitData = abiCoder.encode(
        ['uint256', 'address', 'address', 'uint16', 'bool'],
        [collectPrice, currency.address, userAddress, 0, true]
      );
      await waitForTx(
        lensHub.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          collectModule: feeCollectModule.address,
          collectModuleInitData: collectModuleInitData,
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      await waitForTx(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]]));

      await expect(currency.mint(userTwoAddress, MAX_UINT256)).to.not.be.reverted;
      await expect(
        currency.connect(userTwo).approve(feeCollectModule.address, MAX_UINT256)
      ).to.not.be.reverted;
      const collectData = abiCoder.encode(['address', 'uint256'], [currency.address, collectPrice]);
      receipt = await waitForTx(lensHub.connect(userTwo).collect(FIRST_PROFILE_ID, 1, collectData));
      const collectNFT = await lensHub.getCollectNFT(FIRST_PROFILE_ID, 1);
      const expectedName = MOCK_PROFILE_HANDLE + '-Collect-' + '1';
      const expectedSymbol = getAbbreviation(MOCK_PROFILE_HANDLE) + '-Cl-' + '1';

      expect(receipt.logs.length).to.eq(7);
      matchEvent(receipt, 'CollectNFTDeployed', [
        FIRST_PROFILE_ID,
        1,
        collectNFT,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'Collected', [
        userTwoAddress,
        FIRST_PROFILE_ID,
        1,
        FIRST_PROFILE_ID,
        1,
        collectData,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'BaseInitialized', [expectedName, expectedSymbol, await getTimestamp()]);
      matchEvent(receipt, 'CollectNFTInitialized', [FIRST_PROFILE_ID, 1, await getTimestamp()]);
      matchEvent(receipt, 'Transfer', [ZERO_ADDRESS, userTwoAddress, 1], lensHubImpl);
      matchEvent(receipt, 'CollectNFTTransferred', [
        FIRST_PROFILE_ID,
        1,
        1,
        ZERO_ADDRESS,
        userTwoAddress,
        await getTimestamp(),
      ]);
    });

    it('Collecting from a mirror should emit correct events', async function () {
      const secondProfileId = FIRST_PROFILE_ID + 1;
      await createProfile();

      await waitForTx(
        lensHub.connect(governance).whitelistCollectModule(feeCollectModule.address, true)
      );
      await expect(
        moduleGlobals.connect(governance).whitelistCurrency(currency.address, true)
      ).to.not.be.reverted;

      const collectPrice = 1;
      const collectModuleInitData = abiCoder.encode(
        ['uint256', 'address', 'address', 'uint16', 'bool'],
        [collectPrice, currency.address, userAddress, 0, true]
      );
      await waitForTx(
        lensHub.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
          collectModule: feeCollectModule.address,
          collectModuleInitData: collectModuleInitData,
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      await waitForTx(lensHub.connect(userTwo).follow([FIRST_PROFILE_ID], [[]]));

      await waitForTx(
        lensHub.connect(userTwo).createProfile({
          to: userTwoAddress,
          handle: 'usertwo',
          imageURI: MOCK_PROFILE_URI,
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI: MOCK_FOLLOW_NFT_URI,
        })
      );

      await waitForTx(
        lensHub.connect(userTwo).mirror({
          profileId: secondProfileId,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
          referenceModuleData: [],
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: [],
        })
      );

      await expect(currency.mint(userTwoAddress, MAX_UINT256)).to.not.be.reverted;
      await expect(
        currency.connect(userTwo).approve(feeCollectModule.address, MAX_UINT256)
      ).to.not.be.reverted;
      const collectData = abiCoder.encode(['address', 'uint256'], [currency.address, collectPrice]);

      receipt = await waitForTx(lensHub.connect(userTwo).collect(secondProfileId, 1, collectData));
      const collectNFT = await lensHub.getCollectNFT(FIRST_PROFILE_ID, 1);
      const expectedName = MOCK_PROFILE_HANDLE + '-Collect-' + '1';
      const expectedSymbol = getAbbreviation(MOCK_PROFILE_HANDLE) + '-Cl-' + '1';

      expect(receipt.logs.length).to.eq(7);
      matchEvent(receipt, 'CollectNFTDeployed', [
        FIRST_PROFILE_ID,
        1,
        collectNFT,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'Collected', [
        userTwoAddress,
        secondProfileId,
        1,
        FIRST_PROFILE_ID,
        1,
        collectData,
        await getTimestamp(),
      ]);
      matchEvent(receipt, 'BaseInitialized', [expectedName, expectedSymbol, await getTimestamp()]);
      matchEvent(receipt, 'CollectNFTInitialized', [FIRST_PROFILE_ID, 1, await getTimestamp()]);
      matchEvent(receipt, 'Transfer', [ZERO_ADDRESS, userTwoAddress, 1], lensHubImpl);
      matchEvent(receipt, 'CollectNFTTransferred', [
        FIRST_PROFILE_ID,
        1,
        1,
        ZERO_ADDRESS,
        userTwoAddress,
        await getTimestamp(),
      ]);
    });
  });

  context('Module Globals Governance', function () {
    it('Governance change should emit expected event', async function () {
      receipt = await waitForTx(moduleGlobals.connect(governance).setGovernance(userAddress));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ModuleGlobalsGovernanceSet', [
        governanceAddress,
        userAddress,
        await getTimestamp(),
      ]);
    });

    it('Treasury change should emit expected event', async function () {
      receipt = await waitForTx(moduleGlobals.connect(governance).setTreasury(userAddress));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ModuleGlobalsTreasurySet', [
        treasuryAddress,
        userAddress,
        await getTimestamp(),
      ]);
    });

    it('Treasury fee change should emit expected event', async function () {
      receipt = await waitForTx(moduleGlobals.connect(governance).setTreasuryFee(123));

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ModuleGlobalsTreasuryFeeSet', [
        TREASURY_FEE_BPS,
        123,
        await getTimestamp(),
      ]);
    });

    it('Currency whitelisting should emit expected event', async function () {
      receipt = await waitForTx(
        moduleGlobals.connect(governance).whitelistCurrency(userAddress, true)
      );

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ModuleGlobalsCurrencyWhitelisted', [
        userAddress,
        false,
        true,
        await getTimestamp(),
      ]);

      receipt = await waitForTx(
        moduleGlobals.connect(governance).whitelistCurrency(userAddress, false)
      );

      expect(receipt.logs.length).to.eq(1);
      matchEvent(receipt, 'ModuleGlobalsCurrencyWhitelisted', [
        userAddress,
        true,
        false,
        await getTimestamp(),
      ]);
    });
  });
});

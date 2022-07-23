/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProfileCreationProxy,
  ProfileCreationProxyInterface,
} from "../ProfileCreationProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "contract ILensHub",
        name: "hub",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "HandleContainsInvalidCharacters",
    type: "error",
  },
  {
    inputs: [],
    name: "HandleFirstCharInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "HandleLengthInvalid",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "string",
            name: "handle",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "followModule",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "followNFTURI",
            type: "string",
          },
        ],
        internalType: "struct DataTypes.CreateProfileData",
        name: "vars",
        type: "tuple",
      },
    ],
    name: "proxyCreateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405161088838038061088883398101604081905261002f916100bb565b61003833610053565b61004182610053565b6001600160a01b0316608052506100f5565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146100b857600080fd5b50565b600080604083850312156100ce57600080fd5b82516100d9816100a3565b60208401519092506100ea816100a3565b809150509250929050565b608051610778610110600039600061021b01526107786000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806307e5f94814610051578063715018a6146100665780638da5cb5b1461006e578063f2fde38b1461008d575b600080fd5b61006461005f3660046104a2565b6100a0565b005b610064610299565b600054604080516001600160a01b039092168252519081900360200190f35b61006461009b36600461059d565b6102cf565b6000546001600160a01b031633146100d35760405162461bcd60e51b81526004016100ca906105bf565b60405180910390fd5b60208101515160058110156100fb57604051633eb64ab360e01b815260040160405180910390fd5b60008260200151600081518110610114576101146105f4565b01602001516001600160f81b0319169050602d60f81b8114806101445750605f60f81b6001600160f81b03198216145b8061015c5750601760f91b6001600160f81b03198216145b1561017a57604051632f2c22a760e11b815260040160405180910390fd5b60015b828110156101d7578360200151818151811061019b5761019b6105f4565b6020910101516001600160f81b031916601760f91b14156101cf57604051630bb7f19b60e21b815260040160405180910390fd5b60010161017d565b506020808401516040516101eb9201610636565b60408051601f198184030181529181526020850191909152516001620af63960e11b031981526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063ffea138e9061025090869060040161068b565b6020604051808303816000875af115801561026f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102939190610729565b50505050565b6000546001600160a01b031633146102c35760405162461bcd60e51b81526004016100ca906105bf565b6102cd600061036a565b565b6000546001600160a01b031633146102f95760405162461bcd60e51b81526004016100ca906105bf565b6001600160a01b03811661035e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016100ca565b6103678161036a565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff811182821017156103f3576103f36103ba565b60405290565b80356001600160a01b038116811461041057600080fd5b919050565b600082601f83011261042657600080fd5b813567ffffffffffffffff80821115610441576104416103ba565b604051601f8301601f19908116603f01168101908282118183101715610469576104696103ba565b8160405283815286602085880101111561048257600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000602082840312156104b457600080fd5b813567ffffffffffffffff808211156104cc57600080fd5b9083019060c082860312156104e057600080fd5b6104e86103d0565b6104f1836103f9565b815260208301358281111561050557600080fd5b61051187828601610415565b60208301525060408301358281111561052957600080fd5b61053587828601610415565b604083015250610547606084016103f9565b606082015260808301358281111561055e57600080fd5b61056a87828601610415565b60808301525060a08301358281111561058257600080fd5b61058e87828601610415565b60a08301525095945050505050565b6000602082840312156105af57600080fd5b6105b8826103f9565b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b634e487b7160e01b600052603260045260246000fd5b60005b8381101561062557818101518382015260200161060d565b838111156102935750506000910152565b6000825161064881846020870161060a565b642e6c656e7360d81b920191825250600501919050565b6000815180845261067781602086016020860161060a565b601f01601f19169290920160200192915050565b60208152600060018060a01b03808451166020840152602084015160c060408501526106ba60e085018261065f565b90506040850151601f19808684030160608701526106d8838361065f565b925083606088015116608087015260808701519350808684030160a0870152610701838561065f565b935060a08701519250808685030160c08701525050610720828261065f565b95945050505050565b60006020828403121561073b57600080fd5b505191905056fea2646970667358221220e53f276db04a345d069baf97b980d6a2af0434b94e34d0b3334bdae56c4bfec064736f6c634300080a0033";

type ProfileCreationProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProfileCreationProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProfileCreationProxy__factory extends ContractFactory {
  constructor(...args: ProfileCreationProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    owner: string,
    hub: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProfileCreationProxy> {
    return super.deploy(
      owner,
      hub,
      overrides || {}
    ) as Promise<ProfileCreationProxy>;
  }
  getDeployTransaction(
    owner: string,
    hub: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(owner, hub, overrides || {});
  }
  attach(address: string): ProfileCreationProxy {
    return super.attach(address) as ProfileCreationProxy;
  }
  connect(signer: Signer): ProfileCreationProxy__factory {
    return super.connect(signer) as ProfileCreationProxy__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProfileCreationProxyInterface {
    return new utils.Interface(_abi) as ProfileCreationProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProfileCreationProxy {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ProfileCreationProxy;
  }
}

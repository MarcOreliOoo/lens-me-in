/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProfileTokenURILogic,
  ProfileTokenURILogicInterface,
} from "../ProfileTokenURILogic";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "followers",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
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
    ],
    name: "getProfileTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x61453f61003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100355760003560e01c80633edea73c1461003a575b600080fd5b61004d61004836600461073d565b610063565b60405161005a9190610803565b60405180910390f35b60606000836040516020016100789190610852565b60405160208183030381529060405290506100e781826100988487610112565b6100a18b61014c565b6100aa8b61014c565b6100bc8b6001600160a01b0316610252565b876040516020016100d3979695949392919061087b565b6040516020818303038152906040526102a6565b6040516020016100f79190610a60565b60405160208183030381529060405291505095945050505050565b6060610145610120836103fa565b61013261012d8651610453565b61014c565b856040516020016100d393929190610aa5565b9392505050565b6060816101705750506040805180820190915260018152600360fc1b602082015290565b8160005b811561019a5780610184816138e1565b91506101939050600a83613912565b9150610174565b60008167ffffffffffffffff8111156101b5576101b561069a565b6040519080825280601f01601f1916602001820160405280156101df576020820181803683370190505b5090505b841561024a576101f4600183613926565b9150610201600a8661393d565b61020c906030613951565b60f81b81838151811061022157610221613969565b60200101906001600160f81b031916908160001a905350610243600a86613912565b94506101e3565b949350505050565b6060816102795750506040805180820190915260048152630307830360e41b602082015290565b8160005b811561029c578061028d816138e1565b915050600882901c915061027d565b61024a848261048e565b60608151600014156102c657505060408051602081019091526000815290565b6000604051806060016040528060408152602001613a5460409139905060006003845160026102f59190613951565b6102ff9190613912565b61030a90600461397f565b67ffffffffffffffff8111156103225761032261069a565b6040519080825280601f01601f19166020018201604052801561034c576020820181803683370190505b509050600182016020820185865187015b808210156103b8576003820191508151603f8160121c168501518453600184019350603f81600c1c168501518453600184019350603f8160061c168501518453600184019350603f811685015184535060018301925061035d565b50506003865106600181146103d457600281146103e7576103ef565b603d6001830353603d60028303536103ef565b603d60018303535b509195945050505050565b60606104058261062e565b15610431578160405160200161041b919061399e565b6040516020818303038152906040529050919050565b60405180610aa00160405280610a768152602001613a94610a76913992915050565b6000601182111561048557600261046b600c84613926565b6104759190613912565b610480906018613926565b610488565b60185b92915050565b6060600061049d83600261397f565b6104a8906002613951565b67ffffffffffffffff8111156104c0576104c061069a565b6040519080825280601f01601f1916602001820160405280156104ea576020820181803683370190505b509050600360fc1b8160008151811061050557610505613969565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061053457610534613969565b60200101906001600160f81b031916908160001a905350600061055884600261397f565b610563906001613951565b90505b60018111156105db576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061059757610597613969565b1a60f81b8282815181106105ad576105ad613969565b60200101906001600160f81b031916908160001a90535060049490941c936105d481613a3c565b9050610566565b5083156101455760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640160405180910390fd5b805160009082906106425750600092915050565b805160005b8181101561068f5782818151811061066157610661613969565b6020910101516001600160f81b031916601160f91b141561068757506000949350505050565b600101610647565b506001949350505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106c157600080fd5b813567ffffffffffffffff808211156106dc576106dc61069a565b604051601f8301601f19908116603f011681019082821181831017156107045761070461069a565b8160405283815286602085880101111561071d57600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080600060a0868803121561075557600080fd5b853594506020860135935060408601356001600160a01b038116811461077a57600080fd5b9250606086013567ffffffffffffffff8082111561079757600080fd5b6107a389838a016106b0565b935060808801359150808211156107b957600080fd5b506107c6888289016106b0565b9150509295509295909350565b60005b838110156107ee5781810151838201526020016107d6565b838111156107fd576000848401525b50505050565b60208152600082518060208401526108228160408501602087016107d3565b601f01601f19169190910160400192915050565b600081516108488185602086016107d3565b9290920192915050565b600160fe1b81526000825161086e8160018501602087016107d3565b9190910160010192915050565b683d913730b6b2911d1160b91b815287516000906108a0816009850160208d016107d3565b701116113232b9b1b934b83a34b7b7111d1160791b60099184019182015288516108d181601a840160208d016107d3565b7f202d204c656e732070726f66696c65222c22696d616765223a22646174613a69601a9290910191820152731b5859d94bdcdd99cade1b5b0ed8985cd94d8d0b60621b603a820152875161092c81604e840160208c016107d3565b7f222c2261747472696275746573223a5b7b2274726169745f74797065223a2269604e92909101918201526c64222c2276616c7565223a222360981b606e820152610a52610a42610a3c610a07610a016109cd6109c761098f607b89018f610836565b7f227d2c7b2274726169745f74797065223a22666f6c6c6f77657273222c227661815265363ab2911d1160d11b602082015260260190565b8c610836565b7f227d2c7b2274726169745f74797065223a226f776e6572222c2276616c7565228152611d1160f11b602082015260220190565b89610836565b7f227d2c7b2274726169745f74797065223a2268616e646c65222c2276616c7565815262111d1160e91b602082015260230190565b86610836565b63227d5d7d60e01b815260040190565b9a9950505050505050505050565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c000000815260008251610a9881601d8501602087016107d3565b91909101601d0192915050565b7f3c7376672077696474683d2234353022206865696768743d223435302220766981527f6577426f783d223020302034353020343530222066696c6c3d226e6f6e65222060208201527f786d6c6e733d22687474703a2f2f7777772e77332e6f72672f323030302f737660408201527f672220786d6c6e733a786c696e6b3d22687474703a2f2f7777772e77332e6f7260608201527f672f313939392f786c696e6b223e3c646566733e3c7374796c653e40666f6e7460808201527f2d666163657b666f6e742d66616d696c793a2253706163652047726f7465736b60a08201527f223b7372633a75726c28646174613a6170706c69636174696f6e2f666f6e742d60c08201527f776f66663b636861727365743d7574662d383b6261736536342c64303947526760e08201527f4142414141414142646b41417741414141414c395141416741414141414141416101008201527f41414141414141414141414141414141414141414248554539544141414248416101208201527f4141416f414141416b3850765577715539544c7a494141414f634141414154516101408201527f4141414741546e43556c5932316863414141412b7741414143484141414263746101608201527f447736484e6e59584e77414141456441414141416741414141494141414145476101808201527f647365575941414152384141414f2f5141414865536844314731614756685a416101a08201527f41414533774141414132414141414e686e38387a6c6f614756684141415474416101c08201527f4141414230414141416b413830444d32687464486741414250554141414139516101e08201527f414141564375446739736247396a59514141464d77414141437141414141716b6102008201527f45784f697874595868774141415665414141414259414141416741466b4156576102208201527f35686257554141425751414141427651414141334c3461565a526347397a64416102408201527f414146314141414141554141414149502b6641495a346e4d31565155385451526102608201527f542b7572766472613074554b6d49496f6e526c4e69717163684a452b5042364d6102808201527f57444a76344244337252634443612b414d382b4b754d462b58675665494244636102a08201527f5a614e5245514368595238506e4e374c5164307432316a516e78546436626d546102c08201527f66767a667432647559397041426b63517254634b3565753345626851643348736102e08201527f32694149393669454374702b37666654694c6a42707039754277356d536530746103008201527f507833796e6234453177447363784359746b79665262736949744a4a417379616103208201527f4c756d374a754e422f494f374b7078386d2b6a63376f702b6d62317570326f756103408201527f39613075722b6b4f786f2b635053624362614c38737633612b51763365304c666103608201527f6b6d4c2f714f71587833396569786c717344344631752b35703549393432595a6103808201527f667558327649527154466e4f6c585a55483357353256313562567078342f6b626103a08201527f6679337479632b664462314133716e7170737930617658797a537a2f62666b586103c08201527f5835324b2f6e7635463862574f575a2b70753834334d37552f6b2f352f73317a6103e08201527f4b675a7a4f38626531634d5a4476463557562f6d49542b33625675306e3066436104008201527f58506533533738704c337552586944664e674e484a6d36756864663463354c736104208201527f77796735476452324d7349724f723146562b30496974714b6f6164504f4d72506104408201527f46647a2f654e684e57686d7958344478663639597a634c5462627162786f6b596104608201527f4d384f65446f414562673478424b474d4959786c48454d5578774e6f6b707a696104808201527f756f3467544f7370314544544f737070665954754d79577758583261713478586104a08201527f61477464504254626849633653615430347a516b435a5a683331644856566e4f6104c08201527f476177796748476364426a7258314d49347938696a524847464d6853564c58496104e08201527f70384e684272652b77626a614b436c6f475751316f4f57313834456e454952596105008201527f4d797057656532634d686170646f564f31336a4b577673594f34636b514b59706105208201527f36674843652b55654962492b4b6968644c56652b554e4b6c66503354325258516105408201527f756c54634d39476f5538786630396a65494a3775454b4c764c6b792b5a4d41386105608201527f597438392f55754765576d5452487a704e35356c4c586370476f4175627945696105808201527f74676856776c31386a6e7964506b432b515a737266487638534b3636424d37796105a08201527f6d702f7745474266354a654a786a5947455359707a41774d7241774e5446464d6105c08201527f4841774f414e6f526e6a474977596c526d5177454947687638435348773362796105e08201527f4278674547426f5972357872383744417773645977714367794d6b3046796a4d6106008201527f2b593967417042515a6d41427368444f3441414142346e474e675947426d67476106208201527f415a426b5947454d674238686a426642614741434174414951676551554758516106408201527f5939426b734742345a346871722f2f2b4569426d435278502f2f2f7a2f382f2b6106608201527f762f6a2f39762f722f38662f4c2f517168704b49435244564d4d5177307952316106808201527f324e51555a57546c354255556c5a5252556970496c6675775944457a4d4c4b786106a08201527f7337427963584e77387648372b416f4a4377694b69597549536b6c445268792b6106c08201527f6b414149426f475173414141454141662f2f414139346e4c315a6133416231336106e08201527f58657579414a6b414357684541414976456767535541676e69517747494267696107008201527f41574477496b5151414551594369534e4638795a4c316c7343306c635a4b556f6107208201527f303763544e543030366a69614f34376a54783245326e6165784a3436615431486107408201527f45797464306f626a56756b306d615070536d6e666148476b396255306e734a746107608201527f6179352b347553594169585374794b7734576d4e32393937792b3835317a726f6107808201527f6747596d487a457a4b357a456130456c32456d796753524b504e7757714349636107a08201527f5961304f73303755323033526f49775130486262553177513139474a374459336107c08201527f6a613375534558334845495259653235724d6947614448474943466d524737526107e08201527f527152525438515071356c5a5535464d5a582f675961344349526a762f722b4e6108008201527f4451332b6a4e5a6a313877675a7271363133324f314a784c32544139363831396108208201527f4a7662464d724c7979746b6d327253307572642f357264536d5a54704a4e715a6108408201527f4752314a32664a394f664d756e304a704e655a31703357467874386c616164726108608201527f6f38766f4e4758354b327856774e396b43335369342f6f4f6b6836762b5252476108808201527f427a6733536774776b483453634967383248734c7052535875356b7950424b746108a08201527f4138696e53307a5246444e455536417948344273506239626559797342414a666108c08201527f686362446961556b326f67724f7878524d6d6238626171314c614533326a73386108e08201527f2f30782b4a5554396f665346703767734f5267594f754564664b345a755745586109008201527f74586f395a6c544a647a5370664c35634e366c4547504c506b536f53643642486109208201527f3837615232745954514d566b44796e534259386d71374871336d5a3752556f556109408201527f697050474e4d3469515850316e4a4c79336c63797372314a4339524c37452f386109608201527f6a674d7361716b2b724a746548526c646e6d32525868516843496949497347396109808201527f687377354a3843445956493253512b306a6168675055626f45626f624342496c6109a08201527f4677724a704d567364476a30595568555a376173426638486f4c2f6d796865566109c08201527f4935644a534b7255307169395659384a432f72576534787a4d646159354d652f6109e08201527f4b446d6f46445164472f574a5a2f7836356161574364686d62707577797a7855610a008201527f3978334d6b454d2b5a52556355433156344a62786b327641626d56474e476c77610a208201527f463133306d5837454f31686f6d794f73437544714a376c79777a736d35624a4c610a408201527f5036635067514d3347423438364e5a55344e3831585a386e6738665344647973610a608201527f37384f2b49615a6c496a68366a34576b3656583474487a303330464f65476571610a808201527f316458422f71542b667a3444387a4f504670734f6b4151595442416759514c2b610aa08201527f44446a42674932706566664e4c62642f6d5935616d6e4350527335694f397672610ac08201527f536c6d75455842503047795837517a77785a52595446764e4162474a62424f57610ae08201527f566c72514542587a516f62716a7a534a513746532b5532366d637034392f4559610b008201527f557445504c5249446a7058636b7647315468334843307033546e75563766714f610b208201527f56722b6a376a38506c6a797858467a4e4c536a4b4b79544f43596c7945594234610b408201527f5534674d3762754e4a706149306b706c796b576c7a4a51486732574d78795933610b608201527f4d45494f6966394d374f2f726b552f774e6b793659576a76774d78354f443366610b808201527f3655664a3651415473494f386c7163723963644862536447656e7a5561675737610ba08201527f79425a4732645270764e32476b54734c423565334f512b437173626346617946610bc08201527f6b6d77476f453037553157366a546c714b33623044613576716f685378677338610be08201527f67373231754a746a53424c53724a6c6a436a526a516b444a6a776f3350385738610c008201527f68773968614639582f77322f2f78692b39396a3969796e33674731736a454e65610c208201527f55697648416e7666314d5271454e77693438307a46535845546f624c756f356b610c408201527f65355146474a6f6368594736584a6350344a647a484368444c434265794f6458610c608201527f6f4350543242336c79512f784f55396b6447552f7a66623330544f3745416562610c808201527f6f61656657784b464274686478324b4e43744d6833787a646345517351367870610ca08201527f49474f486f3331752f6d436e6169476f39584a38547235414d50544259574679610cc08201527f6d75576c446e317a68754c613875564c6d786f35586d796c486849764c52494a610ce08201527f6d462f5957384e65786f4b65794f4965716b4e646f3649614330646959665078610d008201527f6e667974307653504338546e344a556a56326f596970794e696e35332b4d6946610d208201527f31354f306a3674325131617151636b4177534530525762382b2f624c45655a45610d408201527f612b306b34566672346c432b6b772f49456e6968646977494e33696e5779424e610d608201527f2b6a5766526a67747232765a4336596c4456496339516e453243773465374c65610d808201527f4e526a762b2b4543396d63775064425033365247594f57794233516c41682b70610da08201527f47504649454c7a436d566843356b49514847364f43526a36687a436b2f53486b610dc08201527f37455746662f704f3934706678513630527a4f6841594376746377624c2f4e46610de08201527f55356f686b49477a78325231654c584745623871516d636d6b74363762333046610e008201527f6146764c6c7271483938557043502b6562337945396a7672486a536f77704231610e208201527f51487273463143636e3776466576466a2f3757664e5a7774654c4a6a50505035610e408201527f2f6858375a4932433573766b3065514c6377316a424b68497a544d3969624576610e608201527f6b696970316a4147656a38384331625a504e76694e4a314d762f554d415a6277610e808201527f4467696673416f364a33595238352b453347614f46503973594c6c6176553163610ea08201527f6f4c4f4e656e30664f3841622f48416e6a656850646174393854337158683739610ec08201527f4f725579587139472b63706b705471373935526e30477238756a463457504158610ee08201527f2f6a3963434d554939764557714369434d6e5934446b6c687367756558755631610f008201527f39652b69543132387666654858355365704a3470323376763731743935353552610f208201527f5852786b4842527643546f5a5a46363477466e6e6b6348545144796155433278610f408201527f5a37336341776636787a64666a6d6b386a4633787a48566d4f2b4557794f7765610f608201527f554e3246654a32527178774e4136704c507159696a4d6678646434612b6a4248610f808201527f45634d63724d636636474b673034486f61637a4a4376672b354741536d41324a610fa08201527f4459506a547479736645786658316935665731792f4e7a793863506e786b6e6c610fc08201527f7066662f61787878392f374e6e313965795a6c532b756e44367a2f4d58563031610fe08201527f674869446d614274344376397331744a7a574d687145576a392b2b504f6649636110008201527f68482f78763162334559396e736679485a4a6c5156614d484a62346c303947416110208201527f6b465563657953366d774e2b3159474d387654365857787366506336476c52496110408201527f675a736148664a624b352b584337686e4c4666513270516d6d615575645068556110608201527f504c6965623033474337706f304f2b54525a516134586248614266765974466d6110808201527f4a306b737544507552477246317757364e75577a72716e2f6a566b644a7163576110a08201527f724f6b2f4f754953566652662f472f7949515052726c4c6c434470334c6141346110c08201527f584435626a43467a45652b344971572f30446c58736d6f5579746873432f67456110e08201527f4879454d687177656a4347304e594951743064717547526d696476346f6331796111008201527f356467693854785738515479796a473777702b385150304a6635756130384a706111208201527f3277767664755852323437354854476976457437626e51723743426136306b4a6111408201527f2b616e383330426930743539426638522b6a6c4d3655503359304f6e794269706111608201527f374d714a714c6c666e4a35747863683132444c6d633332683264677966476c576111808201527f4e6e596f534543542f4578597237797a716531744653644a69376542755469646111a08201527f43473656466f764a726b71704f467335487071644c30504857676b6f7566344a6111c08201527f4a72342f6c466435344a354e324c564f525539696646633948774573635635696111e08201527f5a584c4d7a673856485632496c4939744345496a4475636f304846424f4870426112008201527f776d6457422f71344352554669434e4a5a30546157425543796a6e2f4b33564d6112208201527f3145427a316752662b677a43377a4b703274452f4a6152766a416a67545959536112408201527f6359496c6c6a535a6a316b66576c5236367a6b4876556f50706967634b6c69306112608201527f6c503347694d324a4e7232596c71736d66515a4f4c63695976544d30645844386112808201527f32734871314d48566b6f466863574b502f6373444b59746a65714654326356786112a08201527f6b706554796c694e4c4c39536a556a665a3055446b3835382b6d346f703453726112c08201527f6967636d785145596e46496f72426d4e682f34706a33317671665a61535930326112e08201527f496471316465467544516a706f57684e794673344f6c36574a3554713074352b6113008201527f496e755652315046744e784e5a7934506f4838684345416856656a74553466766113208201527f7968534f546b7845386d7a306452327058314b33497a4d7a6d46502b73432f776113408201527f39746268422f546a794d2b635251302f4a38314f78306d69304f422b577777426113608201527f552b4f465a46346961366942784376774a424b714c656d396d73774857506b6c6113808201527f3262622b4437774857364176724f773343667842776f2b79723554534b444b396113a08201527f7832644b4a494e4b7a4a6a61547068613576775848767159653374764a31712f6113c08201527f7548756c4a6663736e3252322f3879726e58487446392b4b56544438785958586113e08201527f3255676f37366f6f74736343487148624b315541556c705272305431383770546114008201527f6e377a507a53483156662f6366343146516350746450764c6175652b793145386114208201527f652b396f6a74317a3971373272527555794a43356b44592b6353485137744b506114408201527f2f68567458734d64503533356d752f50376c746f632f58786c447373564b53326114608201527f5670655670567772327244504d364f53663032336f38732b7a52637a4f37476c6114808201527f476842372b3061726c392b33617874344f6d4f3479344a613370786f58324e416114a08201527f67397064574b653070536b4a47575a4f776e5961657a763132733230316f4a526114c08201527f4552496c6e6942656876496236314c65324870476132706832574566624e32326114e08201527f67466e595a4b3459534d457645675a425061586f635453536555446e456142626115008201527f494b312f782b4a542b7437366130376e496d5866466f5737734d355a794859546115208201527f78656876473642675a6366514d4436694766796171567152727464692f4c65756115408201527f33325270564d617a5835686c697a3051542f6a4f626e7a4163376a4d614f67326115608201527f62427a335a555169766b74376430307635663649524b39364b55544b677638516115808201527f2b5164304c2f543779443866524441552f3266664330372b42342b664c7453356115a08201527f66673133487a726847796270776b4772414d32564f5344426675414f783362326115c08201527f726436315a3973714366596e47586a706f334e766a7a327a715177536b7863366115e08201527f7a57665a58596c55574354734244577a6f4e454d5076563666477661664276566116008201527f564433386d5970377a756766394e765a3370386430614851552b6b54323637626116208201527f6633475a31614171694e304d625576764c4643564f4766534c786c336b6665596116408201527f61397a642b687355396b38466a63767865563757556c49717a414c374e6f45646116608201527f6438677a437a49475972542b553046413536652b7873622f7247574b6b7033756116808201527f68337551623665367a32356879792f617461366537726964716d31436c2f6b366116a08201527f6d337a3272723657792b7a693431643568595a325163377739634d51733264516116c08201527f7338385576766a307037437844367452546b667667652b7a5875507673316d4a6116e08201527f4f673769364b5057615970646d774d476e706e41784c79392f38327a38386b386117008201527f2f6665467a314346464f2f4f583332664c486e33734b7230474c364f4a5758366117208201527f72646477316133466b6b6341524d7532523533333732742f6a506f4f357246796117408201527f2f793135434234742b2b71352b396e374d59365477455a707564387844386c766117608201527f424d4f4b643546703631314a33536943637a323267442b52686a52365161566f6117808201527f4d7971625753564a476d6e2b305338584b71324d6731754e79656746726839556117a08201527f576d44326379682b66536e6b44414135564350655270306c743974466e6547596117c08201527f734f70556547507a513838614c54616e55347246616e594450473352477052746117e08201527f5567377a356b516b56365436456b455159636575366a682b7a2f414874494c586118008201527f6a686463436e584f41524f52316d4e492b7050596d706877686b6e48756166776118208201527f6248566776505878646e526d33644f34425438535753534942684765456435636118408201527f356b4b597744673953767a547a784e50385673704567502f594f6e6a427a4f526118608201527f457a6744497762424850356d4638794d2f69524a6454534864453158376c54656118808201527f5237517130677572334772796a5a37493044706b35784463694d675278596f396118a08201527f316e44567173573454774f5176552f44336e6c432b31744b4e4f506b6e712b4c6118c08201527f384459523230763774755469474a5073446b677a57596c475a773659424747726118e08201527f62307531715962774563526b596d6d376947507263376f464c3476454f4145516119008201527f456667594136485156416247464530594578776a71377255366e745676455a426119208201527f396738734561544e362f544652366236456b6b51524d6875356a726f782b59486119408201527f4f6c324f76387333412b5a642f7a6849725a393944717968587a32572f322b646119608201527f625769702f376e4b582b2b4b72754b417352526f6a72496343656556633963796119808201527f4d324c474a4b6832734e68663473736441516c773036584d79414c2f627764316119a08201527f486753697a644f365a4f784a6f637651364c3152496556724c78684a494d73446119c08201527f306869346872493851506e7975596439577939376b334b7532374f637745454b6119e08201527f6641505a32504450365335794d496e7a7168496d44664a4f554e742f50665742611a008201527f49414966486b6a4d3659475132782f55356e55425a764f70524d54592f475134611a208201527f47472f79533651756b32465730783077355851794952443456446c4d70695972611a408201527f64387449694b67484554726e4433764464613348397a4a484252384e374f7275611a608201527f4c3366335a464571374e6e36466a36495234586d64346a2f4f36623031554b68611a808201527f50344977307a4c5a5878534c5a53795562474b327a596e666145517036304f79611aa08201527f7a756953726f47506b5834703761653967545666625a6c435438674b486f2b7a611ac08201527f7058444c322f6338582f41513272446e63414141414141514141414149414147611ae08201527f4c72446d7866447a7a3141414d4436414141414144626e434b5a41414141414e611b008201527f75636a57502f382f383441376b44496741414141594141674141414141414148611b208201527f69635932426b5947432b3865384f41774d4c302f2f50444344417949414b5167611b408201527f43414f77554541414141654a78466a373875524545556837397a52714f784364611b608201527f4859624c4b625543417234624953643748303630397551754632614552575245611b808201527f504a496c476f39523744433267386750635155577945333478433857572b4f65611ba08201527f64334a6e50434961555a2b446f4c666b7668652b513663393868747864716669611bc08201527f4d2f707543544e62352b506e77696552464b5a5658336b355176346f78643661611be08201527f7951325a766d6a7568366c58706f734f53377a4b62374d4b742b546475654766611c008201527f554431557561666b376439386e55622f75692f497735656359334b2f624b7470611c208201527f2f5348584c4e50756c4e416254736a716d49656b3066554176762f38534d5864611c408201527f4349714c397044347848354a4e70422f3039376d46395a666f70733879417359611c608201527f6938593174554976495a752f394476684647394f346c31596a754c65764a6538611c808201527f6b37397368305244372f43335663505077414141414141414277414859417567611ca08201527f44774153594258414751416177423667494f4169774355414a71416e67437341611cc08201527f4c53417749444f414e75413467447941506d42416f454867512b424667456841611ce08201527f5363424d594532675557425577466241576d4265774743675a6d427177477767611d008201527f624f42746f48534164364235774873676638434559496f676a554352344a6341611d208201527f6d6f4365494b45677045436e344b6d4171304374514b386773414378514c5467611d408201527f75494338344c344176794441774d4a6778414446344d6d417a534452674e5367611d608201527f31344461594e3341344b446a674f644136654473674f38674141654a786a5947611d808201527f526759416742516859474547426b51414d414562774172774141654a794e556b611da08201527f3171334441596658596d4b533130364b4c64704253306e4254474e715a304d62611dc08201527f4d4b67636b696f516c4a794e34786971324d59786c4a44755163755551753041611de08201527f755555756975682b68422b717852326b346f6f5261793376667a337666707377611e008201527f4738776a6445574430583343736334535774465937784444726744627a445463611e208201527f416a764d4664774a764d7677393443362f784f654178337549375764486f4f61611e408201527f32762b426c77684f336f50754159342b684c7742755952543843487546392f43611e608201527f4c6754577a4848774c657769542b46504159482b4f6250643364476c58565475611e808201527f525a6e6f6d7a576f72547269696c324466615362735578305a6679644b4a3364611ea08201527f3756326c6778715a33723743784e4b2b58712f694970395856363257696a696e611ec08201527f5a5a474f746b6d39704259467174424862573545356b31546546795a4d73792b611ee08201527f614c67376b5068746730424e6672422b65354e466270566e6a6d763167506264611f008201527f6e53714d375a784b6f6d30615a4b6a786148324f4d333648414c4134554b4e52611f208201527f7745636d522b43357a5249336d654d7164413666452b637a587a4a4379577449611f408201527f2b3966555737394f7864394478722b67777a42435a6531564842596f61557132611f608201527f4b744961506e763543517058464e377955617a31477331464b35385079685473611f808201527f756f2f6433426c50792f4f3968356f7273546e6858724e4634745a37584d727a611fa08201527f6b574f4f443744334f644e333345664f722b36356e6e7449612b46584e615038611fc08201527f75486d763962362f47304c446e44564470364c6455473759626e4d4b754b3853611fe08201527f506535664158707a6d7862674141414869635932426d4149502f6378694d47446120008201527f4242434141713177496c2920666f726d61742822776f666622293b20666f6e746120208201527f2d7765696768743a6e6f726d616c3b666f6e742d7374796c653a6e6f726d616c6120408201527f3b7d203c2f7374796c653e3c6c696e6561724772616469656e742069643d22726120608201527f6f756e6465642d626f726465722d7472616e73706172656e63792d64657461696120808201527f6c222078313d222d313337222079313d222d323336222078323d2234313522206120a08201527f79323d2234383622206772616469656e74556e6974733d2275736572537061636120c08201527f654f6e557365223e3c73746f702073746f702d636f6c6f723d227768697465226120e08201527f2f3e3c73746f70206f66667365743d2231222073746f702d636f6c6f723d22776121008201527f68697465222073746f702d6f7061636974793d22302e32222f3e3c2f6c696e656121208201527f61724772616469656e743e3c636c6970506174682069643d226f757465722d726121408201527f6f756e6465642d626f72646572223e3c726563742077696474683d22343530226121608201527f206865696768743d22343530222072783d223136222066696c6c3d22776869746121808201527f65222f3e3c2f636c6970506174683e3c2f646566733e3c673e3c6720636c69706121a08201527f2d706174683d2275726c28236f757465722d726f756e6465642d626f726465726121c08201526214911f60e91b6121e082015260006138c261355b61355561351a61351461340f6121e388018b610836565b7f3c726563742069643d22626f74746f6d2d6261636b67726f756e642220793d2281527f333730222077696474683d2234353022206865696768743d223830222066696c60208201527f6c3d2223414246453243222f3e3c746578742069643d2268616e646c6522206660408201527f696c6c3d22233030353031452220746578742d616e63686f723d226d6964646c60608201527f652220646f6d696e616e742d626173656c696e653d226d6964646c652220783d60808201527f223232352220793d223431302220666f6e742d66616d696c793d22537061636560a0820152741023b937ba32b9b591103337b73a16b9b4bd329e9160591b60c082015260d50190565b88610836565b7f2220666f6e742d7765696768743d2235303022206c65747465722d737061636981526837339e911832b6911f60b91b602082015260290190565b85610836565b7f3c2f746578743e3c726563742069643d226261636b67726f756e642d626f726481527f65722220783d22322e352220793d22322e35222077696474683d22343434222060208201527f6865696768743d22343434222072783d22313322207374726f6b653d2275726c60408201527f2823726f756e6465642d626f726465722d7472616e73706172656e63792d646560608201527f7461696c2922207374726f6b652d77696474683d2235222f3e3c70617468206960808201527f643d22626f74746f6d2d6c6f676f2220643d224d37302034323361313420313460a08201527f2030203020312d31332d31633220312035203120382d316c2d312d32682d316160c08201527f3920392030203020312d382030203920392030203020312d342d3663332d312060e08201527f31312d322031372d38762d316138203820302030203020332d3663302d322d316101008201527f2d342d332d352d312d322d332d332d352d336c2d3520312d332d34632d322d326101208201527f2d342d322d362d32732d3420302d3520326c2d3320342d352d312d3620332d326101408201527f203561382038203020302030203220366c3120316336203620313420372031376101608201527f2038613920392030203020312d342036203920392030203020312d3920306c2d6101808201527f32203268316332203220352032203820316131342031342030203020312d31336101a08201527f2031682d316c2d312032203120316333203120372032203130203161313620316101c08201527f362030203020302031302d3676366833762d36613136203136203020302030206101e08201527f313320366c372d3120312d312d322d325a6d2d32372d3239762d3163312d34206102008201527f342d3620362d3620332030203620322036203676356c322d336831762d3163336102208201527f2d3220362d31203820302032203220332036203020387631632d3720372d31376102408201527f20372d31372037732d3920302d31362d376c2d312d31632d332d322d322d36206102608201527f302d386c342d312034203120312031203320332d312d345a222066696c6c3d226102808201527f23666666222066696c6c2d6f7061636974793d222e38222f3e3c2f673e3c2f676102a0820152661f1e17b9bb339f60c91b6102c08201526102c70190565b95945050505050565b634e487b7160e01b600052601160045260246000fd5b60006000198214156138f5576138f56138cb565b5060010190565b634e487b7160e01b600052601260045260246000fd5b600082613921576139216138fc565b500490565b600082821015613938576139386138cb565b500390565b60008261394c5761394c6138fc565b500690565b60008219821115613964576139646138cb565b500190565b634e487b7160e01b600052603260045260246000fd5b6000816000190483118215151615613999576139996138cb565b500290565b7f3c696d6167652069643d22637573746f6d2d706963747572652220707265736581527f727665417370656374526174696f3d22784d6964594d696420736c696365222060208201527f6865696768743d22343530222077696474683d223435302220687265663d2200604082015260008251613a2281605f8501602087016107d3565b6211179f60e91b605f939091019283015250606201919050565b600081613a4b57613a4b6138cb565b50600019019056fe4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2f3c672069643d2264656661756c742d70696374757265223e3c726563742069643d2264656661756c742d706963747572652d6261636b67726f756e642220783d2230222077696474683d2234353022206865696768743d22343530222066696c6c3d2223414246453243222f3e3c672069643d2264656661756c742d706963747572652d6c6f676f22207472616e73666f726d3d227472616e736c6174652836302c333029223e3c7374796c653e3c215b43444154415b23657a314d38624b61497942335f746f207b616e696d6174696f6e3a20657a314d38624b61497942335f746f5f5f746f20363030306d73206c696e65617220696e66696e697465206e6f726d616c20666f7277617264737d406b65796672616d657320657a314d38624b61497942335f746f5f5f746f207b203025207b207472616e73666f726d3a207472616e736c617465336428302c302c30293b207472616e73666f726d3a207472616e736c6174652831363170782c31333770782920726f7461746528302e3035646567293b616e696d6174696f6e2d74696d696e672d66756e6374696f6e3a2063756269632d62657a69657228302e352c302e312c302e372c302e35297d20343125207b7472616e73666f726d3a207472616e736c6174652831353770782c31333370782920726f7461746528302e3035646567293b616e696d6174696f6e2d74696d696e672d66756e6374696f6e3a2063756269632d62657a69657228302e322c302e352c302e352c302e39297d2031303025207b7472616e73666f726d3a207472616e736c6174652831363170782c31333770782920726f7461746528302e3035646567297d7d2023657a314d38624b61497942365f746f207b616e696d6174696f6e3a20657a314d38624b61497942365f746f5f5f746f20363030306d73206c696e65617220696e66696e697465206e6f726d616c20666f7277617264737d406b65796672616d657320657a314d38624b61497942365f746f5f5f746f207b203025207b7472616e73666f726d3a207472616e736c6174652831363070782c31333670782920726f7461746528302e3035646567293b616e696d6174696f6e2d74696d696e672d66756e6374696f6e3a2063756269632d62657a69657228302e352c302e312c302e372c302e32297d20323625207b7472616e73666f726d3a207472616e736c6174652831373670782c31333870782920726f7461746528302e3035646567293b616e696d6174696f6e2d74696d696e672d66756e6374696f6e3a2063756269632d62657a69657228302e322c302e362c302e332c31297d20343325207b7472616e73666f726d3a207472616e736c6174652831373670782c31333870782920726f7461746528302e3035646567293b616e696d6174696f6e2d74696d696e672d66756e6374696f6e3a2063756269632d62657a69657228302e322c302e362c302e332c31297d20383325207b7472616e73666f726d3a207472616e736c6174652831353470782c31343570782920726f7461746528302e3035646567297d2031303025207b7472616e73666f726d3a207472616e736c6174652831363070782c31333670782920726f7461746528302e3035646567297d7d5d5d3e3c2f7374796c653e3c7061746820643d226d3137312e33203331352e362e312e322d2e332d3637613131332e36203131332e362030203020302039392e372035382e3620313135203131352030203020302034382e392d31302e386c2d352e382d3130613130332e39203130332e392030203020312d3132302e352d32352e356c342e3320322e396137372037372030203020302037372e3920316c2d352e372d31302d3220312e316136362e342036362e342030203020312d39362e352d35346331392d312e312d33302e382d312e312d3132202e314136362e342036362e342030203020312036302e39203235356c2d352e3720313020322e3420312e326137362e312037362e312030203020302037392e382d35203130332e39203130332e392030203020312d3132302e362032352e356c2d352e3720392e396131313520313135203020302030203133382e352d33322e3263332e382d342e3820372e322d31302031302d31352e336c2e362036362e39762d2e346831315a222066696c6c3d2223303035303165222f3e3c672069643d22657a314d38624b61497942335f746f22207472616e73666f726d3d227472616e736c61746528313632203133372e3529223e3c673e3c67207472616e73666f726d3d227472616e736c617465282d3136352e34202d3134332e3929223e3c7061746820643d224d313835203135392e32632d322e3420362e362d392e362031322e322d31392e322031322e322d392e3320302d31372e332d352e332d31392e342d31322e34222066696c6c3d226e6f6e6522207374726f6b653d222330303530316522207374726f6b652d77696474683d22382e3322207374726f6b652d6c696e656a6f696e3d22726f756e64222f3e3c672069643d22657a314d38624b61497942365f746f22207472616e73666f726d3d227472616e736c61746528313630203133362e3629223e3c67207472616e73666f726d3d227472616e736c6174652830202d312e3329222066696c6c3d2223303035303165223e3c7061746820643d224d3132342e38203134342e376131312e392031312e392030203120312d32332e3820302031312e392031312e392030203020312032332e3820305a22207472616e73666f726d3d227472616e736c617465282d3135342e31202d31343529222f3e3c7061746820643d224d3230392e35203134342e376131312e392031312e392030203120312d32332e3820302031312e392031312e392030203020312032332e3820305a22207472616e73666f726d3d227472616e736c617465282d313535202d31343529222f3e3c2f673e3c2f673e3c7061746820643d224d39322e32203134322e3863302d31342e362031332e382d32362e342033302e382d32362e347333302e382031312e382033302e382032362e344d313737203134322e3863302d31342e362031332e382d32362e342033302e382d32362e347333302e382031312e382033302e382032362e34222066696c6c3d226e6f6e6522207374726f6b653d222330303530316522207374726f6b652d77696474683d22382e3322207374726f6b652d6c696e656a6f696e3d22726f756e64222f3e3c2f673e3c2f673e3c2f673e3c7061746820643d226d3231392e312037302e332d332e3220332e332e312d342e36762d342e37632d312e382d36352e342d3130302e332d36352e342d3130322e3120306c2d2e3120342e3776342e366c2d332e312d332e332d332e342d332e334335392e382032322d31302039312e37203335203133392e326c332e3320332e344339322e36203139362e38203136342e3920313937203136342e39203139377337322e332d2e32203132362e352d35342e346c332e332d332e34433333392e372039312e3720323730203232203232322e352036376c2d332e3420332e335a222066696c6c3d226e6f6e6522207374726f6b653d222330303530316522207374726f6b652d77696474683d2231312e3222207374726f6b652d6d697465726c696d69743d223130222f3e3c2f673e3c2f673ea2646970667358221220612b41b916a681de50cc8931108e77c3eb753e1562a04a906d81dfc8bff5ef8764736f6c634300080a0033";

type ProfileTokenURILogicConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProfileTokenURILogicConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProfileTokenURILogic__factory extends ContractFactory {
  constructor(...args: ProfileTokenURILogicConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProfileTokenURILogic> {
    return super.deploy(overrides || {}) as Promise<ProfileTokenURILogic>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ProfileTokenURILogic {
    return super.attach(address) as ProfileTokenURILogic;
  }
  connect(signer: Signer): ProfileTokenURILogic__factory {
    return super.connect(signer) as ProfileTokenURILogic__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProfileTokenURILogicInterface {
    return new utils.Interface(_abi) as ProfileTokenURILogicInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProfileTokenURILogic {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ProfileTokenURILogic;
  }
}

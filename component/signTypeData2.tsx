
import { useSignMessage, useAccount, useSignTypedData } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { verifyTypedData } from '@wagmi/core'
import { config } from './config'

export function SignTypeData2() {

  const types = {
    EIP712Domain: [
      {
        name: "name",
        type: "string"
      },
      {
        name: "version",
        type: "string"
      },
      {
        name: "chainId",
        type: "uint256"
      },
      {
        name: "verifyingContract",
        type: "address"
      }
    ],
    OrderComponents: [
      {
        name: "offerer",
        type: "address"
      },
      {
        name: "zone",
        type: "address"
      },
      {
        name: "offer",
        type: "OfferItem[]"
      },
      {
        name: "consideration",
        type: "ConsiderationItem[]"
      },
      {
        name: "orderType",
        type: "uint8"
      },
      {
        name: "startTime",
        type: "uint256"
      },
      {
        name: "endTime",
        type: "uint256"
      },
      {
        name: "zoneHash",
        type: "bytes32"
      },
      {
        name: "salt",
        type: "uint256"
      },
      {
        name: "conduitKey",
        type: "bytes32"
      },
      {
        name: "counter",
        type: "uint256"
      }
    ],
    OfferItem: [
      {
        name: "itemType",
        type: "uint8"
      },
      {
        name: "token",
        type: "address"
      },
      {
        name: "identifierOrCriteria",
        type: "uint256"
      },
      {
        name: "startAmount",
        type: "uint256"
      },
      {
        name: "endAmount",
        type: "uint256"
      }
    ],
    ConsiderationItem: [
      {
        name: "itemType",
        type: "uint8"
      },
      {
        name: "token",
        type: "address"
      },
      {
        name: "identifierOrCriteria",
        type: "uint256"
      },
      {
        name: "startAmount",
        type: "uint256"
      },
      {
        name: "endAmount",
        type: "uint256"
      },
      {
        name: "recipient",
        type: "address"
      }
    ]
  }

  const domain = {
    name: "MintifyExchange",
    version: "1.6",
    chainId: 747,
    verifyingContract: "0x00000003cf2c206e1fda7fd032b2f9bde12ec6cc" 
  } as const

  const message = {
    offerer: "0x00000000000000000000000270b2feb6e9135c89",
  zone: "0x088d937f241702de1d8379e7667826a3bbcb6da3",
  offer: [
    {
      itemType: 2,
      token: "0x6712545a0d1d8595d1045ea18f2f386ffca7ca90",
      identifierOrCriteria: "3604",
      startAmount: "1",
      endAmount: "1"
    }
  ],
  consideration: [
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifierOrCriteria: "0",
      startAmount: "985872950000000000000",
      endAmount: "985872950000000000000",
      recipient: "0x00000000000000000000000270b2feb6e9135c89"
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifierOrCriteria: "0",
      startAmount: "20432600000000000000",
      endAmount: "20432600000000000000",
      recipient: "0x2dcc7c4ab800bf67380e2553be1e6891a36f18e7"
    },
    {
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
      identifierOrCriteria: "0",
      startAmount: "15324450000000000000",
      endAmount: "15324450000000000000",
      recipient: "0x2dcc7c4ab800bf67380e2553be1e6891a36f18e7"
    }
  ],
  orderType: 2,
  startTime: 1728427185,
  endTime: 1731019242,
  zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "42330117101296181845363830011774032066280393226878596558152052237147292227139",
  conduitKey: "0xf3d63166f0ca56c3c1a3508fce03ff0cf3fb691e000000000000000000000000",
  counter: "0"
}

  const typedData = {
    types,
    domain,
    primaryType: "OrderComponents",
    message
  }

  const [ isVaild, setVaild ] = useState<boolean>(false);
  const { signTypedDataAsync } = useSignTypedData({config})

  const { address } = useAccount()

  const signMsg = async () => {
    //  @ts-ignore: Unreachable code error
    const result = await signTypedDataAsync(typedData)
    const isVaild = await verifyTypedData(config, {
      ...typedData,
      address: address as `0x${string}`,
      signature: result
    })
    setVaild(isVaild);
    console.log('result ==>', result)
    console.log('isVaild ==>', isVaild)
  }

  return (
    <div>
      <Button onClick={signMsg} >
        Sign Typed Data 2
      </Button>
      <div>{`isValid: ${isVaild}` }</div>
      </div>
  );
}
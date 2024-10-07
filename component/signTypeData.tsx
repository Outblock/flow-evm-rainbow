
import { useSignMessage, useAccount, useSignTypedData } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { verifyMessage, getBytecode } from '@wagmi/core'
import { config } from './config'

export function SignTypeData() {
  const message = {
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    primaryType: "Mail",
    message: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    }
  }

  const { signTypedDataAsync } = useSignTypedData()

  const signMsg = async () => {
     // @ts-ignore: Unreachable code error
    const result = await signTypedDataAsync(message)
    // const isVaild = await verifyMessage(config, {
    //   address: address ?? "0x",
    //   message: message,
    //   signature: result,
    // })
    // setVaild(isVaild);
    console.log('result ==>', result)
    // console.log('isVaild ==>', isVaild)
  }

  return (
    <div>
      <Button onClick={signMsg} >
        Sign Typed Data
      </Button>
      </div>
  );
}
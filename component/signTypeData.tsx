
import { useSignMessage, useAccount, useSignTypedData } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { verifyTypedData } from '@wagmi/core'
import { config } from './config'

export function SignTypeData() {

  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  }

  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 747,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  } as const

  const message = {
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

  const typedData = {
    types,
    domain,
    primaryType: "Mail",
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
        Sign Typed Data
      </Button>
      <div>{`isValid: ${isVaild}` }</div>
      </div>
  );
}
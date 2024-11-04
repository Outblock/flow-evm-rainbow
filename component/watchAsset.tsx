
import { useSignMessage, useAccount } from 'wagmi';
import { useReadContract } from 'wagmi'
import { watchAsset } from '@wagmi/core'
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { config } from './config'

export function WatchAsset() {

  const [added, setAdded] = useState<boolean>(false);

  const signMsg = async () => {
    const isAdded = await watchAsset(config, {
        type: 'ERC20',
        options: {
          address: '0xDc1cBA416898b319A81cEA0a25163B0895C7D6C8',
          symbol: 'CFLOW',
          decimals: 18,
        },
    })
    setAdded(isAdded)
  }

  return (
    <div>
      <Button onClick={signMsg} >
        Watch Assets
      </Button>
      <div>{`Token Address: 0xDc1cBA416898b319A81cEA0a25163B0895C7D6C8` }</div>
      <div>{`isAdded: ${added}` }</div>
      </div>
  );
}
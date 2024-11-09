import { useSignMessage, useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export function DecodeData() {
  const [data, setData] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [decoded, setDecoded] = useState<string>('')

  const decode = async () => {
    let url = `api/decode?data=${data}&address=${address}`
    const res = await axios.get(url)
    setDecoded(JSON.stringify(res.data.data))
  }

  return (
    <div>
      <p>Decode Data</p>
      <textarea
        style={{ width: '100%', height: '100px' }}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <p>Contract address</p>
      <input
        style={{ width: '100%' }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button onClick={decode}>Decode</Button>
      <div>{`Token Address: 0xDc1cBA416898b319A81cEA0a25163B0895C7D6C8`}</div>
      <textarea
        style={{ width: '100%', height: '200px' }}
        value={decoded}
        disabled
      />
    </div>
  )
}

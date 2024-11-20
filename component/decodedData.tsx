import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
// import ReactJson from 'react-json-view'

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false, // 禁用服务器端渲染
})

export function DecodeData() {
  const [data, setData] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [decoded, setDecoded] = useState<any>({})

  const decode = async () => {
    let url = `api/decode?data=${data}&address=${address}`
    const res = await axios.get(url)
    setDecoded(res.data.data)
  }

  return (
    <div
      style={{
        width: '100%',
        minWidth: '800px',
        border: '1px solid #ccc',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
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
      <p>Result</p>
      {/* <textarea
        style={{ width: '100%', height: '200px' }}
        value={decoded}
        disabled
      /> */}

      <ReactJson indentWidth={2} src={decoded} style={{ width: '100%˝' }} />
    </div>
  )
}

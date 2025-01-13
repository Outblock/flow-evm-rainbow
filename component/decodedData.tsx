import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useWriteContract } from 'wagmi'

// import ReactJson from 'react-json-view'

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false, // 禁用服务器端渲染
})

const abi: any = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const usdcAbi: any = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export function DecodeData() {
  const { writeContractAsync } = useWriteContract()

  const [data, setData] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [decoded, setDecoded] = useState<any>({})

  const decode = async () => {
    let url = `api/decode?data=${data}&address=${address}`
    const res = await axios.get(url)
    setDecoded(res.data.data)
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          minWidth: '800px',
          border: '1px solid #ccc',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={async () => {
            const res = await writeContractAsync({
              abi: usdcAbi,
              address: '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283',
              functionName: 'approve',
              args: [
                '0xc0ac932cac7b4d8f7c31792082e2e8f3cfe99c10',
                '115792089237316195423570985008687907853269984665640564039457584007913129639935',
              ],
            })
            console.log(res)
          }}
        >
          Send trx with abi
        </button>
        <button
          onClick={async () => {
            const res = await writeContractAsync({
              abi,
              address: '0x5598c0652B899EB40f169Dd5949BdBE0BF36ffDe',
              functionName: 'transfer',
              args: [
               '0x00000000000000000000000266ddb89aaaae0ca0',
               '0'
              ],
            })
            console.log(res)
          }}
        >
          Send trx without abi
        </button>
      </div>
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
    </>
  )
}

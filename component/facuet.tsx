import { useSignMessage, useAccount, useVerifyMessage } from 'wagmi'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { verifyMessage, getBytecode } from '@wagmi/core'
import { config } from './config'
import axios from 'axios'

export function Facuet() {
  const message = 'this is a message'
  const { address } = useAccount()

  const [ft, setFt] = useState('')
  const [nft, setNft] = useState('')

  const requestFT = async () => {
    const { data } = await axios.get(`/api/faucet/ft?address=${address}`)
    setFt(data.res)
  }

  const requestNFT = async () => {
    const { data } = await axios.get(`/api/faucet/nft?address=${address}`)
    setNft(data.res)
  }

  return (
    <div>
      <Button onClick={requestFT}>getFt</Button>
      <br></br>
      {ft && <p>{ft}</p>}
      <br></br>
      <Button onClick={requestNFT}>getNFT</Button>
      <br></br>
      {nft && <p>{nft}</p>}
    </div>
  )
}

import * as React from 'react'
import { 
  type BaseError, 
  useSendTransaction, 
  useWaitForTransactionReceipt 
} from 'wagmi' 
import { parseEther } from 'viem' 
import {Input, Button} from "@nextui-org/react";
 
export function SendTransaction() {
  const { 
    data: hash,
    error, 
    isPending, 
    sendTransaction 
  } = useSendTransaction() 

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const to = formData.get('address') as `0x${string}` 
    const value = formData.get('value') as string 
    sendTransaction({ to, value: parseEther(value) }) 
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 


  const [addr, setAddr] = React.useState('0x2b7E32BB7F9BA35ea1a0D8181c8D163B3B0D5ea2')
  const [amount, setAmount] = React.useState('0.1')

  return (
    <form onSubmit={submit}>
      <Input name="address" placeholder="0xA0Cf…251e" required value={addr} onValueChange={setAddr} />
      <Input name="value" placeholder="0.05" required value={amount} onValueChange={setAmount}/>
      <Button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Send'} 
      </Button>
      {hash && <div>Transaction Hash: {hash}</div>} 
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )} 
    </form>
  )
}
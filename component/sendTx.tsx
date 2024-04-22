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

  return (
    <form onSubmit={submit}>
      <Input name="address" placeholder="0xA0Cf…251e" required value={"0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"} />
      <Input name="value" placeholder="0.05" required value={"0.1"} />
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
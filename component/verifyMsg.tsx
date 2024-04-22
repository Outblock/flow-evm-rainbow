import { useSignMessage, useAccount, useVerifyMessage } from 'wagmi';

export function VerifyMessage(sig: `0x${string}`) {
    const message = "this is a message"
    const { address, isConnecting, isDisconnected } = useAccount()
    const isVaild = useVerifyMessage({
        address: address,
        message: message,
        signature: sig
      })

      console.log('isVaild ==>', isVaild)
    
    return (
        <div>
          <div>{`isValidSignature: ${isVaild}` }</div>
          </div>
      );
}
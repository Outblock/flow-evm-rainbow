
import { useSignMessage, useAccount, useVerifyMessage } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { verifyMessage, getBytecode } from '@wagmi/core'
import { config } from './config'

const IERC1271Abi = [{"inputs":[{"internalType":"address[]","name":"addrs","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"returnData","type":"bytes"}],"name":"LogErr","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"bytes32","name":"priv","type":"bytes32"}],"name":"LogPrivilegeChanged","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Identity.Transaction[]","name":"txns","type":"tuple[]"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Identity.Transaction[]","name":"txns","type":"tuple[]"}],"name":"executeBySelf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Identity.Transaction[]","name":"txns","type":"tuple[]"}],"name":"executeBySender","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"privileges","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bytes32","name":"priv","type":"bytes32"}],"name":"setAddrPrivilege","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"tipMiner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"tryCatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

const MAGICVALUE = 0x1626ba7e;

export function SignMessage() {
  const message = "this is a message"
  const { address } = useAccount()
  // const { verifyMessage } = useVerifyMessage()

  const [ isSCW, setSCW ] = useState<boolean | undefined>(undefined);
  const [ isVaild, setVaild ] = useState<boolean>(false);
  // const [ sig, setSig ] = useState<`0x${string}`>('0x');
  const { signMessageAsync } = useSignMessage()

  const signMsg = async () => {
    const result = await signMessageAsync({message: message})
    const isVaild = await verifyMessage(config, {
      address: address ?? "0x",
      message: message,
      signature: result,
    })
    setVaild(isVaild);
    console.log('result ==>', result)
    console.log('isVaild ==>', isVaild)
  }

  const fetchSCW = async (address: `0x${string}`) => {
    if (!address) {
      return;
    }
    const bytecode = await getBytecode(config, {address: address})
    console.log('bytecode ==>', bytecode)
    const result = bytecode && bytecode !== "0x"
    setSCW(result ?? false)
  } 

  useEffect(() => {
    if (address) {
      fetchSCW(address)
    }
  }, [address])

  return (
    <div>
      <Button onClick={signMsg} >
        Sign Message
      </Button>

      <div>{`Smart Contract Wallet: ${isSCW}` }</div>
      <div>{`isValidSignature: ${isVaild}` }</div>

      {/* { sig === '0x' || <VerifyMessage sig={sig}  />} */}
      </div>
  );
}
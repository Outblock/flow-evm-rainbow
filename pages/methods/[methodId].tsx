import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useAccount, useSignMessage, useBalance, useChainId, useSendTransaction, usePublicClient } from 'wagmi'
import { getBytecode } from '@wagmi/core'
import { config } from '@/component/config'
import { MethodPage } from '@/components/method-page'
import { RPC_METHODS } from '@/lib/rpc-methods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { parseEther } from 'viem'

export default function DynamicMethodPage() {
  const router = useRouter()
  const { methodId } = router.query
  const method = RPC_METHODS.find(m => m.id === methodId)

  const [customMessage, setCustomMessage] = useState('Hello, Flow EVM!')
  const [customParams, setCustomParams] = useState('')
  const [isSmartContract, setIsSmartContract] = useState<boolean | null>(null)
  const [transactionHash, setTransactionHash] = useState('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
  const [contractAddress, setContractAddress] = useState('0x742d35cc6634c0532925a3b8d50d4c0332b9d002')
  const [recipient, setRecipient] = useState('0x742d35cc6634c0532925a3b8d50d4c0332b9d002')
  const [amount, setAmount] = useState('0.01')
  const [tokenAddress, setTokenAddress] = useState('0x742d35cc6634c0532925a3b8d50d4c0332b9d002')
  const [tokenSymbol, setTokenSymbol] = useState('FLOW')
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [chainId, setChainId] = useState('646')

  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient()
  const { sendTransactionAsync } = useSendTransaction()
  const { data: balance } = useBalance({ address })
  const currentChainId = useChainId()

  // Check if connected account is a smart contract
  useEffect(() => {
    const checkContractType = async () => {
      if (!address) {
        setIsSmartContract(null)
        return
      }
      
      try {
        const bytecode = await getBytecode(config, { address })
        const isContract = bytecode && bytecode !== "0x"
        setIsSmartContract(isContract ?? false)
      } catch (error) {
        console.error('Error checking contract type:', error)
        setIsSmartContract(null)
      }
    }

    checkContractType()
  }, [address])

  // Pre-fill parameters with examples when method changes
  useEffect(() => {
    if (method?.exampleParams) {
      setCustomParams(JSON.stringify(method.exampleParams, null, 2))
    }
  }, [method])

  if (!method) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Method Not Found</CardTitle>
            <CardDescription>
              The method "{methodId}" was not found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const executeMethod = async (params: any[]) => {
    if (!address) {
      throw new Error('No wallet connected')
    }

    const ethereum = (window as any).ethereum
    if (!ethereum) {
      throw new Error('No Ethereum provider found')
    }

    // Handle different method types
    switch (method.id) {
      case 'eth_sign':
        const signData = customParams || customMessage
        return await ethereum.request({
          method: 'eth_sign',
          params: [address, signData]
        })

      case 'personal_sign':
        const message = params[0] || customMessage
        return await signMessageAsync({ message })

      case 'personal_ecRecover':
        const recoveryMessage = customParams ? JSON.parse(customParams)[0] : customMessage
        const signature = customParams ? JSON.parse(customParams)[1] : ''
        if (!signature) throw new Error('Signature required for recovery')
        return await ethereum.request({
          method: 'personal_ecRecover',
          params: [recoveryMessage, signature]
        })

      case 'eth_signTypedData':
        const typedDataV1 = customParams ? JSON.parse(customParams) : [
          { type: 'string', name: 'message', value: 'Hello Flow EVM!' }
        ]
        return await ethereum.request({
          method: 'eth_signTypedData',
          params: [address, typedDataV1]
        })

      case 'eth_sendTransaction':
        if (!recipient) throw new Error('Recipient address required')
        return await sendTransactionAsync({
          to: recipient as `0x${string}`,
          value: parseEther(amount)
        })

      case 'eth_requestAccounts':
        return await ethereum.request({ method: 'eth_requestAccounts' })

      case 'eth_accounts':
        return await ethereum.request({ method: 'eth_accounts' })

      case 'eth_coinbase':
        return await ethereum.request({ method: 'eth_coinbase' })

      case 'eth_chainId':
        return await ethereum.request({ method: 'eth_chainId' })

      case 'net_version':
        return await ethereum.request({ method: 'net_version' })

      case 'eth_getBalance':
        if (!publicClient) throw new Error('Public client not available')
        const targetAddress = customParams || address
        return await publicClient.getBalance({ address: targetAddress as `0x${string}` })

      case 'eth_getTransactionByHash':
        if (!transactionHash) throw new Error('Transaction hash required')
        if (!publicClient) throw new Error('Public client not available')
        return await publicClient.getTransaction({ hash: transactionHash as `0x${string}` })

      case 'eth_call':
        if (!contractAddress) throw new Error('Contract address required')
        if (!publicClient) throw new Error('Public client not available')
        const callParams = customParams ? JSON.parse(customParams) : { to: contractAddress, data: '0x' }
        return await publicClient.call(callParams)

      case 'eth_getCode':
        if (!contractAddress) throw new Error('Contract address required')
        if (!publicClient) throw new Error('Public client not available')
        return await publicClient.getBytecode({ address: contractAddress as `0x${string}` })

      case 'wallet_switchEthereumChain':
        return await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }]
        })

      case 'wallet_addEthereumChain':
        const chainParams = {
          chainId: `0x${parseInt(chainId).toString(16)}`,
          chainName: 'Flow Previewnet',
          nativeCurrency: { name: 'Flow', symbol: 'FLOW', decimals: 18 },
          rpcUrls: ['https://previewnet.evm.nodes.onflow.org'],
          blockExplorerUrls: ['https://previewnet.flowdiver.io']
        }
        return await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainParams]
        })

      case 'wallet_watchAsset':
        const assetParams = {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals
          }
        }
        return await ethereum.request({
          method: 'wallet_watchAsset',
          params: assetParams
        })

      case 'eth_estimateGas':
        if (!recipient) throw new Error('Recipient address required')
        if (!publicClient) throw new Error('Public client not available')
        return await publicClient.estimateGas({
          account: address,
          to: recipient as `0x${string}`,
          value: parseEther(amount)
        })

      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
        const typedData = customParams ? JSON.parse(customParams) : {
          types: {
            Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' }
            ]
          },
          primaryType: 'Person',
          domain: {
            name: 'Flow EVM Test',
            version: '1'
          },
          message: {
            name: 'Test User',
            wallet: address
          }
        }
        return await ethereum.request({
          method: method.method,
          params: [address, JSON.stringify(typedData)]
        })

      default:
        // Generic fallback
        const parsedParams = customParams ? JSON.parse(customParams) : params
        return await ethereum.request({
          method: method.method,
          params: parsedParams
        })
    }
  }

  const renderCustomInputs = () => {
    switch (method.id) {
      case 'eth_sign':
      case 'personal_sign':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message to Sign</Label>
              <Input
                id="message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter message to sign"
              />
            </div>
          </div>
        )

      case 'personal_ecRecover':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recoveryData">Recovery Data (JSON Array)</Label>
              <Textarea
                id="recoveryData"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                placeholder='["message", "signature"]'
                rows={3}
              />
            </div>
          </div>
        )

      case 'eth_signTypedData':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="typedDataV1">Typed Data v1 (JSON Array)</Label>
              <Textarea
                id="typedDataV1"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                placeholder='[{"type": "string", "name": "message", "value": "Hello Flow EVM!"}]'
                rows={5}
              />
            </div>
          </div>
        )

      case 'eth_sendTransaction':
      case 'eth_estimateGas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (FLOW)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                type="number"
                step="0.01"
              />
            </div>
          </div>
        )

      case 'eth_getTransactionByHash':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="txHash">Transaction Hash</Label>
              <Input
                id="txHash"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>
        )

      case 'eth_call':
      case 'eth_getCode':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contractAddress">Contract Address</Label>
              <Input
                id="contractAddress"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>
        )

      case 'wallet_switchEthereumChain':
      case 'wallet_addEthereumChain':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="chainId">Chain ID</Label>
              <Input
                id="chainId"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                placeholder="646"
              />
            </div>
          </div>
        )

      case 'wallet_watchAsset':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tokenAddress">Token Address</Label>
              <Input
                id="tokenAddress"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="FLOW"
              />
            </div>
            <div>
              <Label htmlFor="tokenDecimals">Token Decimals</Label>
              <Input
                id="tokenDecimals"
                value={tokenDecimals}
                onChange={(e) => setTokenDecimals(parseInt(e.target.value) || 18)}
                placeholder="18"
                type="number"
              />
            </div>
          </div>
        )

      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="typedData">Typed Data (JSON)</Label>
              <Textarea
                id="typedData"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                placeholder="Leave empty to use default example"
                rows={10}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="params">Parameters (JSON Array)</Label>
              <Textarea
                id="params"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                placeholder='["param1", "param2"]'
                rows={5}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <MethodPage
      method={method}
      onExecute={executeMethod}
      customInputs={renderCustomInputs()}
    >
      <div className="space-y-4">
        {address && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Wallet Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant={isSmartContract === null ? "outline" : isSmartContract ? "default" : "secondary"}>
                  {isSmartContract === null ? "Checking..." : isSmartContract ? "Smart Contract" : "EOA"}
                </Badge>
              </div>
              {balance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span className="text-sm font-mono">
                    {Number(balance.formatted).toFixed(4)} {balance.symbol}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chain ID:</span>
                <Badge variant="outline">
                  {currentChainId}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MethodPage>
  )
}
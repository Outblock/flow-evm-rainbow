import { useState } from 'react'
import { 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  useAccount,
  useBalance
} from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { MethodPage } from '@/components/method-page'
import { RPC_METHODS } from '@/lib/rpc-methods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Loader2 } from 'lucide-react'

export default function SendTransactionPage() {
  const method = RPC_METHODS.find(m => m.id === 'eth_sendTransaction')!
  const [recipient, setRecipient] = useState('0x2b7E32BB7F9BA35ea1a0D8181c8D163B3B0D5ea2')
  const [amount, setAmount] = useState('0.01')
  const [gasLimit, setGasLimit] = useState('')
  const [gasPrice, setGasPrice] = useState('')
  
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })
  const { 
    data: hash, 
    error, 
    isPending, 
    sendTransaction 
  } = useSendTransaction()
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    data: receipt 
  } = useWaitForTransactionReceipt({ hash })

  const executeSendTransaction = async (params: any[]) => {
    if (!address) {
      throw new Error('No wallet connected')
    }

    // Extract transaction params
    const txParams = params && params.length > 0 ? params[0] : {
      to: recipient,
      value: parseEther(amount).toString(),
      ...(gasLimit && { gas: gasLimit }),
      ...(gasPrice && { gasPrice: gasPrice })
    }

    try {
      // Convert value to hex if it's a string number
      const processedParams = {
        ...txParams,
        to: txParams.to as `0x${string}`,
        value: typeof txParams.value === 'string' && !txParams.value.startsWith('0x') 
          ? parseEther(txParams.value) 
          : txParams.value
      }

      return new Promise((resolve, reject) => {
        sendTransaction(processedParams, {
          onSuccess: (hash) => {
            resolve({
              transactionHash: hash,
              status: 'sent',
              params: processedParams
            })
          },
          onError: (error) => {
            reject(error)
          }
        })
      })
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send transaction')
    }
  }

  const quickSend = async () => {
    if (!recipient || !amount) return
    
    try {
      const result = await executeSendTransaction([{
        to: recipient,
        value: amount,
        ...(gasLimit && { gas: gasLimit }),
        ...(gasPrice && { gasPrice: gasPrice })
      }])
      console.log('Quick send result:', result)
    } catch (error) {
      console.error('Quick send failed:', error)
    }
  }

  const defaultParams = [{
    to: recipient,
    value: amount,
    ...(gasLimit && { gas: gasLimit }),
    ...(gasPrice && { gasPrice: gasPrice })
  }]

  return (
    <MethodPage 
      method={method}
      onExecute={executeSendTransaction}
      defaultParams={defaultParams}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Send</CardTitle>
          <CardDescription>
            Send ETH/FLOW to another address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="amount">
                Amount 
                {balance && (
                  <span className="text-muted-foreground ml-1">
                    (Balance: {formatEther(balance.value)} {balance.symbol})
                  </span>
                )}
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                type="number"
                step="0.001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gas-limit">Gas Limit (optional)</Label>
              <Input
                id="gas-limit"
                value={gasLimit}
                onChange={(e) => setGasLimit(e.target.value)}
                placeholder="21000"
                type="number"
              />
            </div>
            
            <div>
              <Label htmlFor="gas-price">Gas Price (optional)</Label>
              <Input
                id="gas-price"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                placeholder="20000000000"
                type="number"
              />
            </div>
          </div>
          
          <Button 
            onClick={quickSend}
            disabled={!address || !recipient || !amount || isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Quick Send'
            )}
          </Button>

          <Separator />

          {/* Transaction Status */}
          <div className="space-y-3">
            {hash && (
              <div>
                <div className="text-sm font-medium">Transaction Hash</div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                    {hash}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://previewnet.flowdiver.io/tx/${hash}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <Badge variant="outline">Waiting for confirmation...</Badge>
              </div>
            )}

            {isConfirmed && receipt && (
              <div>
                <Badge variant="default">✓ Transaction Confirmed</Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  Block: {receipt.blockNumber?.toString()}
                  {receipt.gasUsed && ` | Gas Used: ${receipt.gasUsed.toString()}`}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <Badge variant="destructive" className="mb-2">Error</Badge>
                <div className="text-sm text-destructive">
                  {error.message}
                </div>
              </div>
            )}

            {address && (
              <div>
                <div className="text-sm font-medium">From Account</div>
                <div className="text-xs font-mono text-muted-foreground mt-1 break-all">
                  {address}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </MethodPage>
  )
}
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { MethodPage } from '@/components/method-page'
import { RPC_METHODS } from '@/lib/rpc-methods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function WatchAssetPage() {
  const method = RPC_METHODS.find(m => m.id === 'wallet_watchAsset')!
  const [tokenAddress, setTokenAddress] = useState('0x')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState('18')
  const [image, setImage] = useState('')
  
  const { address } = useAccount()

  const executeWatchAsset = async (params: any[]) => {
    if (!window.ethereum) {
      throw new Error('No ethereum provider found')
    }

    // Extract params or use form values
    const assetParams = params && params.length > 0 ? params[0] : {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: symbol,
        decimals: parseInt(decimals),
        image: image || undefined,
      },
    }

    try {
      const result = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: assetParams,
      })

      return {
        success: result,
        params: assetParams,
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add asset to wallet')
    }
  }

  const quickAddToken = async () => {
    if (!tokenAddress || !symbol) return
    
    try {
      const result = await executeWatchAsset([{
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: parseInt(decimals),
          ...(image && { image }),
        },
      }])
      console.log('Quick add token result:', result)
    } catch (error) {
      console.error('Quick add token failed:', error)
    }
  }

  // Predefined tokens for quick testing
  const predefinedTokens = [
    {
      name: 'USDC',
      address: '0xA0b86991c431e58dC2bD7f4b4aC6C1D9A7D7f7d7E8',
      symbol: 'USDC',
      decimals: '6',
      image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    {
      name: 'WETH',
      address: '0xC02aaA39b223FE8D0A0E5c1F27eaD9083C756Cc2',
      symbol: 'WETH',
      decimals: '18',
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    }
  ]

  const loadPredefinedToken = (token: typeof predefinedTokens[0]) => {
    setTokenAddress(token.address)
    setSymbol(token.symbol)
    setDecimals(token.decimals)
    setImage(token.image)
  }

  const defaultParams = {
    type: 'ERC20',
    options: {
      address: tokenAddress,
      symbol: symbol,
      decimals: parseInt(decimals),
      ...(image && { image }),
    },
  }

  return (
    <MethodPage 
      method={method}
      onExecute={executeWatchAsset}
      defaultParams={[defaultParams]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Token to Wallet</CardTitle>
          <CardDescription>
            Request wallet to watch/track a token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="token-address">Token Contract Address</Label>
            <Input
              id="token-address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="USDC"
              />
            </div>
            
            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="18"
                type="number"
                min="0"
                max="18"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>
          
          <Button 
            onClick={quickAddToken}
            disabled={!tokenAddress || !symbol}
            className="w-full"
          >
            Add Token to Wallet
          </Button>

          <Separator />

          <div>
            <div className="text-sm font-medium mb-3">Quick Add Predefined Tokens</div>
            <div className="space-y-2">
              {predefinedTokens.map((token) => (
                <Button
                  key={token.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPredefinedToken(token)}
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {token.symbol} • {token.decimals} decimals
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {address && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium">Connected Account</div>
                <div className="text-xs font-mono text-muted-foreground mt-1 break-all">
                  {address}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </MethodPage>
  )
}
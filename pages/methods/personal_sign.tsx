import { useState, useEffect } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { verifyMessage, getBytecode } from '@wagmi/core'
import { config } from '@/component/config'
import { MethodPage } from '@/components/method-page'
import { RPC_METHODS } from '@/lib/rpc-methods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function PersonalSignPage() {
  const method = RPC_METHODS.find(m => m.id === 'personal_sign')!
  const [customMessage, setCustomMessage] = useState('Hello, Flow EVM!')
  const [isSmartContract, setIsSmartContract] = useState<boolean | null>(null)
  const [isValidSignature, setIsValidSignature] = useState<boolean | null>(null)
  const [lastSignature, setLastSignature] = useState<string | null>(null)
  
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

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

  const executePersonalSign = async (params: any[]) => {
    if (!address) {
      throw new Error('No wallet connected')
    }

    // Extract message from params or use custom message
    const message = params && params.length > 0 ? params[0] : customMessage
    
    try {
      // Sign the message
      const signature = await signMessageAsync({ message })
      setLastSignature(signature)

      // Verify the signature
      try {
        const isValid = await verifyMessage(config, {
          address,
          message,
          signature,
        })
        setIsValidSignature(isValid)
      } catch (verifyError) {
        console.warn('Signature verification failed:', verifyError)
        setIsValidSignature(false)
      }

      return {
        signature,
        message,
        address,
        verificationResult: isValidSignature
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign message')
    }
  }

  const quickSignMessage = async () => {
    if (!customMessage.trim()) return
    
    try {
      const result = await executePersonalSign([customMessage])
      console.log('Quick sign result:', result)
    } catch (error) {
      console.error('Quick sign failed:', error)
    }
  }

  return (
    <MethodPage 
      method={method}
      onExecute={executePersonalSign}
      defaultParams={[customMessage]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Test message signing with custom messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-message">Custom Message</Label>
            <Input
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter message to sign..."
            />
          </div>
          
          <Button 
            onClick={quickSignMessage} 
            disabled={!address || !customMessage.trim()}
            className="w-full"
          >
            Quick Sign
          </Button>

          <Separator />
          
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium">Wallet Type</div>
              <div className="mt-1">
                {isSmartContract === null ? (
                  <Badge variant="outline">Checking...</Badge>
                ) : isSmartContract ? (
                  <Badge variant="secondary">Smart Contract</Badge>
                ) : (
                  <Badge variant="default">EOA</Badge>
                )}
              </div>
            </div>

            {lastSignature && (
              <div>
                <div className="text-sm font-medium">Last Signature Valid</div>
                <div className="mt-1">
                  {isValidSignature === null ? (
                    <Badge variant="outline">Verifying...</Badge>
                  ) : isValidSignature ? (
                    <Badge variant="default">✓ Valid</Badge>
                  ) : (
                    <Badge variant="destructive">✗ Invalid</Badge>
                  )}
                </div>
              </div>
            )}

            {address && (
              <div>
                <div className="text-sm font-medium">Connected Account</div>
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
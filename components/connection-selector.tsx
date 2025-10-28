'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Wifi, WifiOff, Settings } from 'lucide-react'
import { CONNECTION_METHODS, ConnectionMethod, connectionManager } from '@/lib/connection-methods'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface ConnectionSelectorProps {
  onMethodChange?: (method: ConnectionMethod) => void
}

export function ConnectionSelector({ onMethodChange }: ConnectionSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<ConnectionMethod>('rainbowkit')
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableMethods, setAvailableMethods] = useState(CONNECTION_METHODS)
  
  const { isConnected: isRainbowkitConnected, address: rainbowkitAddress } = useAccount()
  const { disconnect: disconnectRainbowkit } = useDisconnect()

  // Update available methods on client side
  useEffect(() => {
    const updateAvailability = () => {
      const updated = CONNECTION_METHODS.map(method => ({
        ...method,
        available: method.id === 'rainbowkit' ? true : 
          method.id === 'window.ethereum' ? !!(window as any).ethereum :
          method.id === 'window.frw' ? !!(window as any).frw :
          method.id === 'window.metamask' ? !!(window as any).metamask :
          ['ethers', 'web3', 'viem', 'wagmi'].includes(method.id) ? !!(window as any).ethereum :
          false
      }))
      setAvailableMethods(updated)
    }

    updateAvailability()
    
    // Listen for wallet installations
    const interval = setInterval(updateAvailability, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleMethodChange = (method: ConnectionMethod) => {
    setSelectedMethod(method)
    connectionManager.setCurrentMethod(method)
    onMethodChange?.(method)
    setError(null)
    
    // Disconnect from other methods when switching
    if (method !== 'rainbowkit' && isRainbowkitConnected) {
      disconnectRainbowkit()
    }
    if (method === 'rainbowkit') {
      connectionManager.disconnect()
      setConnectedAccounts([])
    }
    
    // Force update other components
    window.dispatchEvent(new CustomEvent('connectionMethodChanged', { detail: method }))
  }

  const handleConnect = async () => {
    if (selectedMethod === 'rainbowkit') {
      return // RainbowKit handles its own connection
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await connectionManager.connectWithMethod(selectedMethod)
      setConnectedAccounts(accounts)
    } catch (err: any) {
      setError(err.message || 'Failed to connect')
      setConnectedAccounts([])
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    if (selectedMethod === 'rainbowkit') {
      disconnectRainbowkit()
    } else {
      connectionManager.disconnect()
      setConnectedAccounts([])
    }
    setError(null)
  }

  const getConnectionStatus = () => {
    if (selectedMethod === 'rainbowkit') {
      return {
        connected: isRainbowkitConnected,
        accounts: rainbowkitAddress ? [rainbowkitAddress] : []
      }
    } else {
      return {
        connected: connectedAccounts.length > 0,
        accounts: connectedAccounts
      }
    }
  }

  const { connected, accounts } = getConnectionStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Connection Method
        </CardTitle>
        <CardDescription>
          Choose how to connect to wallets and test different library implementations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Connection Method</label>
          <Select value={selectedMethod} onValueChange={handleMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select connection method" />
            </SelectTrigger>
            <SelectContent>
              {availableMethods.map((method) => (
                <SelectItem 
                  key={method.id} 
                  value={method.id}
                  disabled={!method.available}
                >
                  <div className="flex items-center gap-2">
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                    {!method.available && <Badge variant="secondary" className="text-xs">N/A</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMethod && (
          <div className="p-3 bg-muted/50 rounded-md">
            <div className="text-sm font-medium mb-1">
              {availableMethods.find(m => m.id === selectedMethod)?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {availableMethods.find(m => m.id === selectedMethod)?.description}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant={connected ? 'default' : 'secondary'}>
              {selectedMethod}
            </Badge>
          </div>

          {selectedMethod === 'rainbowkit' ? (
            <ConnectButton />
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !availableMethods.find(m => m.id === selectedMethod)?.available}
                className="flex-1"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
              {connected && (
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              )}
            </div>
          )}

          {error && (
            <Alert>
              <AlertDescription className="text-sm text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {connected && accounts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Connected Accounts:</div>
              {accounts.map((account, index) => (
                <div key={index} className="text-xs font-mono bg-muted/30 p-2 rounded border">
                  {account}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
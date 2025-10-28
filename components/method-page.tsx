'use client'

import { ReactNode, useState } from 'react'
import { MainLayout } from './main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Copy, Play, RotateCcw, ExternalLink } from 'lucide-react'
import { RPCMethod } from '@/lib/rpc-methods'

interface MethodPageProps {
  method: RPCMethod
  children?: ReactNode
  onExecute?: (params?: any) => Promise<any>
  defaultParams?: any
  customInputs?: ReactNode
}

export function MethodPage({ method, children, onExecute, defaultParams, customInputs }: MethodPageProps) {
  const [params, setParams] = useState(JSON.stringify(defaultParams || [], null, 2))
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExecute = async () => {
    if (!onExecute) return
    
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let parsedParams
      try {
        parsedParams = JSON.parse(params)
      } catch (e) {
        throw new Error('Invalid JSON parameters')
      }

      const response = await onExecute(parsedParams)
      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setParams(JSON.stringify(defaultParams || [], null, 2))
    setResult(null)
    setError(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <MainLayout title={method.name}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">{method.name}</h2>
            <Badge variant="outline" className="font-mono">
              {method.method}
            </Badge>
            <div className="flex gap-2">
              {method.walletTypes.map(type => (
                <Badge key={type} variant={type === 'EOA' ? 'default' : 'secondary'}>
                  {type}
                </Badge>
              ))}
            </div>
            {method.metamaskDoc && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(method.metamaskDoc, '_blank')}
                className="ml-auto"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                MetaMask Docs
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{method.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parameters</CardTitle>
                <CardDescription>
                  Modify the parameters for the RPC call
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customInputs && (
                  <>
                    {customInputs}
                    <Separator />
                  </>
                )}
                <div>
                  <Label htmlFor="params">JSON Parameters</Label>
                  <Textarea
                    id="params"
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                    className="font-mono text-sm min-h-[120px]"
                    placeholder="[]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExecute} 
                    disabled={loading || !onExecute}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {loading ? 'Executing...' : 'Execute'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Custom controls from children */}
            {children}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Result
                  {result && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-sm text-muted-foreground">Executing...</div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                    <div className="text-sm text-destructive font-medium mb-1">Error</div>
                    <div className="text-sm text-destructive/80">{error}</div>
                  </div>
                )}
                
                {result && (
                  <div className="bg-muted/50 rounded-md p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
                
                {!loading && !error && !result && (
                  <div className="text-sm text-muted-foreground text-center p-8">
                    Execute the method to see results
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Method Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">RPC Method</div>
                  <div className="font-mono text-sm text-muted-foreground">{method.method}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-sm text-muted-foreground capitalize">{method.category}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium">Wallet Support</div>
                  <div className="flex gap-2 mt-1">
                    {method.walletTypes.map(type => (
                      <Badge key={type} variant="outline" size="sm">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
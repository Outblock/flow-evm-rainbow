import type { NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RPC_METHODS, CATEGORIES } from '@/lib/rpc-methods'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Home: NextPage = () => {
  const methodsByCategory = RPC_METHODS.reduce((acc, method) => {
    if (!acc[method.category]) {
      acc[method.category] = []
    }
    acc[method.category].push(method)
    return acc
  }, {} as Record<string, typeof RPC_METHODS>)

  return (
    <>
      <Head>
        <title>Flow EVM Test dApp</title>
        <meta
          content="Testing dApp for EOA and Smart Contract wallets on Flow EVM"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <MainLayout title="Dashboard">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Flow EVM Test dApp</h2>
            <p className="text-muted-foreground">
              Test and debug various Ethereum RPC methods for both EOA and Smart Contract wallets.
              Use the sidebar to navigate to specific RPC method tests.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CATEGORIES).map(([key, category]) => {
              const methods = methodsByCategory[key] || []
              
              return (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {category.name}
                      <Badge variant="secondary">{methods.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {key === 'wallet' && 'Connection and account management'}
                      {key === 'network' && 'Network switching and information'}
                      {key === 'transaction' && 'Transaction operations'}
                      {key === 'signing' && 'Message and data signing'}
                      {key === 'contract' && 'Smart contract interactions'}
                      {key === 'asset' && 'Token and asset management'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {methods.slice(0, 3).map((method) => (
                        <Link key={method.id} href={`/methods/${method.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-auto p-2"
                          >
                            <div className="text-left">
                              <div className="font-medium text-sm">{method.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {method.method}
                              </div>
                            </div>
                          </Button>
                        </Link>
                      ))}
                      {methods.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center py-1">
                          +{methods.length - 3} more methods
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Get started by connecting your wallet and exploring the RPC methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">EOA Wallets</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Test with MetaMask, WalletConnect, Coinbase Wallet, and other EOA wallets
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">MetaMask</Badge>
                    <Badge variant="outline">WalletConnect</Badge>
                    <Badge variant="outline">Coinbase</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Smart Contract Wallets</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Test with Account Abstraction wallets and smart contract wallets
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">AA Wallets</Badge>
                    <Badge variant="outline">Safe</Badge>
                    <Badge variant="outline">Biconomy</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  )
}

export default Home

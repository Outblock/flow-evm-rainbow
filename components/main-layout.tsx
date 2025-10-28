'use client'

import { ReactNode } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Sidebar } from './sidebar'

interface MainLayoutProps {
  children: ReactNode
  title?: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-between items-center">
          <div>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
          </div>
          <ConnectButton showBalance={true} />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
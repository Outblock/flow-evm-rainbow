import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      setIsMobile(mobileRegex.test(userAgent))
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return isMobile
}

export function useIsWalletWebView() {
  const [isWalletWebView, setIsWalletWebView] = useState(false)

  useEffect(() => {
    const checkWalletWebView = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      // Common wallet WebView user agents
      const walletWebViewRegex = /(trust|metamask|coinbase|tokenpocket|rainbow|zerion|imtoken|1inch|safepal)/i
      setIsWalletWebView(walletWebViewRegex.test(userAgent))
    }

    checkWalletWebView()
  }, [])

  return isWalletWebView
}
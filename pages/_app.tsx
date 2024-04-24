import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { config } from '../component/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import {NextUIProvider} from "@nextui-org/react";
// import { publicProvider } from "wagmi/providers/public";

const flowPreviewnet = {
  id: 646,
  name: 'Flow Previewnet',
  nativeCurrency: { name: 'Flow', symbol: 'FLOW', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://previewnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'FlowDiver',
      url: 'https://previewnet.flowdiver.io',
      apiUrl: 'https://previewnet.flowdiver.io/api',
    },
  },
  contracts: {},
}

const client = new QueryClient();

if (typeof window !== "undefined") { 
  window.addEventListener("message", d => {
    console.log("Harness Message Received", d.data)
  })
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider theme={darkTheme()}>
              <main className="dark text-foreground bg-background">
                <Component {...pageProps} />
              </main>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}

export default MyApp;

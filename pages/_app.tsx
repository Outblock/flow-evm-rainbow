import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

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
import { getDefaultConfig, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';
// import { publicProvider } from "wagmi/providers/public";

const projectId = 'c284f5a3346da817aeca9a4e6bc7f935'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [trustWallet, walletConnectWallet, injectedWallet, rainbowWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: 'c284f5a3346da817aeca9a4e6bc7f935',
  }
);

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

const config = createConfig({
  connectors: connectors,
  chains: [flowPreviewnet],
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
});
const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

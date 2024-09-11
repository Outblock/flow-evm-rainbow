import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    rainbowWallet,
    trustWallet,
    walletConnectWallet,
    injectedWallet
  } from '@rainbow-me/rainbowkit/wallets';

const projectId = "c284f5a3346da817aeca9a4e6bc7f935"

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [trustWallet, walletConnectWallet, injectedWallet, rainbowWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: projectId,
  }
);

const flow = {
    id: 545,
    name: 'Flow testnet',
    nativeCurrency: { name: 'Flow', symbol: 'FLOW', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://testnet.evm.nodes.onflow.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'FlowDiver',
        url: 'https://evm-testnet.flowscan.io',
        apiUrl: 'https://evm-testnet.flowscan.io/api',
      },
    },
    contracts: {},
  }

export const config = createConfig({
    connectors: connectors,
  chains: [flow],
  transports: {
    [flow.id]: http(),
  },
  ssr: true
})
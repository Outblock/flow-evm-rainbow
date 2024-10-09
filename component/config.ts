import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia, flowMainnet, flowTestnet } from '@wagmi/core/chains'
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

export const config = createConfig({
  connectors: connectors,
  chains: [mainnet, flowMainnet, flowTestnet],
  transports: {
    [mainnet.id]: http(),
    [flowMainnet.id]: http(),
    [flowTestnet.id]: http(),
  },
  ssr: true
})
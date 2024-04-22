import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'

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

export const config = createConfig({
  chains: [flowPreviewnet],
  transports: {
    [flowPreviewnet.id]: http(),
  },
})
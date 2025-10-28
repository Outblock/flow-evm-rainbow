export interface RPCMethod {
  id: string
  name: string
  method: string
  description: string
  params?: any[]
  category: 'wallet' | 'transaction' | 'signing' | 'network' | 'contract' | 'asset'
  walletTypes: ('EOA' | 'Smart Contract')[]
  metamaskDoc?: string
  exampleParams?: any[]
}

export const RPC_METHODS: RPCMethod[] = [
  // Wallet Connection & Info
  {
    id: 'eth_requestAccounts',
    name: 'Request Accounts',
    method: 'eth_requestAccounts',
    description: 'Request user accounts from wallet',
    category: 'wallet',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_requestAccounts/',
    exampleParams: []
  },
  {
    id: 'eth_accounts',
    name: 'Get Accounts',
    method: 'eth_accounts',
    description: 'Get currently connected accounts',
    category: 'wallet',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_accounts/',
    exampleParams: []
  },
  {
    id: 'eth_coinbase',
    name: 'Get Coinbase',
    method: 'eth_coinbase',
    description: 'Get the coinbase address',
    category: 'wallet',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_coinbase/',
    exampleParams: []
  },
  {
    id: 'eth_chainId',
    name: 'Chain ID',
    method: 'eth_chainId',
    description: 'Get current chain ID',
    category: 'network',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_chainId/',
    exampleParams: []
  },
  {
    id: 'net_version',
    name: 'Network Version',
    method: 'net_version',
    description: 'Get the network version ID',
    category: 'network',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/net_version/',
    exampleParams: []
  },
  
  // Network Operations
  {
    id: 'wallet_switchEthereumChain',
    name: 'Switch Chain',
    method: 'wallet_switchEthereumChain',
    description: 'Switch to a different Ethereum chain',
    category: 'network',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_switchEthereumChain/',
    exampleParams: [{
      "chainId": "0x2eb"
    }]
  },
  {
    id: 'wallet_addEthereumChain',
    name: 'Add Chain',
    method: 'wallet_addEthereumChain',
    description: 'Add a new Ethereum chain',
    category: 'network',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_addEthereumChain/',
    exampleParams: [{
      "chainId": "0x2eb",
      "chainName": "EVM on Flow",
      "nativeCurrency": {
        "name": "Flow",
        "symbol": "FLOW",
        "decimals": 18
      },
      "rpcUrls": ["https://mainnet.evm.nodes.onflow.org"],
      "blockExplorerUrls": ["https://evm.flowscan.io"]
    }]
  },
  
  // Transaction Operations
  {
    id: 'eth_sendTransaction',
    name: 'Send Transaction',
    method: 'eth_sendTransaction',
    description: 'Send a transaction',
    category: 'transaction',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_sendTransaction/',
    exampleParams: [{
      "to": "0x742d35cc6634c0532925a3b8d50d4c0332b9d002",
      "value": "0x16345785d8a0000",
      "gas": "0x5208"
    }]
  },
  {
    id: 'eth_estimateGas',
    name: 'Estimate Gas',
    method: 'eth_estimateGas',
    description: 'Estimate gas for a transaction',
    category: 'transaction',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_estimateGas/',
    exampleParams: [{
      "to": "0x742d35cc6634c0532925a3b8d50d4c0332b9d002",
      "value": "0x16345785d8a0000"
    }]
  },
  {
    id: 'eth_getTransactionByHash',
    name: 'Get Transaction',
    method: 'eth_getTransactionByHash',
    description: 'Get transaction by hash',
    category: 'transaction',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_getTransactionByHash/',
    exampleParams: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"]
  },
  
  // Signing Operations
  {
    id: 'eth_sign',
    name: '⚠️ ETH Sign (Deprecated)',
    method: 'eth_sign',
    description: '⚠️ DEPRECATED: Sign data with eth_sign (high security risk - testing only)',
    category: 'deprecated',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_sign/',
    exampleParams: ["0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", "0x68656c6c6f20776f726c64"]
  },
  {
    id: 'personal_sign',
    name: 'Personal Sign',
    method: 'personal_sign',
    description: 'Sign a message with personal_sign',
    category: 'signing',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/personal_sign/',
    exampleParams: ["Hello, Flow EVM!", "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83"]
  },
  {
    id: 'personal_ecRecover',
    name: 'Personal EC Recover',
    method: 'personal_ecRecover',
    description: 'Recover address from signature',
    category: 'signing',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/personal_ecRecover/',
    exampleParams: ["Hello, Flow EVM!", "0x...signature..."]
  },
  {
    id: 'eth_signTypedData',
    name: '⚠️ Sign Typed Data v1 (Legacy)',
    method: 'eth_signTypedData',
    description: '⚠️ LEGACY: Sign structured data v1 (use v4 instead)',
    category: 'deprecated',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_signTypedData/',
    exampleParams: [[{"type": "string", "name": "message", "value": "Hello Flow EVM!"}], "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83"]
  },
  {
    id: 'eth_signTypedData_v3',
    name: '⚠️ Sign Typed Data v3 (Legacy)',
    method: 'eth_signTypedData_v3',
    description: '⚠️ LEGACY: Sign structured data v3 (use v4 instead)',
    category: 'deprecated',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_signTypedData_v3/',
    exampleParams: ["0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", {"types": {"EIP712Domain": [{"name": "name", "type": "string"}, {"name": "version", "type": "string"}, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}], "Person": [{"name": "name", "type": "string"}, {"name": "wallet", "type": "address"}], "Mail": [{"name": "from", "type": "Person"}, {"name": "to", "type": "Person"}, {"name": "contents", "type": "string"}]}, "primaryType": "Mail", "domain": {"name": "Flow EVM Mail", "version": "1", "chainId": 747, "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"}, "message": {"from": {"name": "Cow", "wallet": "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83"}, "to": {"name": "Bob", "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"}, "contents": "Hello, Bob!"}}]
  },
  {
    id: 'eth_signTypedData_v4',
    name: 'Sign Typed Data v4',
    method: 'eth_signTypedData_v4',
    description: '✅ RECOMMENDED: Sign structured data v4 (current standard)',
    category: 'signing',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_signTypedData_v4/',
    exampleParams: ["0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", {"types": {"EIP712Domain": [{"name": "name", "type": "string"}, {"name": "version", "type": "string"}, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}], "Person": [{"name": "name", "type": "string"}, {"name": "wallet", "type": "address"}], "Mail": [{"name": "from", "type": "Person"}, {"name": "to", "type": "Person"}, {"name": "contents", "type": "string"}]}, "primaryType": "Mail", "domain": {"name": "Flow EVM Mail", "version": "1", "chainId": 747, "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"}, "message": {"from": {"name": "Cow", "wallet": "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83"}, "to": {"name": "Bob", "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"}, "contents": "Hello, Bob!"}}]
  },
  
  // Contract Operations
  {
    id: 'eth_call',
    name: 'Contract Call',
    method: 'eth_call',
    description: 'Call contract method (read-only)',
    category: 'contract',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_call/',
    exampleParams: [{
      "to": "0x742d35cc6634c0532925a3b8d50d4c0332b9d002",
      "data": "0x06fdde03"
    }, "latest"]
  },
  {
    id: 'eth_getCode',
    name: 'Get Contract Code',
    method: 'eth_getCode',
    description: 'Get contract bytecode',
    category: 'contract',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_getCode/',
    exampleParams: ["0x742d35cc6634c0532925a3b8d50d4c0332b9d002", "latest"]
  },
  
  // Asset Operations
  {
    id: 'wallet_watchAsset',
    name: 'Watch Asset',
    method: 'wallet_watchAsset',
    description: 'Add token to wallet',
    category: 'asset',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_watchAsset/',
    exampleParams: [{
      "type": "ERC20",
      "options": {
        "address": "0x742d35cc6634c0532925a3b8d50d4c0332b9d002",
        "symbol": "FLOW",
        "decimals": 18,
        "image": "https://cryptologos.cc/logos/flow-flow-logo.png"
      }
    }]
  },
  {
    id: 'eth_getBalance',
    name: 'Get Balance',
    method: 'eth_getBalance',
    description: 'Get account balance',
    category: 'asset',
    walletTypes: ['EOA', 'Smart Contract'],
    metamaskDoc: 'https://docs.metamask.io/wallet/reference/json-rpc-methods/eth_getBalance/',
    exampleParams: ["0x742d35cc6634c0532925a3b8d50d4c0332b9d002", "latest"]
  }
]

export const CATEGORIES = {
  wallet: { name: 'Wallet', icon: 'Wallet' },
  network: { name: 'Network', icon: 'Globe' },
  transaction: { name: 'Transactions', icon: 'ArrowRightLeft' },
  signing: { name: 'Signing', icon: 'PenTool' },
  contract: { name: 'Contracts', icon: 'FileCode' },
  asset: { name: 'Assets', icon: 'Coins' },
  deprecated: { name: 'Deprecated', icon: 'AlertTriangle' }
} as const
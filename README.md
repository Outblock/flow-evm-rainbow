# Flow EVM RPC Playground

Sandbox UI for exercising common JSON-RPC methods against Flow EVM wallets. The app is built with [Next.js](https://nextjs.org/), [wagmi](https://wagmi.sh), and [RainbowKit](https://rainbowkit.com).

## Features

- Wallet connect/disconnect via RainbowKit.
- Quick actions for frequently used RPC methods such as `eth_chainId`, `eth_sendTransaction`, and the EIP-712 signature family.
- JSON editors that let you paste custom payloads and instantly re-run a method.
- Input normalisation for the EIP-712 signature methods so MetaMask accepts both default and custom payloads.
- Token presets for `wallet_watchAsset` covering popular Flow EVM ERC-20 contracts (USDF, WFLOW, BETA, Catseye, Bartholomeow, Pawderick) including logo URLs.

## Quick Start

```bash
bun install
bun dev
```

Open `http://localhost:3000` and connect a Flow EVM compatible wallet (MetaMask, Flow Wallet with EVM support, etc).

## RPC Methods Covered

- `eth_requestAccounts`
- `eth_accounts`
- `eth_coinbase`
- `eth_chainId`
- `net_version`
- `wallet_switchEthereumChain`
- `wallet_addEthereumChain`
- `eth_sendTransaction`
- `eth_estimateGas`
- `eth_getTransactionByHash`
- `eth_sign`
- `personal_sign`
- `personal_ecRecover`
- `eth_signTypedData`
- `eth_signTypedData_v3`
- `eth_signTypedData_v4`
- `eth_call`
- `eth_getCode`
- `wallet_watchAsset`
- `eth_getBalance`

Each method includes default params, quick-fill helpers, and relevant MetaMask documentation links within the UI.

## Web3 SDKs & Libraries

- `wagmi`: account state, signing helpers, balance queries, typed-data verification stubs.
- `viem`: utilities such as `parseEther` for transaction prep.
- `RainbowKit`: wallet onboarding and network switching UI.
- Native `window.ethereum.request`: raw JSON-RPC execution routed through the connected wallet.

The playground shows how to mix high-level wagmi hooks with low-level RPC calls—useful when you need to debug wallet behaviour or compare SDK abstractions with the underlying requests.

## Contributing

Feel free to tweak methods or add more presets. Most of the logic lives in `pages/methods/[methodId].tsx`.

import { ethers } from 'ethers'
import Web3 from 'web3'
import { Common, CustomChain } from '@ethereumjs/common'

export const pk =
  'e1256c0c1f28a19da3aa5e03c22ad45db973e4f4a7510e502c1c74d3f1b18eb9'

export function getEVMProvider(network) {
  let url = ''

  if (network == 'previewnet') {
    url = 'https://previewnet.evm.nodes.onflow.org'
  }
  let povider = new Web3(url)

  return povider
}

export function getCommon(network) {
  let chainId = 646
  if (network == 'previewnet') {
    chainId = 646
  }
  return Common.custom({ chainId: Number(chainId) })
}

export function getSinger(provider) {
  const wallet = new ethers.Wallet(pk, provider)

  return wallet
}

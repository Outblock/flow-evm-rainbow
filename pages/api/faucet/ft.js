import { getEVMProvider, getCommon, pk } from '../../../config'
import abi from '../../../config/erc20.json'
import { LegacyTransaction } from '@ethereumjs/tx'

async function handler(req, res) {
  // const { network } = req.query
  const network = req.headers.network || req.query.network || 'previewnet'
  const address = req.headers.address || req.query.address

  const provider = getEVMProvider(network)

  if (address) {
    const ftContract = new provider.eth.Contract(
      abi,
      '0xD89622d03DF97276569004d127943de4a72fCE8F',
    )
    const sender = '0xFaE44894072A1AcfF4D0CbEf8E5F30F2FD88fdc1'
    const count = await provider.eth.getTransactionCount(sender)

    // const privKey = Buffer.from(pk, 'hex')
    // var transaction = new Transaction(rawTransaction, { chain: 'rinkeby' });
    // const amount = provider.utils.toHex("1")
    // const amount = provider.utils.toHex('')

    const rawTransaction = {
      from: sender,
      gasPrice: provider.utils.toHex(20 * 1e9),
      gasLimit: provider.utils.toHex(410000),
      to: '0xD89622d03DF97276569004d127943de4a72fCE8F',
      value: '0x0',
      data: ftContract.methods.mint(address, 2000000000000000000).encodeABI(),
      nonce: provider.utils.toHex(count),
    }

    const signedTx = await provider.eth.accounts.signTransaction(
      rawTransaction,
      pk,
    )

    const ress = await provider.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )

    // const trx = LegacyTransaction.fromTxData(rawTransaction, { common })
    // const signedTx = trx.sign(privKey)

    // provider.eth
    //   .sendSignedTransaction('0x' + signedTx.serialize().toString('hex'))
    //   .on('transactionHash', (hash) => {
    //     console.log(hash)
    //   })
    //   .on('receipt', function (receipt) {
    //     console.log(receipt)
    //   })

    const resObj = {
      res: ress.transactionHash,
      network,
      status: 200,
    }
    res.status(200).json(resObj)
  } else {
    res.status(200).json({})
  }
}

export default handler

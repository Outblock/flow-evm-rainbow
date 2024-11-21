import { LegacyTransaction } from '@ethereumjs/tx'
import axios from 'axios'

async function handler(req, res) {
  // const { network } = req.query
  const network = req.headers.network || req.query.network || 'testnet'
  const address = req.headers.address || req.query.address
  const data = req.headers.data || req.query.data

  const ress = await axios.get(
    `https://test.lilico.app/api/evm/decodeData?network=${network}&data=${data}&address=${address}`,
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
    data: ress.data,
    network,
    status: 200,
  }
  res.status(200).json(resObj)
}

export default handler

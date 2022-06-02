import WalletConnect from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { INFURA_ID } from '../constants/config'

const getProviderOptions = () => {
  const infuraId = INFURA_ID
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'CRP',
        infuraId,
      },
    },
  }
  return providerOptions
}

export { getProviderOptions }

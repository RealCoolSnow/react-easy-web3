import {
  ConnectState,
  IWeb3Event,
  useEasyWeb3,
  Web3Callback,
  Web3EventType,
} from '@/service/web3'
import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

const ConnectWallet = () => {
  const { t } = useTranslation()
  const web3callback: Web3Callback = (e: IWeb3Event) => {
    switch (e.type) {
      case Web3EventType.Provider_Disconnect:
        alert(typeof e.data == 'string' ? e.data : JSON.stringify(e.data))
        break
    }
  }
  const { easyWeb3, connectState, walletInfo } = useEasyWeb3(web3callback)
  const onConnect = () => {
    easyWeb3.connectWallet()
  }
  const onDisconnect = () => {
    easyWeb3.disconnect()
  }
  return (
    <>
      {connectState == ConnectState.Disconnected && (
        <button
          className="text-sm bg-primary text-white px-6 py-2 btn rounded-full flex shadow shadow-gray-500/50"
          onClick={onConnect}
        >
          <span>{t('connect')}</span>
          <span className="hidden sm:block sm:ml-1">{t('wallet')}</span>
        </button>
      )}
      {connectState == ConnectState.Connecting && (
        <CircularProgress color="secondary" size="1.2rem" />
      )}
      {connectState == ConnectState.Connected && (
        <div className="flex flex-col items-center btn" onClick={onDisconnect}>
          <span className="text-primary">
            {easyWeb3.getAddressShort(walletInfo.address)}
          </span>
          <span className="text-sm">
            {easyWeb3.getBalanceShort(walletInfo.balance)}&nbsp;ETH
          </span>
        </div>
      )}
    </>
  )
}

export default ConnectWallet

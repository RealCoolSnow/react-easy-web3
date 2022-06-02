import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { EventBus, Registry } from './helper/event-bus'
import { getChainData } from './helper/utilities'
import {
  IConnectInfo,
  IProviderMessage,
  IProviderRpcError,
  IWalletInfo,
  Web3Callback,
  Web3Error,
  Web3EventType,
  IWeb3Event,
  ConnectState,
} from './types'

const TAG = 'EasyWeb3'

const DEFAULT_WALLET_INFO: IWalletInfo = {
  signer: '',
  address: '',
  chainId: 1,
  network: {},
  balance: '0',
}

const WEB3_MESSAGE = 'web3-message'

/**
 * 
 *
 */
class EasyWeb3 {
  private static instance: EasyWeb3
  private web3Modal: Web3Modal
  private web3Provider: any //Web3Provider
  private walletInfo: IWalletInfo = DEFAULT_WALLET_INFO
  private chainId = 1
  private connectState: ConnectState = ConnectState.Disconnected

  public static getInstance(): EasyWeb3 {
    if (!EasyWeb3.instance) {
      EasyWeb3.instance = new EasyWeb3()
    }
    return EasyWeb3.instance
  }

  private constructor() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      // providerOptions: getProviderOptions(),
    })
  }

  public getNetwork = () => getChainData(this.chainId).network

  /**
   * connect to wallet if cached before
   */
  public connectWalletIfCached(): void {
    if (this.web3Modal.cachedProvider) {
      this.connectWallet()
    }
  }
  /**
   * connect to wallet
   */
  public connectWallet = async (): Promise<void> => {
    try {
      if (this.connectState !== ConnectState.Disconnected) {
        return
      }
      this.connectState = ConnectState.Connecting
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Connecting,
      })
      if (!this.web3Provider) {
        const instance = await this.web3Modal.connect()
        await this.subscribeProvider(instance)
        this.web3Provider = new ethers.providers.Web3Provider(instance, 'any')
      }
      await this.updateWalletInfo()
      this.connectState = ConnectState.Connected
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Connect,
      })
    } catch (error: any) {
      console.log(TAG, 'connectWallet', error)
      this.connectState = ConnectState.Disconnected
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Disconnect,
        data: error.message || JSON.stringify(error),
      })
    }
  }

  /**
   * subscribe provider event
   * @param provider
   * @returns
   */
  private subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return
    }
    // provider.on('close', () => {
    //   console.log(TAG, 'close')
    //   this.clearAll()
    // })
    provider.on(
      Web3EventType.Provider_AccountsChanged,
      async (accounts: string[]) => {
        console.log(TAG, Web3EventType.Provider_AccountsChanged, accounts)
        if (accounts.length <= 0) {
          this.connectState = ConnectState.Disconnected
          EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
            type: Web3EventType.Provider_Disconnect,
          })
        } else {
          await this.updateWalletInfo()
        }
        EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_AccountsChanged,
          data: accounts,
        })
      },
    )
    provider.on(Web3EventType.Provider_Connect, async (info: IConnectInfo) => {
      console.log(TAG, Web3EventType.Provider_Connect, info)
      this.connectState = ConnectState.Connected
      await this.updateWalletInfo()
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Connect,
        data: info,
      })
    })

    provider.on(
      Web3EventType.Provider_Disconnect,
      (error: IProviderRpcError) => {
        console.log(TAG, Web3EventType.Provider_Disconnect, error)
        this.connectState = ConnectState.Disconnected
        EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_Disconnect,
          data: error,
        })
      },
    )

    provider.on(
      Web3EventType.Provider_ChainChanged,
      async (chainId: string) => {
        console.log(TAG, Web3EventType.Provider_ChainChanged, chainId)
        await this.updateWalletInfo()
        EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
          type: Web3EventType.Provider_ChainChanged,
          data: chainId,
        })
      },
    )
    provider.on(Web3EventType.Provider_Message, (message: IProviderMessage) => {
      console.log(TAG, Web3EventType.Provider_Message, message)
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Message,
        data: message,
      })
    })
  }
  /**
   *
   * @param cb (event:Web3Event, data?:any) => {}
   * @returns Registry
   */
  public registerEvent(cb: Web3Callback): Registry {
    return EventBus.getInstance().register(WEB3_MESSAGE, cb)
  }
  /**
   *
   * @param registry
   */
  public unregisterEvent(registry: Registry) {
    registry.unregister()
  }
  /**
   *
   * @returns ETH balance
   */
  public async getBalance() {
    if (this.walletInfo.signer) {
      const balance = await this.walletInfo.signer.getBalance()
      return ethers.utils.formatEther(balance)
    } else {
      throw new Error(Web3Error.WalletNotConnected)
    }
  }
  /**
   *
   * @returns
   */
  public getConnectState(): ConnectState {
    return this.connectState
  }
  /**
   *
   * @returns
   */
  public getWalletInfo(): IWalletInfo {
    return this.walletInfo
  }
  /**
   * short address (like 0xa2C...F6f9)
   * @param addr - wallet address
   * @returns
   */
  public getAddressShort(addr?: string): string {
    const address = addr || this.walletInfo.address
    if (address.length > 10)
      return `${address.slice(0, 5)}...${address.slice(-4)}`
    return address
  }
  /**
   * short balance (eg. convert 1.190713439868281787 to 1.1907)
   * @param _balance
   * @returns
   */
  public getBalanceShort(_balance: string): string {
    const balance = _balance || this.walletInfo.balance
    const n = Number(balance)
    return n > 0 ? n.toFixed(4) : '0'
  }
  /**
   *
   */
  public getSigner() {
    if (this.isConnected()) return this.walletInfo.signer
    return false
  }

  public isConnected() {
    return this.connectState == ConnectState.Connected
  }
  /**
   * update wallet info
   */
  private async updateWalletInfo() {
    const signer = this.web3Provider.getSigner()
    this.walletInfo.signer = signer
    this.walletInfo.address = await signer.getAddress()
    this.walletInfo.chainId = await signer.getChainId()
    this.walletInfo.network = await this.web3Provider.getNetwork()
    this.walletInfo.balance = await this.getBalance()
    console.log(TAG, 'updateWalletInfo', this.walletInfo)
  }
  /**
   * disconnect
   */
  public disconnect() {
    if (this.web3Provider) {
      this.web3Modal.clearCachedProvider()
      this.connectState = ConnectState.Disconnected
      EventBus.getInstance().dispatch<IWeb3Event>(WEB3_MESSAGE, {
        type: Web3EventType.Provider_Disconnect,
        data: 'user disconnect',
      })
      this.web3Provider = null
    }
  }
}

export { EasyWeb3, DEFAULT_WALLET_INFO }

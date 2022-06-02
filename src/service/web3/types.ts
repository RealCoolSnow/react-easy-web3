export interface IWalletInfo {
  signer: any
  address: string
  chainId: number
  network: object
  balance: string //eth balance
}
// --- event ---
export interface IConnectInfo {
  chainId: string
}

export interface IProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface IProviderMessage {
  type: string
  data: unknown
}

export enum Web3Error {
  WalletNotConnected = 'Wallet not connected',
}

export enum Web3EventType {
  Provider_Connect = 'connect',
  Provider_Disconnect = 'disconnect',
  Provider_AccountsChanged = 'accountsChanged',
  Provider_ChainChanged = 'chainChanged',
  Provider_Message = 'message',
  //----custom event
  Connecting = 'connecting',
}

export interface IWeb3Event {
  type: Web3EventType
  data?: IProviderRpcError | IConnectInfo | string | IProviderMessage | string[]
}

export type Web3Callback = (e: IWeb3Event) => void

export enum ConnectState {
  Connecting,
  Connected,
  Disconnected,
}

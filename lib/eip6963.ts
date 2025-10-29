// EIP-6963: Multi Injected Provider Discovery for Ethereum Wallets

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: any
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider"
  detail: EIP6963ProviderDetail
}

export interface EIP6963RequestProviderEvent extends CustomEvent {
  type: "eip6963:requestProvider"
}

export class EIP6963Manager {
  private providers = new Map<string, EIP6963ProviderDetail>()
  private listeners: Array<(providers: EIP6963ProviderDetail[]) => void> = []

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  private init() {
    if (typeof window === 'undefined') return
    
    // Listen for wallet announcements
    window.addEventListener("eip6963:announceProvider" as any, this.handleAnnouncement.bind(this))
    
    // Request wallets to announce themselves
    this.requestProviders()
    
    // Periodically re-request in case wallets are installed after page load
    setInterval(() => this.requestProviders(), 1000)
  }

  private handleAnnouncement(event: Event) {
    const customEvent = event as EIP6963AnnounceProviderEvent
    const { detail } = customEvent
    
    // Store the provider
    this.providers.set(detail.info.uuid, detail)
    
    // Notify listeners
    this.notifyListeners()
  }

  private requestProviders() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("eip6963:requestProvider"))
    }
  }

  private notifyListeners() {
    const providerArray = Array.from(this.providers.values())
    this.listeners.forEach(listener => listener(providerArray))
  }

  public getProviders(): EIP6963ProviderDetail[] {
    return Array.from(this.providers.values())
  }

  public getProvider(uuid: string): EIP6963ProviderDetail | undefined {
    return this.providers.get(uuid)
  }

  public onProvidersChange(listener: (providers: EIP6963ProviderDetail[]) => void) {
    this.listeners.push(listener)
    // Immediately call with current providers
    listener(this.getProviders())
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public async connectToProvider(uuid: string): Promise<string[]> {
    const providerDetail = this.getProvider(uuid)
    if (!providerDetail) {
      throw new Error(`Provider with UUID ${uuid} not found`)
    }

    const provider = providerDetail.provider
    if (!provider.request) {
      throw new Error(`Provider ${providerDetail.info.name} does not support request method`)
    }

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      return accounts
    } catch (error: any) {
      throw new Error(`Failed to connect to ${providerDetail.info.name}: ${error.message}`)
    }
  }
}

// Global instance - only create in browser environment
let _eip6963Manager: EIP6963Manager | null = null

export const getEIP6963Manager = (): EIP6963Manager => {
  if (typeof window === 'undefined') {
    throw new Error('EIP6963Manager can only be used in browser environment')
  }
  
  if (!_eip6963Manager) {
    _eip6963Manager = new EIP6963Manager()
  }
  
  return _eip6963Manager
}

// For backwards compatibility
export const eip6963Manager = typeof window !== 'undefined' ? getEIP6963Manager() : null
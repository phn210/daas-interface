export enum CONNECTOR_TYPES {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletconnect',
}

export const getStoredConnector = () => {
  return window.localStorage.getItem('connector');
};

export const setStoredConnector = (connectorType?: CONNECTOR_TYPES) => {
  if (!connectorType) {
    window.localStorage.removeItem('connector');
  } else {
    window.localStorage.setItem('connector', connectorType);
  }
};

export const getStoredChainId = () => {
  const chainId = window.localStorage.getItem('chainId');
  if (chainId !== null && !isNaN(Number(chainId))) {
    return Number(chainId);
  }
  return null;
};

export const setStoredChainId = () => {
  const chainId = window.localStorage.getItem('chainId');
  if (chainId !== null && !isNaN(Number(chainId))) {
    return Number(chainId);
  }
  return null;
};

/**
 * @see https://github.com/NoahZinsmeister/web3-react/blob/main/packages/walletconnect/src/utils.ts
 */
export async function getBestUrl(urls: string[]): Promise<string> {
  // if we only have 1 url, it's the best!
  if (urls.length === 1) return urls[0];

  const [HttpConnection, JsonRpcProvider] = await Promise.all([
    import('@walletconnect/jsonrpc-http-connection').then(({ HttpConnection }) => HttpConnection),
    import('@walletconnect/jsonrpc-provider').then(({ JsonRpcProvider }) => JsonRpcProvider),
  ]);

  // the below returns the first url for which there's been a successful call, prioritized by index
  return new Promise((resolve) => {
    let resolved = false;
    const successes: { [index: number]: boolean } = {};

    urls.forEach((url, i) => {
      const http = new JsonRpcProvider(new HttpConnection(url));
      void http
        .request({ method: 'eth_chainId' })
        .then(() => true)
        .catch(() => false)
        .then((success) => {
          // if we already resolved, return
          if (resolved) return;

          // store the result of the call
          successes[i] = success;

          // if this is the last call and we haven't resolved yet - do so
          if (Object.keys(successes).length === urls.length) {
            const index = Object.keys(successes).findIndex((j) => successes[Number(j)]);
            // no need to set resolved to true, as this is the last promise
            return resolve(urls[index === -1 ? 0 : index]);
          }

          // otherwise, for each prospective index, check if we can resolve
          new Array<number>(urls.length).fill(0).forEach((_, prospectiveIndex) => {
            // to resolve, we need to:
            // a) have successfully made a call
            // b) not be waiting on any other higher-index calls
            if (
              successes[prospectiveIndex] &&
              new Array<number>(prospectiveIndex).fill(0).every((_, j) => successes[j] === false)
            ) {
              resolved = true;
              resolve(urls[prospectiveIndex]);
            }
          });
        });
    });
  });
}

export function getStoredMockAddress(): string | undefined {
  return window.localStorage.getItem('mockAddress') ?? undefined;
}

export function setStoredMockAddress(address: string | undefined) {
  if (address === undefined) {
    window.localStorage.removeItem('mockAddress');
  } else {
    window.localStorage.setItem('mockAddress', address);
  }
}

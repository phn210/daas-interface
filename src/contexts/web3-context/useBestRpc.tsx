import { useEffect, useState } from 'react';
import { getBestUrl } from './utils';

export default function useBestRpc(urls: string[]): string | undefined {
  if (urls.length === 0) {
    throw new Error('Must provide at least 1 url');
  }
  const [bestRpc, setBestRpc] = useState<string>();

  useEffect(() => {
    getBestUrl(urls)
      .then((rpc) => {
        setBestRpc(rpc);
      })
      .catch((error) => {
        console.debug('Failed to find best rpc', error);
        setBestRpc(urls[0]);
      });
  }, [urls]);

  return bestRpc;
}

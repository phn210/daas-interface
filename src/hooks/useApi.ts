import axios from 'axios';
import { useMemo } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';

export function useApi() {
  const { chain } = useWeb3Context();

  return useMemo(() => {
    const baseURL = 'http://localhost:5000/api';
    const ipfsURL = 'https://ipfs.infura-ipfs.io/ipfs';
    return {
      dashboardClient: axios.create({ baseURL: `${baseURL}/` }),
      client: axios.create({ baseURL: baseURL }),
      ipfsClient: axios.create({baseURL: `${ipfsURL}/`})
    };
  }, [chain]);
}

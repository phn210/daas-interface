import axios from 'axios';
import { useMemo } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';

export function useApi() {
  const { chain } = useWeb3Context();

  return useMemo(() => {
    const baseURL = process.env.REACT_APP_API || 'http://localhost:5000/api';
    const ipfsURL = 'https://daas.infura-ipfs.io/ipfs';
    const ipfsUploadURL = 'https://ipfs.infura.io:5001/api/v0'
    return {
      client: axios.create({ baseURL: baseURL }),
      ipfsClient: axios.create({baseURL: `${ipfsURL}/`}),
      ipfsUploadClient: axios.create({baseURL: `${ipfsUploadURL}`})
    };
  }, [chain]);
}

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useApi } from 'src/hooks/useApi';
import { useCacheContext, useCacheData } from '../cache-context';
import { DAO } from './types';

interface DAOsContextData {
    status: FetchingStatus;
    data: {
        daoList: DAO[];
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
    fetch: () => Promise<void>;
}

const DAOsContext = createContext({} as DAOsContextData);

export function DAOsProvider({ children }: BaseContextProps){
    const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
    const [error, setError] = useState<Error | undefined>();
    const data = useCacheData('daos', { daoList: [] });
    const { push, clear } = useCacheContext();
    const { client } = useApi();

    const fetchData = async () => {
        try {
            if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
                setStatus(FetchingStatus.FETCHING);
            } else {
                setStatus(FetchingStatus.UPDATING);
            }
            
            const daos = await Promise.all([client.get('/daos').then((res) => {
                // console.log(res.data.data)
                return res.data.data as Array<any>
            })])
            push('daos.daoList', daos[0]);
            // console.log(daos)
            setStatus(FetchingStatus.SUCCESS);
            setError(undefined);
        } catch (error) {
            console.error('Failed to fetch DAOs data', error);
            setError(error as Error);
            setStatus(FetchingStatus.FAILED);
            clear('daos.daoList');
        }
    }

    return (
        <DAOsContext.Provider
            value={{
                status,
                data,
                error,
                fetch: fetchData
            }}
        >
            {children}
        </DAOsContext.Provider>
    );
}

export const useDAOsContext = () => useContext(DAOsContext);
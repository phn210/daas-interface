import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BASE18, FetchingStatus } from 'src/constants';
import { BaseContextProps } from 'src/global';
import { useMulticall } from 'src/hooks/multicall';
import { useDAOFactoryContract, useGovernorContract } from 'src/hooks/useContract';
import { useApi } from 'src/hooks/useApi';
import { useAppContext } from 'src/contexts/app-context';
import { useCacheContext, useCacheData } from 'src/contexts/cache-context';
import { resolveDAOId } from 'src/utils/resolve';
import { getIpfsHash } from 'src/utils/ipfs';
import { DAO, Event } from './types';

interface DAOContextData {
    status: FetchingStatus;
    data: {
        dao: DAO;
        contracts: any;
        events: any[];
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
    fetch: (daoId: string) => Promise<void>;
}

const DAOContext = createContext({} as DAOContextData);

export function DAOProvider({ children }: BaseContextProps){
    const [status, setStatus] = useState<FetchingStatus>(FetchingStatus.IDLE);
    const [error, setError] = useState<Error | undefined>();
    const data = useCacheData('dao', {});
    const multicall = useMulticall();
    const { push, clear } = useCacheContext();
    const { client, ipfsClient } = useApi();
    const { daoFactoryAddresses } = useAppContext();
    const governorContract = useGovernorContract(undefined);
    if (!governorContract) throw new Error('Connection error');

    const fetchData = async (daoId: string) => {
        try {
            if (status === FetchingStatus.IDLE || status === FetchingStatus.FAILED) {
                setStatus(FetchingStatus.FETCHING);
            } else {
                setStatus(FetchingStatus.UPDATING);
            }
            const resolvedId = resolveDAOId(daoId);
            const dao = (await Promise.all([client.get(`/daos/${daoId}`).then((res) => {
                // console.log(res.data.data)
                return res.data.data as DAO
            })]))[0]
            const ipfsHash = getIpfsHash(dao.infoHash);

            

            const [daoInfo, daoContracts, daoEvents, ] = await Promise.all([
                ipfsClient.get(ipfsHash??'QmZskAJu484DK9zCCekrLPdPRBAAUEQtRvVRiHsGvUXzqd').then(res => res.data as any),
                client.get(`/contracts/${daoId}`).then(res => res.data.data as any),
                client.get(`/events/${daoId}`).then(res => res.data.data as any),
                // governorContract.admins(0)
            ])
            Object.assign(dao, daoInfo);


            push('dao.dao', dao);
            push('dao.contracts', daoContracts);
            push('dao.events', daoEvents as Event[]);
            // console.log(daoContracts);
            // console.log(daoEvents);
            // console.log(admins);
            setStatus(FetchingStatus.SUCCESS);
            setError(undefined);
        } catch (error) {
            console.error('Failed to fetch DAOs data', error);
            setError(error as Error);
            setStatus(FetchingStatus.FAILED);
            clear('dao.dao');
        }
    }

    return (
        <DAOContext.Provider
            value={{
                status,
                data,
                error,
                fetch: fetchData
            }}
        >
            {children}
        </DAOContext.Provider>
    );
}

export const useDAOContext = () => useContext(DAOContext);
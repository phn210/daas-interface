import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DAO } from 'src/contexts/daos-context/types';
import { useDAOsContext } from 'src/contexts/daos-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { FetchingStatus } from 'src/constants';
import Loading from 'src/components/Loading';
import Failed from 'src/components/Failed';
import Empty from 'src/components/Empty';
import { getErrorMessage } from 'src/utils';
import DAOItem from './DAOItem';

type DAOListProps = {
    // filterNetwork: string;
    // filterState: number;
    searchName: string;
}

export default function DAOList(props: DAOListProps) {
    const { activating } = useWeb3Context();
    const { status, data, error, fetch } = useDAOsContext();

    const list = useMemo(() => {
        // if (props.searchName) {
        //     const dataSearch = [];
        //     const dataDAOList = data?.daoList ? Object.values(data.daoList) : [];
        //     const lengthProposal = dataDAOList.length;
        //     for (let i = 0; i < lengthProposal; i++) {
        //         if (dataDAOList[i].name?.toLocaleLowerCase().includes(props.searchName.toLocaleLowerCase())) {
        //             dataSearch.push(dataDAOList[i]);
        //         }
        //     }
        //     return dataSearch;
        // }
        return data?.daoList ? data.daoList : [];
    }, [data?.daoList, props.searchName]);

    return (
        <Grid
            container
            spacing={3}
            justifyContent={{xs: 'center', md: 'start'}}
            alignItems="stretch"
        >
            {(status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING || activating) && (
                <Box textAlign={'center'} py={4}>
                    <Loading size={50} />
                    <Typography color="text.secondary">Please wait a moment...</Typography>
                </Box>
            )}
            {status === FetchingStatus.FAILED && (
                <Failed title="Failed to fetch data" detail={getErrorMessage(error)}>
                    <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={() => fetch()}>
                    Reload
                    </Button>
                </Failed>
            )}
            {(status === FetchingStatus.SUCCESS || status === FetchingStatus.UPDATING) && !activating && (
                <>
                    {console.log(list)}
                    {list.map((item, index: number) => {
                        return (
                            <Grid 
                                item xs={12} sm={8} md={6} xl={4}
                                key={'dao' + item['_id'] + '' + index}
                            >
                                <RouterLink 
                                    to={`/${item['_id']}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                ><DAOItem data={item} /></RouterLink>
                                
                            </Grid>
                        );
                    })}
                </>
            )}
            
        </Grid>
    );
}
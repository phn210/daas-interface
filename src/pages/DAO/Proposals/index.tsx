import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useProposalsContext } from 'src/contexts/proposals-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { FetchingStatus } from 'src/constants';
import Loading from 'src/components/Loading';
import Failed from 'src/components/Failed';
import { getErrorMessage } from 'src/utils';
import ProposalList from './ProposalList';
import Empty from 'src/components/Empty';

type ParamsUrl = {
    daoId: string;
}

export default function Proposals() {
    const { activating, address, chain } = useWeb3Context();
    const params: ParamsUrl = useParams();
    const { fetch } = useProposalsContext();
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        fetch(params.daoId);
    }, [])

    return (
        <Box p={3}>
            <Grid className="title_and_search" container rowSpacing={{ xs: 2 }}>
                <Grid 
                    item xs={12} sm={6}
                    container columnSpacing={3}
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500'
                    }}
                >
                    <Grid item>
                        <Typography variant='h3'>Proposals</Typography>
                    </Grid>                  
                </Grid>
                <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'right' }}>
                    <TextField
                    label="Search"
                    size="small"
                    style={{ width: '-webkit-fill-available', maxWidth: '348px' }}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                    }}
                    />
                    {/* <FilterButton filterState={filterState} setFilterState={(list) => setFilterState(list)} /> */}
                    <Grid item ml={2}>
                        <RouterLink
                            to={`/${params.daoId}/proposals/create`}
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            <Button variant='contained' size='large'>Create</Button>
                        </RouterLink>
                    </Grid>  
                </Grid>
            </Grid>
            <ProposalList searchName={searchName}/>
        </Box>
    );
}
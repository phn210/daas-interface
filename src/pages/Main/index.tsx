import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Button, TextField, Typography } from '@mui/material';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useDAOsContext } from 'src/contexts/daos-context';
import DAOList from './DAOList';

export default function Main() {
    const { chain } = useWeb3Context();
    const { fetch } = useDAOsContext();
    // const [filterState, setFilterState] = useState<number[]>([]);
    const [searchName, setSearchName] = useState('');
    useEffect(() => {
        fetch();
    }, [chain]);
    return (
        <Box p={3}>
            <Grid 
                container 
                spacing={2}
                justifyContent="center"
            >
                <Grid
                    item xs={12} md={10}
                    container
                    rowSpacing={{ xs: 2 }}
                >
                    <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                        <Typography variant='h4'>DAO List</Typography>
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
                        <RouterLink to={'/daos/create'} style={{ textDecoration: 'none' }}>
                            <Button variant='contained' size='large' sx={{ ml:3 }} >Create DAO</Button>
                        </RouterLink>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={10}>
                    <DAOList searchName={searchName}/>
                </Grid>
            </Grid>
        </Box>
    );
}
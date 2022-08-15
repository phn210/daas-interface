import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, Chip, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useDAOContext } from 'src/contexts/dao-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { CHAINS } from 'src/contexts/web3-context/chains';
import { FetchingStatus } from 'src/constants';
import Loading from 'src/components/Loading';
import Failed from 'src/components/Failed';
import Empty from 'src/components/Empty';
import { getErrorMessage } from 'src/utils';
import { formatAddress, formatNumber } from 'src/utils/format';
import EventsList from './EventsList';

type ParamsUrl = {
    daoId: string;
};

export default function Overview() {
    const { activating, address, chain } = useWeb3Context();
    const params: ParamsUrl = useParams();
    const { status, data, error, fetch } = useDAOContext();

    useEffect(() => {
        fetch(params.daoId);
    }, [address, chain, params])

    return (
        <Box p={3}>
            <Grid 
                container
                rowSpacing={2}
                justifyContent='center'
            >
                {(status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING || status === FetchingStatus.UPDATING || activating) && (
                <Box textAlign={'center'} py={4}>
                    <Loading size={50} />
                    <Typography color="text.secondary">Please wait a moment...</Typography>
                </Box>
                )}
                {status === FetchingStatus.FAILED && (
                    <Failed title="Failed to fetch data" detail={getErrorMessage(error)}>
                        <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={() => fetch(params.daoId)}>
                        Reload
                        </Button>
                    </Failed>
                )}
                {(status === FetchingStatus.SUCCESS || status === FetchingStatus.UPDATING) && !activating && (
                    <>
                        <Grid 
                            item xs={12}
                            container
                            alignItems='flex-start'
                            justifyContent='center'
                        >
                            <Grid
                                item xs={12}
                                container
                                alignItems='flex-start'
                                justifyContent='flex-start'
                                direction='row'
                            >
                                <Grid
                                    item xs='auto' mr={2} mb={2}
                                >
                                    <Avatar
                                        alt="DAO's Logo"
                                        src={data.dao.logoUrl}
                                        sx={{
                                            height: 100,
                                            width: 100,
                                            border: 1,
                                            variant: 'rounded',
                                            objectFit: 'cover',
                                            mr: 2
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item xs={12} sm
                                    container 
                                    sx={{ 
                                        flexDirection: { xs: 'row', sm: 'column'} 
                                    }}
                                >
                                    <Grid item mr={2}>
                                        <Typography variant='h3'>
                                            {data.dao.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Chip 
                                            label={CHAINS[Number(data.dao.chainId)]?.name}
                                            variant='outlined'
                                            color='secondary'
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component='span' color='text.primary' variant='h5'>
                                Website:&nbsp;
                                
                            </Typography>
                            <Link 
                                href={data.dao.websiteUrl} 
                                target='_blank' 
                                underline='none'
                                sx={{ fontStyle: 'italic' }}
                            >
                                <Typography component='span' variant='h6'>{data.dao.websiteUrl}</Typography>
                            </Link>
                        </Grid>
                        <Grid
                            item xs={12}
                            container
                            spacing={2}
                        >
                            <Grid item xs={12} lg={4}
                            >
                                <Typography color='text.primary' variant='h5'>
                                    Description
                                </Typography>
                                <Box
                                    minHeight='192px'
                                    sx={{ 
                                        mt: 2,
                                        p: 4,
                                        bgcolor: 'background.paper',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Typography
                                        color='text.primary'
                                        variant='body2'
                                        align='justify'
                                        lineHeight={1.8}

                                    >
                                        {data.dao.description}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <Typography color='text.primary' variant='h5'>
                                Contracts
                                </Typography>
                                <Box
                                    minHeight='192px'
                                    sx={{ 
                                        mt: 2,
                                        p: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <List sx={{ height: '100%', overflowY: 'auto' }}>
                                        {Object.keys(data.contracts).map((key, index: number) => {
                                            switch (key) {
                                                case 'governor':
                                                    return (
                                                        <ListItem 
                                                            key={'governorContract'}
                                                            secondaryAction={
                                                                <IconButton edge="end" aria-label="delete">
                                                                    <LaunchIcon />
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemText
                                                                primary={`Governor: ${formatAddress(data.contracts.governor)}`}
                                                            />
                                                        </ListItem>
                                                    );
                                                case 'timelocks':
                                                    return data.contracts.timelocks.map((timelock: any, index: number) => {
                                                        return (
                                                            <ListItem 
                                                                key={`timelockContract${index}}`}
                                                                secondaryAction={
                                                                    <IconButton edge="end" aria-label="delete">
                                                                        <LaunchIcon />
                                                                    </IconButton>
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={`Timelock ${index}: ${formatAddress(timelock)}`}
                                                                />
                                                            </ListItem>
                                                        );
                                                    }).flat();
                                                case 'votes':
                                                    return (
                                                        <ListItem 
                                                            key={'votesContract'}
                                                            secondaryAction={
                                                                <IconButton edge="end" aria-label="delete">
                                                                    <LaunchIcon />
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemText
                                                                primary={`${data.contracts.standard}: ${formatAddress(data.contracts.votes)}`}
                                                            />
                                                        </ListItem>
                                                    );
                                                default:
                                                    break;
                                            }
                                        })}
                                    </List>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={4}
                                container spacing={2}
                                alignItems='flex-start'
                                justifyContent='center'
                            >
                                <Grid item xs={12}>
                                    <Typography color='text.primary' variant='h5'>
                                    Status
                                    </Typography>
                                    <Box
                                        // minHeight='85px'
                                        sx={{ 
                                            mt: 2,
                                            p: 3,
                                            bgcolor: 'background.paper',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <Typography
                                            color={data.dao.isRetired ? 'gray' : 'green'}
                                            variant='body1'
                                        >
                                            {(data.dao.isRetired ? 'Retired' : 'Active')}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography color='text.primary' variant='h5'>
                                    Reputation
                                    </Typography>
                                    <Box
                                        // minHeight='85px'
                                        sx={{ 
                                            mt: 2,
                                            p: 3,
                                            bgcolor: 'background.paper',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <Typography
                                            color={data.dao.isRetired ? 'black' : 'green'}
                                            variant='body1'
                                        >
                                            {(data.dao.isBlacklisted ? 'Blacklist' : 'Healthy')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid
                            item xs={12}
                        >
                            <Typography color='text.primary' variant='h5'>
                                Events
                            </Typography>
                            <Box
                                sx={{ 
                                    mt: 2,
                                    p: 4,
                                    bgcolor: 'background.paper',
                                    borderRadius: '12px'
                                }}
                            >
                                <EventsList events={data.events}/>
                            </Box>
                        </Grid>
                    </>
                )}
                
            </Grid>
        </Box>
        
    );
}
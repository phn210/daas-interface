import { Avatar, Box, Button, IconButton, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FACTORY_CONFIG } from 'src/constants';
import { GovernorConfig } from 'src/contexts/daos-context/types';
import ConfigForm from './ConfigForm';

export default function ConfigList() {
    const list = [
        {
            votingDelay: 3,
            votingPeriod: 100,
            quorumAttendance: 1000,
            quorumApproval: 1000
        },
        {
            votingDelay: 5,
            votingPeriod: 150,
            quorumAttendance: 1000,
            quorumApproval: 1000            
        }
    ];

    return (
        <Grid container spacing={1} sx={{ height: '100%' }} direction='column'>
            <Grid item container spacing={1} justifyContent='flex-start' alignItems='center' mb={1}>
                {list.length > 0 && list.map((item, index: number) => {
                    return (
                        <IconButton
                            key={'governorConfig'+index}
                            size='small'
                        >
                            <Avatar sx={{ bgcolor: 'background.default' }}>
                                {/* <AccountCircleIcon/> */}
                                <Typography color='text.primary'>{index}</Typography>
                            </Avatar>
                        </IconButton>
                    );
                })}
                {list.length < FACTORY_CONFIG.MAX_GOVERNOR_CONFIG && (
                    <IconButton
                        key={'adgovernorConfig'}
                        size='small'
                    >
                        <Avatar sx={{ bgcolor: 'background.default' }}>
                            <AddCircleOutlineIcon sx={{color:'text.primary'}}/>
                        </Avatar>
                    </IconButton>
                )}
            </Grid>
            <ConfigForm/>
        </Grid>
    );
}
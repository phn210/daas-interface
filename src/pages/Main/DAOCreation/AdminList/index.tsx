import { Wallet } from 'ethers';
import { useState } from 'react';
import { Box, Button, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import useNotifier from 'src/hooks/useNotifier';
import Empty from 'src/components/Empty';
import { isAddress } from 'src/utils';
import { formatAddress, formatNumber } from 'src/utils/format';

type Props = {
    value: string[];
    onChange: (_admins: string[]) => void;
}

export default function AdminList(props: Props) {
    const [newAdmin, setNewAdmin] = useState('');

    const onAdminDelete = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        const index = Number((ev.target as HTMLDataElement).value ?? -1)
        if (index >=0) handleAdminChange(props.value[index], false);
    }

    const onAdminAdd = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        if (isAddress(newAdmin)) handleAdminChange(newAdmin, true);
    }

    const handleAdminChange = (admin: string, isAdd: boolean) => {
        console.log(admin)
        const currentAdmins = props.value.map(addr => addr.toLowerCase());
        if (isAdd && !currentAdmins.includes(admin.toLowerCase())) {
            currentAdmins.push(admin);
            props.onChange(currentAdmins);
        } else if (!isAdd && currentAdmins.includes(admin.toLowerCase())){
            currentAdmins.splice(currentAdmins.indexOf(admin.toLowerCase()), 1)
            console.log(currentAdmins.indexOf(admin.toLowerCase()));
            props.onChange(currentAdmins);
        }
    }
    
    return (
        <Grid container spacing={1} sx={{ height: '100%' }} direction='column'>
            <Grid item container spacing={1} justifyContent='flex-start' alignItems='center'>
                <Grid item xs='auto'>
                    <Button
                        variant='contained'
                        sx={{
                            minWidth: 1
                        }}
                        onClick={onAdminAdd}
                    >
                        <AddCircleOutlineIcon/>
                    </Button>
                </Grid>
                <Grid item xs={6} md={8} xl={9}>
                    <TextField
                        id='adminAddress'
                        name='adminAddress'
                        required
                        label='Address'
                        fullWidth
                        onChange={(v) => setNewAdmin(v.target.value)}
                        size='small'
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item sx={{ height: '76%' }} mt={1}>
                {props.value.length === 0 && <Empty py={4} />}
                {props.value.length > 0 && (
                    <List sx={{ height: '100%', overflowY: 'auto' }}>
                        {props.value.map((item, index: number) => {
                            return (
                                <ListItem 
                                    key={'admin'+index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end" aria-label={`delete${index}`} value={index}
                                            onClick={onAdminDelete}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon>
                                        <AccountCircleIcon/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={formatAddress(item.toString())}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Grid>
        </Grid>
    );
}
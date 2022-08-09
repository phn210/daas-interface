import { Box, Button, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Wallet } from 'ethers';
import Empty from 'src/components/Empty';
import { formatAddress, formatNumber } from 'src/utils/format';

export default function AdminList() {
    const list = [0, 1, 2, 3, 4, 5, 6, 7].map(e => Wallet.createRandom().address);
    // const list:string[] = [];
    return (
        <Grid container spacing={1} sx={{ height: '100%' }} direction='column'>
            <Grid item container spacing={1} justifyContent='flex-start' alignItems='center'>
                <Grid item xs='auto'>
                    <Button
                        variant='contained'
                        sx={{
                            minWidth: 1
                        }}
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
                {list.length === 0 && <Empty py={4} />}
                {list.length > 0 && (
                    <List sx={{ height: '100%', overflowY: 'auto' }}>
                        {list.map((item, index: number) => {
                            return (
                                <ListItem 
                                    key={'admin'+index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
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
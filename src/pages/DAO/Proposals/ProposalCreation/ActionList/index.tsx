import { Wallet } from 'ethers';
import { Grid, TextField, Typography } from '@mui/material';
import Empty from 'src/components/Empty';


export default function ActionList() {
    const list: object[] = [
        {
            target: Wallet.createRandom().address,
            value: 0,
            signature: 'toggleWhitelistedToken(address)',
            data: [Wallet.createRandom().address]
        },
        {
            target: Wallet.createRandom().address,
            value: 0,
            signature: 'setPriceOracle(address,address)',
            data: [Wallet.createRandom().address,Wallet.createRandom().address]
        }
    ]
    return (
        <Grid
            container
            spacing={2}
            justifyContent='start'
            alignItems='center'
        >
            <Grid 
                item
                container spacing={2}
                justifyContent='flex-start' 
                alignItems='center'
            >
                <Grid item>
                    <Typography>Number of actions</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        id='numActions'
                        name='numActions'
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
            {list.length === 0 && (
                <Grid item xs={12}>
                    <Empty py={4} />
                </Grid>
            )}
            {list.length > 0 && (list.map((item, index: number) => {
                return (
                    <Grid
                        item key={'action'+index}
                        container spacing={2}
                        alignItems='center'
                    >
                        <Grid item xs={2}>
                            <Typography>Action {index+1}</Typography>
                        </Grid>
                        <Grid
                            item xs={12} md={10}
                            container spacing={1}
                            alignItems='center'
                        >
                            <Grid item>
                                <TextField
                                    id={'target'+index}
                                    name={'target'+index}
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
                            <Grid item>
                                <TextField
                                    id={'value'+index}
                                    name={'value'+index}
                                    label='Value'
                                    fullWidth
                                    size='small'
                                    InputProps={{
                                        sx: {
                                            bgcolor: 'background.default',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id={'signature'+index}
                                    name={'signature'+index}
                                    label='Signature'
                                    fullWidth
                                    size='small'
                                    InputProps={{
                                        sx: {
                                            bgcolor: 'background.default',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id={'data'+index}
                                    name={'data'+index}
                                    label='Data'
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
                    </Grid>
                );
            }))}
        </Grid>
    );
}
import { Box, Button, Grid, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function GTokenForm() {
    return (
        <Grid
            container spacing={1}
        >
            <Grid item xs={12}>
                <Typography
                    sx={{
                        color:'warning.main',
                        fontStyle: 'italic'
                    }}
                >
                    For existing tokens that follow ERC20Votes and ERC721Votes standard only.
                </Typography>
            </Grid>
            <Grid 
                item xs={12} mt={0}
                container
                spacing={1}
                justifyContent='flex-start'
                alignItems='center'
            >
                <Grid item>
                    <Switch/>
                </Grid>
                <Grid item>
                    <Typography>Deployed Address:</Typography>
                </Grid>
                <Grid item xs='auto'>
                    <TextField
                        id='gTokenAddress'
                        name='gTokenAddress'
                        fullWidth
                        size='small'
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    >
                    </TextField>
                </Grid>
            </Grid>
            <Grid
                item xs={12}
                container
                columnSpacing={4}
                rowSpacing={1}
                alignItems='center'
            >
                <Grid
                    item xs={12} sm={6}
                    container
                    spacing={1}
                    alignItems='center'
                >
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Standard</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <ToggleButtonGroup
                                color="primary"
                                exclusive
                            >
                                <ToggleButton value='erc20'>
                                    ERC20
                                </ToggleButton>
                                <ToggleButton value='erc721'>
                                    ERC721
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id='name'
                                name='name'
                                label='String'
                                required
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
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Symbol</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id='symbol'
                                name='symbol'
                                label='String'
                                required
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
                <Grid
                    item xs={12} sm={6}
                    container
                    spacing={1}
                    alignItems='center'
                >
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Owner</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id='owner'
                                name='owner'
                                label='Address'
                                required
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
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Decimals</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id='decimals'
                                name='decimals'
                                label='Number'
                                required
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
                    <Grid
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                    >
                        <Grid item xs={4}>
                            <Typography>Initial Supply</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id='initialSupply'
                                name='initialSupply'
                                label='Number'
                                required
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
            </Grid>
        </Grid>
    );
}
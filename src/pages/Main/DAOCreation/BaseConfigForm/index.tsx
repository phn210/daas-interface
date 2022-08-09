import { Grid, Switch, TextField, Typography } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function BaseConfigForm() {
    return (
        <Grid
            container
            columnSpacing={4}
            rowSpacing={2}
            alignItems='center'
        >
            <Grid
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={4}>
                    <Typography>Voting Delay</Typography>
                </Grid>
                <Grid
                    item xs={8}
                    container
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Grid item xs={5}>
                        <TextField
                            id='minVotingDelay'
                            name='minVotingDelay'
                            label='Min'
                            fullWidth
                            size='small'
                            InputProps={{
                                sx: {
                                    bgcolor: 'background.default',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs='auto'>
                        <HorizontalRuleIcon/>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id='maxVotingDelay'
                            name='maxVotingDelay'
                            label='Max'
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
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={4}>
                    <Typography>Voting Period</Typography>
                </Grid>
                <Grid
                    item xs={8}
                    container
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Grid item xs={5}>
                        <TextField
                            id='minVotingPeriod'
                            name='minVotingPeriod'
                            label='Min'
                            fullWidth
                            size='small'
                            InputProps={{
                                sx: {
                                    bgcolor: 'background.default',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs='auto'>
                        <HorizontalRuleIcon/>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id='maxVotingPeriod'
                            name='maxVotingPeriod'
                            label='Max'
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
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={6}>
                    <Typography>Whitelist Proposers</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Switch/>
                </Grid>
            </Grid>
            <Grid
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={6}>
                    <Typography>Default Expiration</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id='expiration'
                        name='expiration'
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
    );
}
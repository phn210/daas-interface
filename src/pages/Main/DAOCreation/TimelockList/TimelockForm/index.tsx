import { Grid, TextField, Typography } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function TimelockForm() {
    return (
        <Grid
            container
            columnSpacing={4}
            rowSpacing={1}
            alignItems='center'
        >
            <Grid
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={4}>
                    <Typography>Delay Bounds</Typography>
                </Grid>
                <Grid
                    item xs={8}
                    container
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Grid item xs={5}>
                        <TextField
                            id='minTimelockDelay'
                            name='minTimelockDelay'
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
                            id='maxTimelockDelay'
                            name='maxTimelockDelay'
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
                    <Typography>Timelock Delay</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id='votingDelay'
                        name='votingDelay'
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
                item xs={12}
                container
                spacing={1}
                alignItems='center'
            >
                <Grid item xs={4}>
                    <Typography>Grace Period</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id='gracePeriod'
                        name='gracePeriod'
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
            <Grid item xs={12} mt={1}>
                <Typography
                    sx={{
                        color:'info.main',
                        // fontStyle: 'italic'
                    }}
                >
                    The zero timelock will be master of others timelock contracts.
                </Typography>
            </Grid>
        </Grid>
    );
}
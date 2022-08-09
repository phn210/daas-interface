import { Grid, TextField, Typography } from '@mui/material';

export default function ConfigForm() {
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
                <Grid item xs={6}>
                    <Typography>Voting Delay</Typography>
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                    <Typography>Voting Period</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id='votingPeriod'
                        name='votingPeriod'
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
                <Grid item xs={6}>
                    <Typography>Quorum Attendance</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id='quorumAttendance'
                        name='quorumAttendance'
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
                <Grid item xs={6}>
                    <Typography>Quorum Approval</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id='quorumApproval'
                        name='quorumApproval'
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
import { Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { GovernorConfig } from 'src/contexts/daos-context/types';

type Props = {
    value: GovernorConfig;
    onChange: (_config: GovernorConfig) => void;
    display: string;
}   

export default function ConfigForm(props: Props) {
    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'votingDelay':
                currentValue.votingDelay = value;
                break;
            case 'votingPeriod':
                currentValue.votingPeriod = value;
                break;
            case 'quorumAttendance':
                currentValue.quorumAttendance = value;
                break;
            case 'quorumApproval':
                currentValue.quorumApproval = value;
                break;
            default: break;
        }
        props.onChange(currentValue);
    }

    const onInputsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        handleInputsChange(ev.target.name, ev.target.value)
    }

    return (
        <Grid
            container
            columnSpacing={4}
            rowSpacing={1}
            alignItems='center'
            display={props.display}
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
                        onChange={onInputsChange}
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
                        onChange={onInputsChange}
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
                        onChange={onInputsChange}
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            },
                            inputProps: {
                                min: 0,
                                max: 100
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
                        onChange={onInputsChange}
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            },
                            inputProps: {
                                min: 0,
                                max: 100
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
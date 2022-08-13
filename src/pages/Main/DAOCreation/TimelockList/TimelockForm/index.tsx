import { Grid, TextField, Typography } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { TimelockConfig } from 'src/contexts/daos-context/types';

type Props = {
    value: TimelockConfig;
    onChange: (_config: TimelockConfig) => void;
    display: string
}

export default function TimelockForm(props: Props) {
    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'minTimelockDelay':
                currentValue.minTimelockDelay = value;
                break;
            case 'maxTimelockDelay':
                currentValue.maxTimelockDelay = value;
                break;
            case 'delay':
                currentValue.delay = value;
                break;
            case 'gracePeriod':
                currentValue.gracePeriod = value;
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
                            onChange={onInputsChange}
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
                            onChange={onInputsChange}
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
                        onChange={onInputsChange}
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
                    }}
                >
                    The zero timelock will be master of others timelock contracts.
                </Typography>
            </Grid>
        </Grid>
    );
}
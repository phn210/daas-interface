import React, { useState } from 'react';
import { Grid, Switch, TextField, Typography } from '@mui/material';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { BaseConfig } from 'src/contexts/daos-context/types';

type Props = {
    value: BaseConfig;
    onChange: (_config: BaseConfig, _isValid: boolean) => void;
}

export default function BaseConfigForm(props: Props) {
    const [isWhitelist, setIsWhitelist] = useState(false);

    const handleSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setIsWhitelist(ev.target.checked);
    }

    const validInputs = (inputs: BaseConfig) => {
        if (inputs.minVotingDelay > inputs.maxVotingDelay) return false;
        if (inputs.minVotingPeriod > inputs.maxVotingPeriod) return false;
        return true;
    }

    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'minVotingDelay':
                currentValue.minVotingDelay = value;
                break;
            case 'maxVotingDelay':
                currentValue.maxVotingDelay = value;
                break;
            case 'minVotingPeriod':
                currentValue.minVotingPeriod = value;
                break;
            case 'maxVotingPeriod':
                currentValue.maxVotingPeriod = value;
                break;
            case 'isWhiteListRequired':
                currentValue.isWhiteListRequired = value;
                break;
            case 'defaultExpiration':
                currentValue.defaultExpiration = value;
                break;
            default: break;
        }
        props.onChange(currentValue, validInputs(currentValue));
    }

    const onInputsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        handleInputsChange(ev.target.name, ev.target.value)
    }

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
                            id='maxVotingDelay'
                            name='maxVotingDelay'
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
                            id='maxVotingPeriod'
                            name='maxVotingPeriod'
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
                <Grid item xs={6}>
                    <Typography>Whitelist Proposers</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Switch checked={isWhitelist} onChange={handleSwitch}/>
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
                        label={isWhitelist ? 'Number' : ''}
                        required
                        fullWidth
                        size='small'
                        disabled={!isWhitelist}
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
    );
}
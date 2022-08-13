import React, { useState } from 'react';
import { Box, Button, Grid, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { GTokenConfig } from 'src/contexts/daos-context/types';
import { isAddress } from 'src/utils';

type Props = {
    value: GTokenConfig;
    onChange: (_config: GTokenConfig, _isValid: boolean) => void;
}

export default function GTokenForm(props: Props) {
    const [displayInputs, setDisplayInputs] = useState(true);
    const [standard, setStandard] = useState<number | null>(0);

    const handleSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayInputs(!ev.target.checked);
    }

    const handleStandard = (ev: React.MouseEvent<HTMLElement>, newStandard: number | null) => {
        setStandard(newStandard)
        handleInputsChange('standard', newStandard);
    }

    const validInputs = (inputs: GTokenConfig) => {
        if (inputs.deployedAddress != '' && !isAddress(inputs.deployedAddress)) return false;
        if (![0, 1].includes(inputs.standard)) return false;
        if (inputs.name == '') return false;
        if (inputs.owner == '') return false;
        if (inputs.owner != '' && !isAddress(inputs.owner)) return false;
        return true;
    }

    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'standard':
                currentValue.standard = value;
                break;
            case 'name':
                currentValue.name = value;
                break;
            case 'symbol':
                currentValue.symbol = value;
                break;
            case 'owner':
                currentValue.owner = value;
                break;
            case 'decimals':
                currentValue.decimals = value;
                break;
            case 'initialSupply':
                currentValue.initialSupply = value;
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
                    <Switch checked={!displayInputs} onChange={handleSwitch}/>
                </Grid>
                <Grid item>
                    <Typography>Deployed Address:</Typography>
                </Grid>
                <Grid item xs='auto'>
                    <TextField
                        id='deployedAddress'
                        name='deployedAddress'
                        fullWidth
                        size='small'
                        onChange={onInputsChange}
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
                display={displayInputs == true ? 'flex' : 'none'}
            >
                <Grid
                    item xs={12} sm={6}
                    container
                    spacing={1}
                    alignItems='flex-start'
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
                                value={standard}
                                color="primary"
                                exclusive
                                onChange={handleStandard}
                            >
                                <ToggleButton value={0}>
                                    ERC20
                                </ToggleButton>
                                <ToggleButton value={1}>
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
                    item xs={12} sm={6}
                    container
                    spacing={1}
                    alignItems='flex-start'
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
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                        display={standard == 0 ? 'flex' : 'none'}
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
                        item xs={12} mt={1}
                        container
                        spacing={1}
                        alignItems='center'
                        display={standard == 0 ? 'flex' : 'none'}
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
            </Grid>
        </Grid>
    );
}
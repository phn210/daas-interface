import { Wallet } from 'ethers';
import React, { useState } from 'react';
import { Grid, IconButton, TextField, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Empty from 'src/components/Empty';
import { FACTORY_CONFIG } from 'src/constants';
import { Action } from 'src/contexts/proposals-context/types';

type Props = {
    value: Action[];
    onChange: (_actions: Action[], _isValid: boolean) => void;
}

export default function ActionList(props: Props) {
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

    const [reload, setReload] = useState(0);

    const emptyAction: Action = {
        target: '',
        value: 0,
        signature: '',
        data: ''
    }

    const onAddAction = (ev: React.SyntheticEvent) => {
        const currentValue = props.value;
        if (currentValue.length == FACTORY_CONFIG.MAX_GOVERNOR_CONFIG) return;
        currentValue.push(emptyAction);
        setReload(1 - reload);
        props.onChange(currentValue, true);
    }

    const onRemoveAction = (ev: React.SyntheticEvent) => {
        const currentValue = props.value;
        currentValue.pop();
        setReload(1 -reload);
        props.onChange(currentValue, true);
    }

    const onUpdateAction = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const index = Number(ev.target.name.slice(-1))
        const key = ev.target.name.slice(0, -1)
        const changedValue: Action = props.value[index];
        switch (key) {
            case 'target':
                changedValue.target = ev.target.value;
                break;
            case 'value':
                changedValue.value = Number(ev.target.value);
                break;
            case 'signature':
                changedValue.signature = ev.target.value;
                break;
            case 'data':
                changedValue.data = ev.target.value;
                break;
            default: break;
        }
        const currentValue = props.value;
        currentValue[index] = changedValue;
        props.onChange(currentValue, true);
    }

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
                    <IconButton
                        key={'addAction'}
                        size='large'
                    >
                        <AddCircleOutlineIcon sx={{color:'text.primary'}} onClick={onAddAction}/>
                    </IconButton>
                    <TextField
                        id='numActions'
                        name='numActions'
                        size='small'
                        disabled
                        value={props.value.length}
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                                width: 60,
                                textAlign: 'center'
                            }
                        }}
                    />
                    <IconButton
                        key={'removeAction'}
                        size='large'   
                    >
                        <RemoveCircleOutlineIcon onClick={onRemoveAction}/>
                    </IconButton>
                </Grid>
            </Grid>
            {props.value.length === 0 && (
                <Grid item xs={12}>
                    <Empty py={4} />
                </Grid>
            )}
            {props.value.length > 0 && (props.value.map((item, index: number) => {
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
                                    onChange={onUpdateAction}
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
                                    onChange={onUpdateAction}
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
                                    onChange={onUpdateAction}
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
                                    onChange={onUpdateAction}
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
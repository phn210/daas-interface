import React, { useState } from 'react';
import { Avatar, Box, Button, IconButton, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { FACTORY_CONFIG } from 'src/constants';
import { BaseConfig, GovernorConfig } from 'src/contexts/daos-context/types';
import ConfigForm from './ConfigForm';

type Props = {
    value: GovernorConfig[];
    baseValue: BaseConfig;
    onChange: (_configs: GovernorConfig[], _isValid: boolean) => void;
}

export default function ConfigList(props: Props) {
    const [displayItem, setDisplayItem] = useState(0);

    const initialGovernorConfig: GovernorConfig = {
        votingDelay: 1,
        votingPeriod: 1,
        quorumAttendance: 0,
        quorumApproval: 0
    }

    const validInputs = (configs: GovernorConfig[]) => {
        return true;
    }

    const onAddConfig = (ev: React.SyntheticEvent) => {
        const currentValue = props.value;
        if (currentValue.length == FACTORY_CONFIG.MAX_GOVERNOR_CONFIG) return;
        currentValue.push(initialGovernorConfig);
        setDisplayItem(displayItem+1);
        props.onChange(currentValue, true);
    }

    const onRemoveConfig = (ev: React.SyntheticEvent) => {
        const currentValue = props.value;
        if (currentValue.length == 1) return;
        currentValue.pop();
        setDisplayItem(displayItem-1);
        props.onChange(currentValue, true);
        
    }

    const onUpdateConfig = (config: GovernorConfig) => {
        const currentValue = props.value;
        currentValue[displayItem] = config;
        props.onChange(currentValue, true);
    }

    const onSelectConfig = (ev: React.SyntheticEvent) => {
        const index = Number((ev.target as HTMLElement).innerHTML);
        setDisplayItem(index);
    }
    
    return (
        <Grid container spacing={1} sx={{ height: '100%' }} direction='column'>
            <Grid item container spacing={1} justifyContent='flex-start' alignItems='center' mb={1}>
                {props.value.length > 0 && props.value.map((item, index: number) => {
                    return (
                        <IconButton
                            key={'governorConfig'+index}
                            size='small'
                        >
                            <Avatar sx={{ bgcolor: displayItem == index ? 'primary.main' : 'background.default' }}>
                                <Typography color='text.primary' onClick={onSelectConfig}>{index}</Typography>
                            </Avatar>
                        </IconButton>
                    );
                })}
                {props.value.length < FACTORY_CONFIG.MAX_GOVERNOR_CONFIG && (
                    <IconButton
                        key={'addGovernorConfig'}
                        size='large'
                    >
                        <AddCircleOutlineIcon sx={{color:'text.primary'}} onClick={onAddConfig}/>
                    </IconButton>
                )}
                {props.value.length > 1 && (
                    <IconButton
                        key={'removeGovernorConfig'}
                        size='large'   
                    >
                        <DeleteIcon onClick={onRemoveConfig}/>
                    </IconButton>
                )}
            </Grid>
            {props.value.length > 0 && props.value.map((item, index: number) => {
                return (
                    <ConfigForm 
                        key={`configForm${index}`}
                        value={props.value[displayItem]}
                        onChange={onUpdateConfig}
                        display={index == displayItem ? 'flex' : 'none'}
                    />
                );
            })}
            
        </Grid>
    );
}
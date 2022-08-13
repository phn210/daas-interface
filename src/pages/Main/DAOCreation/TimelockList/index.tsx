import { useState } from 'react';
import { Avatar, Box, Button, IconButton, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { FACTORY_CONFIG } from 'src/constants';
import { TimelockConfig } from 'src/contexts/daos-context/types';
import TimelockForm from './TimelockForm';

type Props = {
    value: TimelockConfig[];
    onChange: (_configs: TimelockConfig[], _isValid: boolean) => void;
}

export default function TimelockList(props: Props) {
    const [displayItem, setDisplayItem] = useState(0);
    
    const initialTimelockConfig: TimelockConfig = {
        minTimelockDelay: 1,
        maxTimelockDelay: 100000,
        delay: 1,
        gracePeriod: 100000,
    }

    const validInputs = (configs: TimelockConfig[]) => {
        return true;
    }

    const onAddConfig = (ev: React.SyntheticEvent) => {
        const currentValue = props.value;
        if (currentValue.length == FACTORY_CONFIG.MAX_TIMELOCK_CONFIG) return;
        currentValue.push(initialTimelockConfig);
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

    const onUpdateConfig = (config: TimelockConfig) => {
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
                            key={'timelockConfig'+index}
                            size='small'
                            color='info'
                        >
                            <Avatar sx={{ bgcolor: displayItem == index ? 'primary.main' : 'background.default' }}>
                                <Typography color='text.primary' onClick={onSelectConfig}>{index}</Typography>
                            </Avatar>
                        </IconButton>
                    );
                })}
                {props.value.length < FACTORY_CONFIG.MAX_GOVERNOR_CONFIG && (
                    <IconButton
                        key={'addTimelockConfig'}
                        size='small'
                    >
                        <Avatar sx={{ bgcolor: 'background.default' }}>
                            <AddCircleOutlineIcon sx={{color:'text.primary'}} onClick={onAddConfig}/>
                        </Avatar>
                    </IconButton>
                )}
                {props.value.length > 1 && (
                    <IconButton
                        key={'removeTimelockConfig'}
                        size='large'   
                    >
                        <DeleteIcon onClick={onRemoveConfig}/>
                    </IconButton>
                )}
            </Grid>
            {props.value.length > 0 && props.value.map((item, index: number) => {
                return (
                    <TimelockForm 
                        key={`timelockForm${index}`}
                        value={props.value[displayItem]}
                        onChange={onUpdateConfig}
                        display={index == displayItem ? 'flex' : 'none'}
                    />
                );
            })}
        </Grid>
    );
}